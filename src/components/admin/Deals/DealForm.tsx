import React, { useState } from 'react';
import {
  X,
  Save,
  Calendar,
  Tag,
  Percent,
  DollarSign,
  Users,
  Package,
  Target,
  Image,
  AlertCircle
} from 'lucide-react';
import { Deal } from '../../../types/deals';
import { adminDealsService } from '../../../services/adminDeals.service';

interface DealFormProps {
  deal?: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onDealSaved: () => void;
}

interface DealFormData {
  title: string;
  subtitle: string;
  description: string;
  offerType: Deal['offerType'];
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  originalPrice?: number;
  salePrice?: number;
  image: string;
  isActive: boolean;
  validFrom: string;
  validUntil?: string;
  slug: string;
  category: string[];
  product_id: string;
  products?: string[];
  priority: number;
  maxUses?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  tags: string[];
  targetAudience: 'all' | 'new-customers' | 'existing-customers' | 'vip';
  couponCode?: string;
  couponRequired: boolean;
}

const DealForm: React.FC<DealFormProps> = ({
  deal,
  isOpen,
  onClose,
  onDealSaved
}) => {
  const [formData, setFormData] = useState<DealFormData>(() => {
    if (deal) {
      return {
        title: deal.title,
        subtitle: deal.subtitle,
        description: deal.description,
        offerType: deal.offerType,
        discount: deal.discount,
        discountType: deal.discountType,
        originalPrice: deal.originalPrice,
        salePrice: deal.salePrice,
        image: deal.image,
        isActive: deal.isActive,
        validFrom: new Date(deal.validFrom).toISOString().split('T')[0],
        validUntil: deal.validUntil ? new Date(deal.validUntil).toISOString().split('T')[0] : '',
        slug: deal.slug,
        category: deal.category,
        product_id: deal.product_id,
        products: deal.products,
        priority: deal.priority,
        maxUses: deal.maxUses,
        minOrderAmount: deal.minOrderAmount,
        maxDiscountAmount: deal.maxDiscountAmount,
        tags: deal.tags,
        targetAudience: deal.targetAudience || 'all',
        couponCode: deal.couponCode,
        couponRequired: deal.couponRequired
      };
    }
    return {
      title: '',
      subtitle: '',
      description: '',
      offerType: 'discount',
      image: '/api/placeholder/300/200',
      isActive: true,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      slug: '',
      category: [],
      product_id: '',
      priority: 5,
      tags: [],
      targetAudience: 'all',
      couponRequired: false
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newProduct, setNewProduct] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.product_id.trim()) {
      newErrors.product_id = 'Primary product ID is required';
    }

    if (!formData.validFrom) {
      newErrors.validFrom = 'Valid from date is required';
    }

    if (formData.validUntil && new Date(formData.validUntil) <= new Date(formData.validFrom)) {
      newErrors.validUntil = 'Valid until date must be after valid from date';
    }

    if (formData.offerType !== 'free-shipping' && formData.offerType !== 'buy-get-free' && !formData.discount) {
      newErrors.discount = 'Discount is required for this offer type';
    }

    if (formData.discount && formData.discount <= 0) {
      newErrors.discount = 'Discount must be greater than 0';
    }

    if (formData.discountType === 'percentage' && formData.discount && formData.discount > 100) {
      newErrors.discount = 'Percentage discount cannot exceed 100%';
    }

    if (formData.priority < 1 || formData.priority > 10) {
      newErrors.priority = 'Priority must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.category.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        category: [...prev.category, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.filter(cat => cat !== categoryToRemove)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addProduct = () => {
    if (newProduct.trim() && (!formData.products || !formData.products.includes(newProduct.trim()))) {
      setFormData(prev => ({
        ...prev,
        products: [...(prev.products || []), newProduct.trim()]
      }));
      setNewProduct('');
    }
  };

  const removeProduct = (productToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products?.filter(product => product !== productToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const dealData = {
        ...formData,
        validFrom: new Date(formData.validFrom),
        validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
        createdBy: 'admin-user-1', // This should come from auth context
        start_date: formData.validFrom,
        end_date: formData.validUntil || formData.validFrom,
        is_available: 'yes',
        user_data: {
          can_claim: true,
          has_claimed: null
        },
        usage_count: 0,
        usage_statistics: {
          total_claims: 0,
          remaining_uses: formData.maxUses || 0,
          usage_percentage: 0
        },
        applies_to: {
          categories: formData.category,
          products: formData.products || []
        },
        deal_type: formData.offerType,
        discount_value: formData.discount?.toString() || '0',
        // Ensure required fields are present
        offerType: formData.offerType || 'discount',
        isActive: formData.isActive ?? true,
        slug: formData.slug || '',
        category: formData.category || [],
        product_id: (formData.products && formData.products[0]) || 'default-product-id',
        priority: formData.priority || 5,
        tags: formData.tags || [],
        targetAudience: formData.targetAudience || 'all',
        couponRequired: formData.couponRequired || false
      } as Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'currentUses' | 'views' | 'clicks' | 'conversions' | 'revenue'>;

      if (deal) {
        await adminDealsService.updateDeal(deal.id, dealData);
      } else {
        await adminDealsService.createDeal(dealData);
      }

      onDealSaved();
      onClose();
    } catch (error) {
      console.error('Error saving deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit} className="max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-fredoka font-bold text-charcoal">
                  {deal ? 'Edit Deal' : 'Create New Deal'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Deal Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter deal title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 font-fredoka flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="Enter deal subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Describe the deal"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 font-fredoka flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="url-slug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Primary Product ID *
                    </label>
                    <input
                      type="text"
                      value={formData.product_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, product_id: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                        errors.product_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter primary product ID"
                    />
                    {errors.product_id && (
                      <p className="mt-1 text-sm text-red-600 font-fredoka flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.product_id}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 font-fredoka">
                      This is the main product associated with this deal
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Deal Image URL
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        placeholder="Enter image URL"
                      />
                      {formData.image && (
                        <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                          <img 
                            src={formData.image} 
                            alt="Deal preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/300/200';
                            }}
                          />
                        </div>
                      )}
                      <p className="text-xs text-gray-500 font-fredoka">
                        Enter a URL for the deal image (400x300 recommended)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Offer Type
                    </label>
                    <select
                      value={formData.offerType}
                      onChange={(e) => setFormData(prev => ({ ...prev, offerType: e.target.value as Deal['offerType'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    >
                      <option value="discount">Discount</option>
                      <option value="buy-get-free">Buy Get Free</option>
                      <option value="free-shipping">Free Shipping</option>
                      <option value="bundle">Bundle Offer</option>
                      <option value="flash-sale">Flash Sale</option>
                      <option value="bulk-discount">Bulk Discount</option>
                    </select>
                  </div>

                  {formData.offerType !== 'buy-get-free' && formData.offerType !== 'free-shipping' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                            Discount *
                          </label>
                          <input
                            type="number"
                            value={formData.discount || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                            className={`w-full px-3 py-2 border rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                              errors.discount ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0"
                            min="0"
                          />
                          {errors.discount && (
                            <p className="mt-1 text-sm text-red-600 font-fredoka">
                              {errors.discount}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                            Type
                          </label>
                          <select
                            value={formData.discountType || 'percentage'}
                            onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                        </div>
                      </div>

                      {formData.discountType === 'percentage' && (
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                            Maximum Discount Amount
                          </label>
                          <input
                            type="number"
                            value={formData.maxDiscountAmount || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: Number(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                            placeholder="Maximum discount cap"
                            min="0"
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                        Priority (1-10)
                      </label>
                      <input
                        type="number"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                        className={`w-full px-3 py-2 border rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                          errors.priority ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="1"
                        max="10"
                      />
                      {errors.priority && (
                        <p className="mt-1 text-sm text-red-600 font-fredoka">
                          {errors.priority}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                        Target Audience
                      </label>
                      <select
                        value={formData.targetAudience}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value as typeof formData.targetAudience }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      >
                        <option value="all">All Customers</option>
                        <option value="new-customers">New Customers</option>
                        <option value="existing-customers">Existing Customers</option>
                        <option value="vip">VIP Customers</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
                      />
                      <span className="ml-2 text-sm font-fredoka">Deal is active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-fredoka font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Validity Period
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Valid From *
                    </label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                        errors.validFrom ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.validFrom && (
                      <p className="mt-1 text-sm text-red-600 font-fredoka">
                        {errors.validFrom}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={formData.validUntil || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                        errors.validUntil ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.validUntil && (
                      <p className="mt-1 text-sm text-red-600 font-fredoka">
                        {errors.validUntil}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Minimum Order Amount
                    </label>
                    <input
                      type="number"
                      value={formData.minOrderAmount || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Usage Limits */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-fredoka font-semibold mb-4">Usage Limits</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Maximum Uses
                    </label>
                    <input
                      type="number"
                      value={formData.maxUses || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxUses: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="Unlimited"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-fredoka font-semibold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Coupon Code
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-gray-700 mb-2">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      value={formData.couponCode || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, couponCode: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="DEAL20"
                    />
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.couponRequired}
                        onChange={(e) => setFormData(prev => ({ ...prev, couponRequired: e.target.checked }))}
                        className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
                      />
                      <span className="ml-2 text-sm font-fredoka">Coupon code required</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-fredoka font-semibold mb-4">Categories</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="Add category"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.category.map((cat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-fredoka flex items-center gap-2"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => removeCategory(cat)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-fredoka font-semibold mb-4">Tags</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-fredoka flex items-center gap-2"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Associated Products */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-fredoka font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Associated Products (Optional)
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProduct}
                      onChange={(e) => setNewProduct(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="Product ID"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProduct())}
                    />
                    <button
                      type="button"
                      onClick={addProduct}
                      className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.products?.map((product, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-fredoka flex items-center gap-2"
                      >
                        {product}
                        <button
                          type="button"
                          onClick={() => removeProduct(product)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-fredoka hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DealForm;