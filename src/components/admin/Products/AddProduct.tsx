import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Image as ImageIcon, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../../types';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    subcategory: '',
    stock: '',
    description: '',
    discount: ''
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const categories = {
    dogs: ['food', 'toys', 'beds', 'grooming', 'accessories'],
    cats: ['food', 'toys', 'beds', 'litter', 'accessories'],
    birds: ['food', 'cages', 'toys', 'accessories'],
    'other-animals': ['food', 'housing', 'accessories'],
    'vet-diet': ['prescription', 'therapeutic', 'supplements']
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset subcategory when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        subcategory: ''
      }));
    }
  };

  const calculateDiscount = () => {
    const price = parseFloat(formData.price);
    const originalPrice = parseFloat(formData.originalPrice);
    
    if (originalPrice > price) {
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      setFormData(prev => ({
        ...prev,
        discount: discount.toString()
      }));
    }
  };

  const addImage = () => {
    if (currentImageUrl.trim()) {
      setImages([...images, currentImageUrl.trim()]);
      setCurrentImageUrl('');
      
      // Set the first image as the main image
      if (images.length === 0 && !formData.image) {
        setFormData(prev => ({
          ...prev,
          image: currentImageUrl.trim()
        }));
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    // If we removed the main image, set the next one as main
    if (formData.image === images[index]) {
      setFormData(prev => ({
        ...prev,
        image: newImages[0] || ''
      }));
    }
  };

  const setAsMainImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.brand || !formData.price || !formData.category || !formData.subcategory || !formData.stock) {
        throw new Error('Please fill in all required fields');
      }

      // Create new product
      const newProduct: Product = {
        id: uuidv4(),
        name: formData.name,
        brand: formData.brand,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image: formData.image || images[0] || 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image',
        images: images.length > 0 ? images : undefined,
        rating: 0,
        reviews: 0,
        category: formData.category,
        subcategory: formData.subcategory,
        inStock: parseInt(formData.stock) > 0,
        stock: parseInt(formData.stock),
        discount: formData.discount ? parseInt(formData.discount) : undefined,
        description: formData.description || undefined
      };

      // Get existing products from localStorage
      const existingProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      
      // Add new product
      existingProducts.push(newProduct);
      
      // Save back to localStorage
      localStorage.setItem('adminProducts', JSON.stringify(existingProducts));
      
      // Navigate back to products list
      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold">Add New Product</h1>
        </div>
        <p className="text-gray-600 ml-11">Create a new product for your store</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center justify-between">
          <span className="font-fredoka text-red-500">{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <h2 className="text-lg font-medium mb-4">Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Main Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="dogs">Dogs</option>
                  <option value="cats">Cats</option>
                  <option value="birds">Birds</option>
                  <option value="other-animals">Other Animals</option>
                  <option value="vet-diet">Vet Diet</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory *
                </label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                  disabled={!formData.category}
                >
                  <option value="">Select subcategory</option>
                  {formData.category && categories[formData.category as keyof typeof categories]?.map(sub => (
                    <option key={sub} value={sub}>
                      {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-lg font-medium mb-4">Pricing & Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rs.) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (Rs.)
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  onBlur={calculateDiscount}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div>
            <h2 className="text-lg font-medium mb-4">Product Images</h2>
            
            {/* Add Image URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={currentImageUrl}
                  onChange={(e) => setCurrentImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  placeholder="https://example.com/product-image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addImage}
                  disabled={!currentImageUrl.trim()}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Click on an image to set it as the main product image. The main image is highlighted with a blue border.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div
                        onClick={() => setAsMainImage(img)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          formData.image === img ? 'border-primary-blue' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Invalid+Image';
                          }}
                        />
                        {formData.image === img && (
                          <div className="absolute top-1 left-1 bg-primary-blue text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {images.length === 0 && (
              <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No images added yet</p>
                <p className="text-sm text-gray-400 mt-1">Add image URLs above to display product images</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-medium mb-4">Description</h2>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Product Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="Enter product description..."
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;