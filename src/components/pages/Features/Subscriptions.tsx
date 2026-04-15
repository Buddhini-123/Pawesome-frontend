// src/pages/Subscriptions.tsx
import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Award,
  HeadphonesIcon,
  Package,
  X,
  Plus,
  Minus,
  Calendar,
  Percent as PercentIcon,
  Eye,
  Check,
  TruckIcon,
  ShieldCheck,
  Heart,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  SkipForward,
  Trash2,
  Repeat,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ActiveSubscriptionsSidebar from '../../subscriptions/ActiveSubscriptionsSidebar'
import { api } from "../../../services/api"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Subscription {
  id: number;
  status: string;
  status_label: string;
  name: string;
  startDate: Date;
  frequency: number;
  schedule: {
    interval_type: string;
    interval_value: number;
    interval_description: string;
    start_date: string;
    end_date: string;
    next_delivery_date: string;
    last_delivery_date: string | null;
    days_until_next_delivery: number;
  };
  pricing: {
    subtotal: number;
    discount_amount: number;
    discount_percentage: number;
    tax_amount: number;
    total_amount: number;
    total_subscription_cost?: number;
    per_delivery_cost?: number;
    currency: string;
  };
  delivery_schedule?: {
    total_deliveries: number;
    completed_deliveries: number;
    remaining_deliveries: number;
  };
  items: any[];
  total_items: number;
  delivery: { address_id: number; payment_method_id: number };
  preferences?: Record<string, any>;
  metadata?: any[];
  timestamps?: Record<string, any>;
  actions?: Record<string, any>;
  deliveryAddress: string;
  nextDelivery: string | null;
   total: number;
  savedAmount: number;
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: number
  name: string
  slug: string
  price: number
  stock_quantity: number
  category: Category
  primary_image?: { url: string } | null;
  preferences: string
  quantity: number
  brand?: string;
  originalPrice?: number;
  discount_percentage?: number;
  images?: { url: string }[];
  rating?: number;
  rating_avg?: number;
  review_count?: number;
  is_in_stock?: boolean;
  description?: string;
  subcategory?: string;
  currency?: string;
  // Subscription fields
  subscription_enabled?: boolean;
  subscription_discount_percentage?: number;
  min_subscription_quantity?: number;
  max_subscription_quantity?: number;
  // Weight and dimensions
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit?: string;
  };
}

interface MappedSubscription {
  id: any;
  name: string;
  products: any;
  frequency: any;
  nextDelivery: any;
  total: any;
  startDate: any;
  status: any;
  deliveryAddress: string;
  savedAmount: any;
  totalDeliveries?: number;
  completedDeliveries?: number;
  remainingDeliveries?: number;
  perDeliveryCost?: number;
  totalSubscriptionCost?: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}


const Subscriptions = () => {

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [confirmedProducts, setConfirmedProducts] = useState<Product[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [deliveryFrequency, setDeliveryFrequency] = useState('monthly')
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeSubscriptions, setActiveSubscriptions] = useState<MappedSubscription[]>([]);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [deliveryPeriod, setDeliveryPeriod] = useState("");
  const [intervalType, setIntervalType] = useState<'weekly' | 'monthly' | 'custom'>('weekly');
  const [intervalValue, setIntervalValue] = useState(1);

  // Inline action states (replace window.confirm / prompt)
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showConfirmPause, setShowConfirmPause] = useState(false);
  const [showConfirmSkip, setShowConfirmSkip] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [showRescheduleInput, setShowRescheduleInput] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get("/subscriptions");
      const data = response.data as {
        success: boolean;
        data: any[];
        pagination: any;
      };

      console.log("Mapped subscriptions2:", data.data); // Debug log

      if (data && Array.isArray(data.data)) {
        const mappedSubscriptions: MappedSubscription[] = data.data.map((item: any) => {
          // Map all product names for display
          const productNames = item.items?.map((subItem: any) => subItem.product?.name) || [];

          return {
            id: item.id,
            name: productNames.join(", ") || "Unknown Product", // Join all product names
            products: item.total_items || 0,
            frequency: item.schedule?.interval_description || "N/A",
            nextDelivery: item.schedule?.next_delivery_date || null,
            total: item.pricing?.total_amount || 0,
            startDate: item.schedule?.start_date || null,
            status: item.status_label || "Unknown",
            deliveryAddress: item.delivery?.address_id
              ? `Address ID: ${item.delivery.address_id}`
              : "Default Address",
            savedAmount: item.items?.reduce((sum: number, subItem: any) => sum + (subItem.pricing?.total_savings || 0), 0) || 0,
            // Enhanced delivery schedule tracking
            totalDeliveries: item.delivery_schedule?.total_deliveries,
            completedDeliveries: item.delivery_schedule?.completed_deliveries || 0,
            remainingDeliveries: item.delivery_schedule?.remaining_deliveries,
            perDeliveryCost: item.pricing?.per_delivery_cost,
            totalSubscriptionCost: item.pricing?.total_subscription_cost,
            items: item.items?.map((subItem: any) => ({
              name: subItem.product?.name || "Unknown Product",
              quantity: subItem.quantity || 1,
              price: subItem.pricing?.unit_price || 0,
            })) || [],
          };
        });

        console.log("Mapped subscriptions:", mappedSubscriptions); // Debug log
        setActiveSubscriptions(mappedSubscriptions);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("User is unauthenticated. Redirecting to login...");
      } else {
        console.error("Error fetching subscriptions:", error);
      }
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Fetch products with pagination
  const fetchProducts = async (page: number = 1, category: string = 'all') => {
    setIsLoadingProducts(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        subscription_only: 'true',
      });

      // Add category filter if not 'all'
      if (category !== 'all') {
        params.append('category', category);
      }

      const response = await api.get(`/products?${params.toString()}`);
      const data = response.data as any;

      if (data.success && data.data) {
        setProducts(data.data);

        // Handle pagination metadata
        if (data.pagination) {
          setCurrentPage(data.pagination.current_page || page);
          setTotalPages(data.pagination.last_page || 1);
          setTotalProducts(data.pagination.total || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories((res.data as any).data || []);
    });
    fetchProducts(1);
  }, []);

  // Fetch products when page or category changes
  useEffect(() => {
    if (isModalOpen) {
      fetchProducts(currentPage, selectedCategory);
    }
  }, [currentPage, selectedCategory, isModalOpen]);


  const handleProductToggle = (product: Product) => {
    // Validate product eligibility
    if (!product.subscription_enabled) {
      toast.error("This product is not available for subscription");
      return;
    }

    if (!product.is_in_stock || product.stock_quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id)
      if (isSelected) {
        // Remove product and its quantity
        const newQuantities = { ...productQuantities }
        delete newQuantities[product.id]
        setProductQuantities(newQuantities)
        return prev.filter(p => p.id !== product.id)
      } else {
        // Add product with default quantity (respect min_subscription_quantity)
        const minQty = product.min_subscription_quantity || 1;
        setProductQuantities(prev => ({ ...prev, [product.id]: minQty }))
        return [...prev, product]
      }
    })
  }

  const handleQuantityChange = (productId: string, change: number) => {
    setProductQuantities(prev => {
      // Find the product to get min/max quantities
      const product = confirmedProducts.find(p => p.id === Number(productId)) ||
                     selectedProducts.find(p => p.id === Number(productId));

      const minQty = product?.min_subscription_quantity || 1;
      const maxQty = product?.max_subscription_quantity || 99;

      const currentQty = prev[productId] || minQty;
      const newQty = Math.max(minQty, Math.min(maxQty, currentQty + change));

      // Show warning if hitting limits
      if (newQty === maxQty && currentQty + change > maxQty) {
        toast.warning(`Maximum quantity for this product is ${maxQty}`);
      } else if (newQty === minQty && currentQty + change < minQty) {
        toast.warning(`Minimum quantity for this product is ${minQty}`);
      }

      return { ...prev, [productId]: newQty }
    })
  }

  const handleConfirmSelection = (scheduleData: any) => {
    if (!scheduleData.startDate) {
      toast.error("Please select a start date");
      return;
    }

    if (scheduleData.endDate && new Date(scheduleData.endDate) <= new Date(scheduleData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    // Validate interval values
    if (!scheduleData.intervalType || !scheduleData.intervalValue) {
      toast.error("Please select a valid delivery frequency");
      return;
    }

    // Attach quantities and calculate subscription price for each product
    const productsWithQuantities = selectedProducts.map(product => {
      const quantity = productQuantities[product.id] || 1;
      const discountPercent = product.subscription_discount_percentage || 0;
      const discountMultiplier = 1 - (discountPercent / 100);
      const subscriptionPrice = Math.floor(product.price * discountMultiplier);

      return {
        ...product,
        quantity,
        subscription_price: subscriptionPrice
      };
    });

    console.log(`[Subscriptions] Creating subscription: ${productsWithQuantities.length} products, ${scheduleData.intervalType} from ${scheduleData.startDate} to ${scheduleData.endDate || 'ongoing'}`);

    navigate('/checkout', {
      state: {
        type: "subscription",
        scheduleData,
        selectedProducts: productsWithQuantities
      },
    });
  };


  const handleOpenModal = () => {
    setSelectedProducts(confirmedProducts)
    setIsModalOpen(true)
    setCurrentPage(1) // Reset to first page when opening modal
  }

  const handleSubscriptionClick = (subscription: MappedSubscription) => {
    setSelectedSubscription(subscription as any)
    setShowSubscriptionModal(true)
  }

  const handleManageSubscription = (e: React.MouseEvent, subscription: MappedSubscription) => {
    e.stopPropagation() // Prevent card click
    setSelectedSubscription(subscription as any)
    setShowSubscriptionModal(true)
  }

  const handleRemoveProduct = (productId: number) => {
    setConfirmedProducts(prev => prev.filter(p => p.id !== productId))
    const newQuantities = { ...productQuantities }
    delete newQuantities[productId]
    setProductQuantities(newQuantities)
  }

  const handleViewProductDetails = async (product: Product) => {
    try {
      // Use slug instead of id for product details endpoint
      const response = await api.get(`/products/${product.slug || product.id}`);

      if (response.success && response.data) {
        const productData = (response.data as any)?.data?.product || (response.data as any);

        // Debug: Log the full API response to check weight and dimensions
        console.log('[Subscriptions] Full API Response:', response);
        console.log('[Subscriptions] Product Data:', productData);
        console.log('[Subscriptions] Weight:', productData?.weight);
        console.log('[Subscriptions] Dimensions:', productData?.dimensions);

        setSelectedProduct(productData);
        setShowProductModal(true);
      } else {
        // Product not found or API error
        const errorMsg = (response as any).error || 'Product not found';
        console.error("Failed to load product:", errorMsg);
        toast.error(`Product not available`);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product details");
    }
  };

 const handleCancel = async (subscriptionId: number) => {
  try {
    const response = await api.delete(`/subscriptions/${subscriptionId}/cancel`);
    const data = response.data as any;

    if (data.success) {
      setShowSubscriptionModal(false);
      setSelectedSubscription(null);
      setShowConfirmCancel(false);
      toast.success("Subscription cancelled successfully");
      await fetchSubscriptions();
    } else {
      toast.error(data.message || "Failed to cancel subscription");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    console.error("Cancel subscription error:", error.response || error.message);
  }
};

const handlePause = async (subscriptionId: number) => {
  try {
    const response = await api.put(`/subscriptions/${subscriptionId}/pause`);
    const data = response.data as any;

    if (data.success) {
      toast.success("Subscription paused successfully");
      setShowConfirmPause(false);
      await fetchSubscriptions();
      setShowSubscriptionModal(false);
    } else {
      toast.error(data.message || "Failed to pause subscription");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    console.error("Pause subscription error:", error.response || error.message);
  }
};

const handleResume = async (subscriptionId: number) => {
  try {
    const response = await api.put(`/subscriptions/${subscriptionId}/resume`);
    const data = response.data as any;

    if (data.success) {
      toast.success("Subscription resumed successfully");
      await fetchSubscriptions(); // Refresh subscriptions list
      setShowSubscriptionModal(false);
    } else {
      toast.error(data.message || "Failed to resume subscription");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    console.error("Resume subscription error:", error.response || error.message);
  }
};

const handleSkipDelivery = async (subscriptionId: number) => {
  try {
    const response = await api.put(`/subscriptions/${subscriptionId}/skip-delivery`);
    const data = response.data as any;

    if (data.success) {
      toast.success("Next delivery skipped successfully");
      setShowConfirmSkip(false);
      await fetchSubscriptions();
    } else {
      toast.error(data.message || "Failed to skip delivery");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    console.error("Skip delivery error:", error.response || error.message);
  }
};

const handleReschedule = async (subscriptionId: number, newDate: string) => {
  try {
    const response = await api.put(`/subscriptions/${subscriptionId}/reschedule`, {
      next_delivery_date: newDate
    });
    const data = response.data as any;

    if (data.success) {
      toast.success("Delivery rescheduled successfully");
      setShowRescheduleInput(false);
      setRescheduleDate('');
      await fetchSubscriptions();
    } else {
      toast.error(data.message || "Failed to reschedule delivery");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    console.error("Reschedule delivery error:", error.response || error.message);
  }
};

  // Products are now filtered on the backend
  const filteredProducts = products;

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to page 1 when category changes
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Package className="text-vibrant-orange mr-3 h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-fredoka font-bold text-calm-blue">
              Pawsome Subscriptions
            </h1>
          </div>
          <p className="text-xl text-calm-blue max-w-3xl mx-auto">
            Never run out of your pet's essentials with our convenient subscription service
          </p>
        </div>

        {/* How to Subscribe Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-warm-orange p-8 text-center">
              <h2 className="text-4xl font-fredoka font-bold text-charcoal mb-2">
                How to Start Your Subscription
              </h2>
              <p className="text-charcoal/90 text-lg">
                Four simple steps to never run out of pet essentials
              </p>
            </div>
            
            {/* Steps Grid */}
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Step 1 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-vibrant-orange"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-vibrant-orange rounded-full flex items-center justify-center text-white font-fredoka font-bold text-xl shadow-lg">
                    1
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <ShoppingCart className="h-6 w-6 text-vibrant-orange mr-2" />
                      <h3 className="font-fredoka font-bold text-xl text-charcoal">
                        Choose Your Products
                      </h3>
                    </div>
                    <p className="text-medium-gray leading-relaxed">
                      Browse our extensive catalog of premium pet products. Select food, treats, toys, and grooming essentials your pet loves.
                    </p>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-blue"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-fredoka font-bold text-xl shadow-lg">
                    2
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <Calendar className="h-6 w-6 text-primary-blue mr-2" />
                      <h3 className="font-fredoka font-bold text-xl text-charcoal">
                        Set Your Schedule
                      </h3>
                    </div>
                    <p className="text-medium-gray leading-relaxed">
                      Choose delivery frequency - daily, weekly, or monthly. Set start and end dates that work for your lifestyle.
                    </p>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-mint-green"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-mint-green rounded-full flex items-center justify-center text-white font-fredoka font-bold text-xl shadow-lg">
                    3
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <Award className="h-6 w-6 text-mint-green mr-2" />
                      <h3 className="font-fredoka font-bold text-xl text-charcoal">
                        Unlock Benefits
                      </h3>
                    </div>
                    <p className="text-medium-gray leading-relaxed">
                      Enjoy 10% off every order, free shipping on orders over Rs. 2,000, and exclusive member perks.
                    </p>
                  </div>
                </motion.div>

                {/* Step 4 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-sunny-yellow"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-sunny-yellow rounded-full flex items-center justify-center text-white font-fredoka font-bold text-xl shadow-lg">
                    4
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <Package className="h-6 w-6 text-sunny-yellow mr-2" />
                      <h3 className="font-fredoka font-bold text-xl text-charcoal">
                        Sit Back & Relax
                      </h3>
                    </div>
                    <p className="text-medium-gray leading-relaxed">
                      We'll handle the rest! Track deliveries, manage subscriptions, and earn rewards automatically.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Benefits Cards */}
              <div className="bg-yellow-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-fredoka font-bold text-center text-charcoal mb-8">
                  Subscription Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="bg-sunny-yellow rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <PercentIcon className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="font-fredoka font-bold text-lg text-charcoal mb-2">Save 10%</h4>
                    <p className="text-medium-gray">On every subscription order</p>
                    <p className="text-2xl font-fredoka font-bold text-vibrant-orange mt-2">Rs. 250+</p>
                    <p className="text-xs text-medium-gray">Average monthly savings</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="bg-primary-blue rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Package className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="font-fredoka font-bold text-lg text-charcoal mb-2">Free Shipping</h4>
                    <p className="text-medium-gray">On orders above Rs. 2,000</p>
                    <p className="text-2xl font-fredoka font-bold text-primary-blue mt-2">Always</p>
                    <p className="text-xs text-medium-gray">No delivery charges</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="bg-mint-green rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <HeadphonesIcon className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="font-fredoka font-bold text-lg text-charcoal mb-2">Priority Support</h4>
                    <p className="text-medium-gray">24/7 dedicated assistance</p>
                    <p className="text-2xl font-fredoka font-bold text-mint-green mt-2">24/7</p>
                    <p className="text-xs text-medium-gray">Always here to help</p>
                  </motion.div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <motion.button
                  onClick={handleOpenModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-warm-orange hover:bg-sunny-yellow text-white font-fredoka font-bold text-xl px-16 py-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Browse Products & Start Subscription
                </motion.button>
                <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-medium-gray">
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 rotate-45 text-green-500 mr-1" />
                    <span>No commitment</span>
                  </div>
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 rotate-45 text-green-500 mr-1" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 rotate-45 text-green-500 mr-1" />
                    <span>Modify as needed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Selected Products Section - Enhanced Design */}
        {confirmedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto mt-16"
          >
            {/* Main Container with Gradient Border */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-vibrant-orange rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
              </div>

              {/* Header Section */}
              <div className="relative bg-vibrant-orange p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-fredoka font-bold text-white mb-2 flex items-center">
                      <Package className="mr-3 h-8 w-8" />
                      Your Subscription Plan
                    </h2>
                    <p className="text-white/90">Customize your delivery preferences and manage products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Total Products</p>
                    <p className="text-3xl font-fredoka font-bold text-white">{confirmedProducts.length}</p>
                  </div>
                </div>
              </div>

              <div className="relative p-8">
                {/* Subscription Settings Section */}
                <motion.div 
                  className="mb-10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-fredoka font-bold text-charcoal mb-6 flex items-center">
                    <Calendar className="mr-2 h-6 w-6 text-vibrant-orange" />
                    Delivery Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Start Date Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-vibrant-orange transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-fredoka font-semibold text-charcoal">Start Date</label>
                        <Calendar className="h-5 w-5 text-vibrant-orange" />
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-vibrant-orange focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-medium-gray mt-2">When should we start delivering?</p>
                    </motion.div>
                    
                    {/* End Date Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-primary-blue transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-fredoka font-semibold text-charcoal">End Date</label>
                        <Calendar className="h-5 w-5 text-primary-blue" />
                      </div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-medium-gray mt-2">Optional end date for subscription</p>
                    </motion.div>
                    
                    {/* Frequency Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-mint-green transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-fredoka font-semibold text-charcoal">Frequency</label>
                        <Package className="h-5 w-5 text-mint-green" />
                      </div>
                      <select
                        value={deliveryFrequency}
                        onChange={(e) => setDeliveryFrequency(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-mint-green focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="daily">Daily Delivery</option>
                        <option value="weekly">Weekly Delivery</option>
                        <option value="monthly">Monthly Delivery</option>
                      </select>
                      <p className="text-xs text-medium-gray mt-2">How often should we deliver?</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Selected Products Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-fredoka font-bold text-charcoal mb-6 flex items-center">
                    <ShoppingCart className="mr-2 h-6 w-6 text-vibrant-orange" />
                    Selected Products
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                    {confirmedProducts.map((product, index) => (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-vibrant-orange transition-all"
                      >
                        <div className="relative">
                          <img
                            src={getProductImageSrc(product)}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = PRODUCT_PLACEHOLDER; }}
                          />
                          <div className="absolute top-2 right-2 bg-vibrant-orange text-white text-xs px-2 py-1 rounded-full">
                            Save 10%
                          </div>
                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveProduct(product.id);
                            }}
                            className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
                            title="Remove product"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-fredoka font-bold text-charcoal mb-1 line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-sm text-medium-gray mb-3">{product.brand}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              {(() => {
                                const discountPercent = product.subscription_discount_percentage || 0;
                                const discountMultiplier = 1 - (discountPercent / 100);
                                const subscriptionPrice = Math.floor(product.price * discountMultiplier);
                                return (
                                  <>
                                    <span className="text-lg font-fredoka font-bold text-vibrant-orange">
                                      {product?.currency} {subscriptionPrice}
                                    </span>
                                    <span className="text-sm text-light-gray line-through ml-2">
                                      {product?.currency} {product.price}
                                    </span>
                                  </>
                                );
                              })()}
                            </div>
                            <div className="text-xs text-green-600 font-fredoka font-medium">
                              -{product.subscription_discount_percentage || 0}%
                            </div>
                          </div>
                          
                          {/* Enhanced Quantity Selector */}
                          <div className="bg-soft-gray rounded-xl p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-fredoka font-medium text-charcoal">Quantity</span>
                              <div className="flex items-center gap-3 bg-white rounded-2xl px-3 py-1 shadow-sm">
                                <button
                                 onClick={() => handleQuantityChange(String(product.id), -1)}
                                  className="w-8 h-8 rounded-full bg-light-gray hover:bg-vibrant-orange hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-base font-fredoka font-bold w-8 text-center">
                                  {productQuantities[product.id] || 1}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(String(product.id), 1)}
                                  className="w-8 h-8 rounded-full bg-light-gray hover:bg-vibrant-orange hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Summary and Actions Section */}
                <motion.div 
                  className="bg-yellow-50 rounded-2xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Pricing Summary */}
                    <div>
                      <h4 className="text-lg font-semibold text-charcoal mb-4">Order Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-medium-gray">Products Total</span>
                          <span className="font-medium">
                            Rs. {confirmedProducts.reduce((total, product) => {
                              const qty = productQuantities[product.id] || 1
                              return total + (product.price * qty)
                            }, 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-green-600">
                          <span>Subscription Discount</span>
                          <span className="font-medium">
                            -Rs. {confirmedProducts.reduce((total, product) => {
                              const qty = productQuantities[product.id] || 1
                              const discountPercent = product.subscription_discount_percentage || 0
                              return total + (product.price * qty * (discountPercent / 100))
                            }, 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="pt-3 border-t-2 border-yellow-300">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-semibold text-charcoal">
                                {deliveryFrequency.charAt(0).toUpperCase() + deliveryFrequency.slice(1)} Total
                              </p>
                              <p className="text-sm text-medium-gray">
                                Delivered {deliveryFrequency === 'daily' ? 'every day' : deliveryFrequency === 'weekly' ? 'every week' : 'every month'}
                              </p>
                            </div>
                            <p className="text-3xl font-bold text-vibrant-orange">
                              Rs. {confirmedProducts.reduce((total, product) => {
                                const qty = productQuantities[product.id] || 1
                                const discountPercent = product.subscription_discount_percentage || 0
                                const discountMultiplier = 1 - (discountPercent / 100)
                                return total + (product.price * qty * discountMultiplier)
                              }, 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          if (startDate && endDate) {
                            // Map deliveryFrequency to intervalType expected by checkout
                            const intervalTypeMap: Record<string, string> = {
                              'daily': 'days',
                              'weekly': 'weekly',
                              'monthly': 'monthly'
                            };

                            handleConfirmSelection({
                              intervalType: intervalTypeMap[deliveryFrequency] || 'weekly',
                              intervalValue: 1,
                              startDate,
                              endDate,
                              deliveryPeriod: intervalTypeMap[deliveryFrequency] || 'weekly'
                            });
                          } else {
                            toast.error('Please select both start and end dates');
                          }
                        }}
                        disabled={!startDate || !endDate}
                        className={`w-full font-bold text-lg py-4 rounded-2xl transition-all duration-300 shadow-lg ${
                          startDate && endDate
                            ? 'bg-mint-green hover:bg-green-600 text-white transform hover:scale-105'
                            : 'bg-light-gray text-medium-gray cursor-not-allowed'
                        }`}
                      >
                        {startDate && endDate
                          ? 'Proceed to Checkout'
                          : 'Please select subscription dates'
                        }
                      </button>
                      
                      <button
                        onClick={handleOpenModal}
                        className="w-full bg-white hover:bg-soft-gray text-primary-blue font-medium py-3 rounded-2xl border-2 border-primary-blue transition-all"
                      >
                        Modify Product Selection
                      </button>
                      
                      <p className="text-center text-sm text-medium-gray">
                        <Plus className="inline h-4 w-4 rotate-45 text-green-500 mr-1" />
                        Free cancellation • Flexible scheduling • No hidden fees
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed inset-2 sm:inset-4 md:inset-6 z-50 flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white pointer-events-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-vibrant-orange via-orange-400 to-sunny-yellow px-6 py-5 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-2xl p-2">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-fredoka font-bold text-white leading-tight">
                        Build Your Subscription Box
                      </h2>
                      <p className="text-white/80 text-sm font-fredoka">
                        Pick the products your pet loves — save on every delivery
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Selected count badge */}
                    {selectedProducts.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-md"
                      >
                        <Check className="h-4 w-4 text-vibrant-orange" />
                        <span className="font-fredoka font-bold text-vibrant-orange text-sm">
                          {selectedProducts.length} selected
                        </span>
                      </motion.div>
                    )}
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Filter Bar */}
              <div className="bg-white border-b border-light-gray px-6 py-3 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-fredoka font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                      selectedCategory === 'all'
                        ? 'bg-vibrant-orange text-white shadow-sm'
                        : 'bg-soft-gray text-medium-gray hover:bg-light-gray'
                    }`}
                  >
                    🐾 All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-fredoka font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                        selectedCategory === cat.slug
                          ? 'bg-vibrant-orange text-white shadow-sm'
                          : 'bg-soft-gray text-medium-gray hover:bg-light-gray'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Area */}
              <div className="flex-1 overflow-y-auto bg-off-white">
                {isLoadingProducts ? (
                  /* Skeleton grid */
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-100" />
                        <div className="p-3 space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                          <div className="h-4 bg-gray-100 rounded w-full" />
                          <div className="h-4 bg-gray-100 rounded w-3/4" />
                          <div className="h-8 bg-gray-100 rounded-xl mt-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="text-5xl">🐾</div>
                    <div className="text-center">
                      <p className="text-lg font-fredoka font-bold text-charcoal">No products found</p>
                      <p className="text-sm text-medium-gray mt-1">Try a different category</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {filteredProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isSelected={selectedProducts.some(p => p.id === product.id)}
                          quantity={productQuantities[product.id] || 1}
                          onToggle={handleProductToggle}
                          onViewDetails={handleViewProductDetails}
                          onQuantityChange={handleQuantityChange}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-xl transition-all ${
                            currentPage === 1
                              ? 'bg-light-gray text-medium-gray cursor-not-allowed'
                              : 'bg-white text-charcoal hover:bg-vibrant-orange hover:text-white shadow-sm'
                          }`}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-9 h-9 rounded-xl font-fredoka font-semibold text-sm transition-all ${
                                  currentPage === pageNum
                                    ? 'bg-vibrant-orange text-white shadow-sm'
                                    : 'bg-white text-charcoal hover:bg-soft-gray shadow-sm'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-xl transition-all ${
                            currentPage === totalPages
                              ? 'bg-light-gray text-medium-gray cursor-not-allowed'
                              : 'bg-white text-charcoal hover:bg-vibrant-orange hover:text-white shadow-sm'
                          }`}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        <span className="text-sm text-medium-gray font-fredoka ml-2">
                          {currentPage}/{totalPages}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-white border-t border-light-gray px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: summary */}
                  <div className="min-w-0">
                    {selectedProducts.length === 0 ? (
                      <p className="text-sm text-medium-gray font-fredoka">
                        Select at least one product to continue
                      </p>
                    ) : (
                      <div>
                        <p className="text-sm font-fredoka font-semibold text-charcoal">
                          {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} in your box
                        </p>
                        <p className="text-sm font-fredoka text-mint-green font-semibold">
                          Subscription total: Rs.{' '}
                          {selectedProducts.reduce((total, product) => {
                            const qty = productQuantities[product.id] || 1;
                            const disc = product.subscription_discount_percentage || 0;
                            return total + product.price * qty * (1 - disc / 100);
                          }, 0).toFixed(2)}
                          {' '}<span className="text-xs text-medium-gray font-normal">/ delivery</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: actions */}
                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 bg-soft-gray hover:bg-light-gray text-charcoal font-fredoka font-medium rounded-xl transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={() => setIsScheduleModalOpen(true)}
                      disabled={selectedProducts.length === 0}
                      whileHover={selectedProducts.length > 0 ? { scale: 1.03 } : {}}
                      whileTap={selectedProducts.length > 0 ? { scale: 0.97 } : {}}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-fredoka font-bold text-sm transition-all ${
                        selectedProducts.length > 0
                          ? 'bg-vibrant-orange hover:bg-orange-600 text-white shadow-md'
                          : 'bg-light-gray text-medium-gray cursor-not-allowed'
                      }`}
                    >
                      Next: Set Schedule
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsScheduleModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none"
            >
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-vibrant-orange to-sunny-yellow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-fredoka font-bold text-white">Set Your Schedule</h2>
                      <p className="text-white/80 text-sm mt-0.5">How often should we deliver?</p>
                    </div>
                    <button
                      onClick={() => setIsScheduleModalOpen(false)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Frequency Type - Visual Cards */}
                  <div>
                    <p className="text-sm font-fredoka font-semibold text-charcoal mb-3 uppercase tracking-wide">Frequency</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'weekly', label: 'Weekly', emoji: '📅', desc: 'Every week' },
                        { value: 'monthly', label: 'Monthly', emoji: '🗓️', desc: 'Every month' },
                        { value: 'custom', label: 'Custom', emoji: '⚙️', desc: 'Set your own' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setIntervalType(opt.value as 'weekly' | 'monthly' | 'custom');
                            setIntervalValue(opt.value === 'custom' ? 7 : 1);
                          }}
                          className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                            intervalType === opt.value
                              ? 'border-vibrant-orange bg-orange-50 shadow-md'
                              : 'border-light-gray bg-white hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl mb-1">{opt.emoji}</span>
                          <span className={`text-sm font-fredoka font-bold ${intervalType === opt.value ? 'text-vibrant-orange' : 'text-charcoal'}`}>
                            {opt.label}
                          </span>
                          <span className="text-xs text-medium-gray mt-0.5">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interval Value */}
                  <div>
                    <p className="text-sm font-fredoka font-semibold text-charcoal mb-3 uppercase tracking-wide">Interval</p>
                    <div className="grid grid-cols-2 gap-2">
                      {intervalType === 'weekly' && [
                        { v: 1, label: 'Every Week' },
                        { v: 2, label: 'Every 2 Weeks' },
                        { v: 3, label: 'Every 3 Weeks' },
                        { v: 4, label: 'Every 4 Weeks' },
                      ].map(opt => (
                        <button
                          key={opt.v}
                          onClick={() => setIntervalValue(opt.v)}
                          className={`py-2.5 px-4 rounded-xl text-sm font-fredoka font-medium transition-all border-2 ${
                            intervalValue === opt.v
                              ? 'bg-vibrant-orange border-vibrant-orange text-white'
                              : 'bg-white border-light-gray text-charcoal hover:border-gray-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                      {intervalType === 'monthly' && [
                        { v: 1, label: 'Every Month' },
                        { v: 2, label: 'Every 2 Months' },
                        { v: 3, label: 'Every 3 Months' },
                        { v: 6, label: 'Every 6 Months' },
                      ].map(opt => (
                        <button
                          key={opt.v}
                          onClick={() => setIntervalValue(opt.v)}
                          className={`py-2.5 px-4 rounded-xl text-sm font-fredoka font-medium transition-all border-2 ${
                            intervalValue === opt.v
                              ? 'bg-vibrant-orange border-vibrant-orange text-white'
                              : 'bg-white border-light-gray text-charcoal hover:border-gray-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                      {intervalType === 'custom' && [
                        { v: 7, label: 'Every 7 Days' },
                        { v: 14, label: 'Every 14 Days' },
                        { v: 21, label: 'Every 21 Days' },
                        { v: 30, label: 'Every 30 Days' },
                        { v: 45, label: 'Every 45 Days' },
                        { v: 60, label: 'Every 60 Days' },
                      ].map(opt => (
                        <button
                          key={opt.v}
                          onClick={() => setIntervalValue(opt.v)}
                          className={`py-2.5 px-4 rounded-xl text-sm font-fredoka font-medium transition-all border-2 ${
                            intervalValue === opt.v
                              ? 'bg-vibrant-orange border-vibrant-orange text-white'
                              : 'bg-white border-light-gray text-charcoal hover:border-gray-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-fredoka font-semibold text-charcoal mb-1.5 block uppercase tracking-wide">
                        Start Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full border-2 border-light-gray rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-transparent"
                        value={startDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={e => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-fredoka font-semibold text-charcoal mb-1.5 block uppercase tracking-wide">
                        End Date <span className="text-medium-gray font-normal">(optional)</span>
                      </label>
                      <input
                        type="date"
                        className="w-full border-2 border-light-gray rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-transparent"
                        min={startDate || new Date().toISOString().split("T")[0]}
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Summary pill */}
                  {startDate && (
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                      <Repeat className="h-4 w-4 text-vibrant-orange flex-shrink-0" />
                      <p className="text-sm font-fredoka text-charcoal">
                        Delivering{' '}
                        <span className="font-bold text-vibrant-orange">
                          {intervalType === 'weekly' ? `every ${intervalValue === 1 ? 'week' : `${intervalValue} weeks`}` :
                           intervalType === 'monthly' ? `every ${intervalValue === 1 ? 'month' : `${intervalValue} months`}` :
                           `every ${intervalValue} days`}
                        </span>
                        {' '}starting <span className="font-bold text-vibrant-orange">{new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {endDate ? ` until ${new Date(endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ' (ongoing)'}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setIsScheduleModalOpen(false)}
                      className="flex-1 bg-soft-gray hover:bg-light-gray text-charcoal font-fredoka font-medium py-3 rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setIsScheduleModalOpen(false);
                        handleConfirmSelection({
                          intervalType,
                          intervalValue,
                          startDate,
                          endDate,
                          deliveryPeriod: intervalType
                        });
                      }}
                      disabled={!startDate}
                      className={`flex-1 font-fredoka font-bold py-3 rounded-xl transition-all ${
                        startDate
                          ? 'bg-vibrant-orange hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                          : 'bg-light-gray text-medium-gray cursor-not-allowed'
                      }`}
                    >
                      Confirm & Continue
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Subscription Details Modal */}
      <AnimatePresence>
        {showSubscriptionModal && selectedSubscription && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => {
                setShowSubscriptionModal(false);
                setShowConfirmCancel(false);
                setShowConfirmPause(false);
                setShowConfirmSkip(false);
                setShowRescheduleInput(false);
                setRescheduleDate('');
              }}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-primary-blue text-white p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedSubscription.name}</h2>
                      <p className="text-white/90 mt-1">Subscription ID: #{selectedSubscription.id}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowSubscriptionModal(false);
                        setShowConfirmCancel(false);
                        setShowConfirmPause(false);
                        setShowConfirmSkip(false);
                        setShowRescheduleInput(false);
                        setRescheduleDate('');
                      }}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {/* Subscription Status */}
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-medium-gray">Status</p>
                        <p className="font-semibold text-green-700">{selectedSubscription.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-medium-gray">Since</p>
                        <p className="font-medium">{new Date(selectedSubscription.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-charcoal mb-3">Delivery Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-soft-gray p-4 rounded-2xl">
                        <p className="text-sm text-medium-gray mb-1">Frequency</p>
                        <p className="font-medium">{selectedSubscription.frequency}</p>
                      </div>
                      <div className="bg-soft-gray p-4 rounded-2xl">
                        <p className="text-sm text-medium-gray mb-1">Next Delivery</p>
                        <p className="font-medium text-mint-green">
                          {selectedSubscription.nextDelivery ? new Date(selectedSubscription.nextDelivery).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="bg-soft-gray p-4 rounded-2xl md:col-span-2">
                        <p className="text-sm text-medium-gray mb-1">Delivery Address</p>
                        <p className="font-medium">{selectedSubscription.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Products in Subscription */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-charcoal mb-3">Products ({selectedSubscription.items.length})</h3>
                    <div className="space-y-3">
                      {selectedSubscription.items.map((item, index) => (
                        <div key={index} className="bg-soft-gray p-4 rounded-2xl flex justify-between items-center">
                          <div>
                            <p className="font-medium text-charcoal">{item.name}</p>
                            <p className="text-sm text-medium-gray">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-vibrant-orange">{item?.currency} {item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-300">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-medium-gray">Subtotal</span>
                        <span>
                          {typeof selectedProduct?.currency === 'object' ? (selectedProduct.currency as any)?.code || 'Rs.' : selectedProduct?.currency || 'Rs.'} {selectedSubscription.total + selectedSubscription.savedAmount}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Subscription Discount (10%)</span>
                        <span>
                          -{typeof selectedProduct?.currency === 'object' ? (selectedProduct.currency as any)?.code || 'Rs.' : selectedProduct?.currency || 'Rs.'} {selectedSubscription.savedAmount}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-yellow-400">
                        <span className="font-semibold">Total per {selectedSubscription.frequency}</span>
                        <span className="font-bold text-lg text-vibrant-orange">
                          {typeof selectedProduct?.currency === 'object' ? (selectedProduct.currency as any)?.code || 'Rs.' : selectedProduct?.currency || 'Rs.'}{selectedSubscription.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-soft-gray px-6 py-5 border-t border-light-gray space-y-4">

                  {/* Inline Reschedule */}
                  {showRescheduleInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-white rounded-2xl p-4 border-2 border-mint-green/40"
                    >
                      <p className="text-sm font-fredoka font-semibold text-charcoal mb-2">Pick a new delivery date</p>
                      <div className="flex gap-3 items-center">
                        <input
                          type="date"
                          value={rescheduleDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setRescheduleDate(e.target.value)}
                          className="flex-1 border-2 border-light-gray rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
                        />
                        <button
                          onClick={() => { if (rescheduleDate) handleReschedule(selectedSubscription.id, rescheduleDate); }}
                          disabled={!rescheduleDate}
                          className="bg-mint-green hover:bg-green-600 text-white font-fredoka font-medium px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => { setShowRescheduleInput(false); setRescheduleDate(''); }}
                          className="text-medium-gray hover:text-charcoal text-sm px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Inline Confirm Pause */}
                  {showConfirmPause && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-300"
                    >
                      <p className="text-sm font-fredoka font-semibold text-charcoal mb-3">⏸️ Pause this subscription?</p>
                      <p className="text-xs text-medium-gray mb-3">Your deliveries will stop until you resume. You can resume anytime.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePause(selectedSubscription.id)}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-fredoka font-medium py-2 rounded-xl text-sm transition-colors"
                        >
                          Yes, Pause
                        </button>
                        <button
                          onClick={() => setShowConfirmPause(false)}
                          className="flex-1 bg-white text-charcoal font-fredoka font-medium py-2 rounded-xl text-sm border border-light-gray transition-colors"
                        >
                          Keep Active
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Inline Confirm Skip */}
                  {showConfirmSkip && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200"
                    >
                      <p className="text-sm font-fredoka font-semibold text-charcoal mb-3">⏭️ Skip the next delivery?</p>
                      <p className="text-xs text-medium-gray mb-3">The following delivery will be scheduled automatically.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSkipDelivery(selectedSubscription.id)}
                          className="flex-1 bg-primary-blue hover:bg-blue-700 text-white font-fredoka font-medium py-2 rounded-xl text-sm transition-colors"
                        >
                          Yes, Skip
                        </button>
                        <button
                          onClick={() => setShowConfirmSkip(false)}
                          className="flex-1 bg-white text-charcoal font-fredoka font-medium py-2 rounded-xl text-sm border border-light-gray transition-colors"
                        >
                          Keep Delivery
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Inline Confirm Cancel */}
                  {showConfirmCancel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-red-50 rounded-2xl p-4 border-2 border-red-200"
                    >
                      <p className="text-sm font-fredoka font-semibold text-charcoal mb-3">🗑️ Cancel this subscription?</p>
                      <p className="text-xs text-medium-gray mb-3">This action is permanent and cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancel(selectedSubscription.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-fredoka font-medium py-2 rounded-xl text-sm transition-colors"
                        >
                          Yes, Cancel
                        </button>
                        <button
                          onClick={() => setShowConfirmCancel(false)}
                          className="flex-1 bg-white text-charcoal font-fredoka font-medium py-2 rounded-xl text-sm border border-light-gray transition-colors"
                        >
                          Keep Subscription
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Pills */}
                  {!showConfirmCancel && !showConfirmPause && !showConfirmSkip && !showRescheduleInput && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSubscription.status === 'Active' && (
                        <button
                          onClick={() => setShowConfirmPause(true)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-fredoka font-medium rounded-full text-sm transition-colors"
                        >
                          <PauseCircle className="h-4 w-4" />
                          Pause
                        </button>
                      )}
                      {selectedSubscription.status === 'Paused' && (
                        <button
                          onClick={() => handleResume(selectedSubscription.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-fredoka font-medium rounded-full text-sm transition-colors"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Resume
                        </button>
                      )}
                      {selectedSubscription.status === 'Active' && (
                        <button
                          onClick={() => setShowConfirmSkip(true)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-fredoka font-medium rounded-full text-sm transition-colors"
                        >
                          <SkipForward className="h-4 w-4" />
                          Skip Next
                        </button>
                      )}
                      {(selectedSubscription.status === 'Active' || selectedSubscription.status === 'Paused') && selectedSubscription.nextDelivery && (
                        <button
                          onClick={() => { setRescheduleDate(selectedSubscription.nextDelivery || ''); setShowRescheduleInput(true); }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 font-fredoka font-medium rounded-full text-sm transition-colors"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Reschedule
                        </button>
                      )}
                    </div>
                  )}

                  {/* Close / Cancel row */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowSubscriptionModal(false);
                        setShowConfirmCancel(false);
                        setShowConfirmPause(false);
                        setShowConfirmSkip(false);
                        setShowRescheduleInput(false);
                        setRescheduleDate('');
                      }}
                      className="px-6 py-2 bg-white hover:bg-soft-gray text-charcoal font-fredoka font-medium rounded-full border border-light-gray transition-colors"
                    >
                      Close
                    </button>
                    {(selectedSubscription.status === 'Active' || selectedSubscription.status === 'Paused') && !showConfirmCancel && (
                      <button
                        onClick={() => setShowConfirmCancel(true)}
                        className="flex items-center gap-1.5 px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-fredoka font-medium rounded-full border border-red-200 text-sm transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Active Subscriptions Sidebar */}
      <ActiveSubscriptionsSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(!showSidebar)}
        subscriptions={activeSubscriptions}
        onSubscriptionClick={handleSubscriptionClick}
        onManageSubscription={handleManageSubscription}
      />

      {/* Product Details Modal */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowProductModal(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="relative h-80 bg-primary-blue">
                  <div className="absolute inset-0 bg-black/20" />
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors z-10"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                  <div className="relative h-full flex items-center justify-center">
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      src={getProductImageSrc(selectedProduct)}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = PRODUCT_PLACEHOLDER; }}
                      alt={selectedProduct?.name || "Product image"}
                      className="max-h-64 max-w-sm object-contain drop-shadow-2xl"
                    />

                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-320px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Product Info */}
                    <div>
                      <div className="mb-6">
                        <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-2">
                          {selectedProduct.name}
                        </h2>
                        <p className="text-lg text-medium-gray flex items-center gap-2">
                          by <span className="font-fredoka font-semibold text-vibrant-orange">
                            {typeof selectedProduct.brand === 'object' ? (selectedProduct.brand as any)?.name : selectedProduct.brand}
                          </span>
                        </p>
                      </div>

                      {/* Stock Badge */}
                      <div className="mb-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-fredoka font-medium ${
                          selectedProduct.is_in_stock
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {selectedProduct.is_in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <h3 className="font-fredoka font-semibold text-lg text-charcoal mb-2">Description</h3>
                        <p className="text-medium-gray leading-relaxed">
                          {selectedProduct.description || `Premium ${
                            typeof selectedProduct.category === 'object' ? (selectedProduct.category as any)?.name : selectedProduct.category
                          } for your beloved pet. This high-quality product from ${
                            typeof selectedProduct.brand === 'object' ? (selectedProduct.brand as any)?.name : selectedProduct.brand
                          } is designed to provide the best care and comfort for your furry friend. Made with carefully selected ingredients and materials to ensure safety and effectiveness.`}
                        </p>
                      </div>

                      {/* Product Specifications */}
                      {(selectedProduct.weight || selectedProduct.dimensions) && (
                        <div className="mb-6">
                          <h3 className="font-fredoka font-semibold text-lg text-charcoal mb-3">Product Specifications</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Weight */}
                            {selectedProduct.weight && (
                              <div className="bg-primary-blue/10 border border-primary-blue/30 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Package className="h-5 w-5 text-primary-blue" />
                                  <span className="font-fredoka font-semibold text-charcoal">Weight</span>
                                </div>
                                <p className="text-2xl font-fredoka font-bold text-primary-blue">
                                  {selectedProduct.weight} kg
                                </p>
                              </div>
                            )}

                            {/* Dimensions */}
                            {selectedProduct.dimensions && (
                              <div className="bg-lavender/10 border border-lavender/30 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Package className="h-5 w-5 text-lavender" />
                                  <span className="font-fredoka font-semibold text-charcoal">Dimensions</span>
                                </div>
                                <p className="text-lg font-fredoka font-bold text-lavender">
                                  {selectedProduct.dimensions.length} × {selectedProduct.dimensions.width} × {selectedProduct.dimensions.height}
                                  <span className="text-sm text-medium-gray ml-1">
                                    {selectedProduct.dimensions.unit || 'cm'}
                                  </span>
                                </p>
                                <p className="text-xs text-medium-gray mt-1">
                                  (L × W × H)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      <div className="mb-6">
                        <h3 className="font-fredoka font-semibold text-lg text-charcoal mb-3">Key Features</h3>
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-medium-gray">High-quality ingredients and materials</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-medium-gray">Veterinarian recommended</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-medium-gray">Suitable for all life stages</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-medium-gray">100% satisfaction guarantee</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Pricing and Actions */}
                    <div>
                      {/* Pricing Card */}
                      <div className="bg-yellow-50 rounded-2xl p-6 mb-6">
                        <h3 className="font-fredoka font-semibold text-lg text-charcoal mb-4">Pricing Options</h3>
                        
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-3xl font-fredoka font-bold text-charcoal">
                            {typeof selectedProduct?.currency === 'object'
                              ? (selectedProduct.currency as any)?.code || 'Rs.'
                              : selectedProduct?.currency || 'Rs.'} {selectedProduct.price}
                          </span>
                        </div>
                        {selectedProduct.subscription_discount_percentage && selectedProduct.subscription_discount_percentage > 0 && (
                          <div className="bg-mint-green/10 border border-mint-green/30 rounded-xl p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-fredoka font-medium text-charcoal">Subscribe & Save</span>
                              <span className="bg-mint-green text-white text-xs px-2 py-1 rounded-full font-fredoka font-bold">
                                Save {selectedProduct.subscription_discount_percentage}%
                              </span>
                            </div>
                            <p className="text-xl font-fredoka font-bold text-mint-green mt-1">
                              {typeof selectedProduct?.currency === 'object'
                                ? (selectedProduct.currency as any)?.code || 'Rs.'
                                : selectedProduct?.currency || 'Rs.'} {(selectedProduct.price * (1 - selectedProduct.subscription_discount_percentage / 100)).toFixed(2)}
                              <span className="text-sm text-medium-gray font-normal ml-1">per delivery</span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Benefits */}
                      <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                        <h3 className="font-fredoka font-semibold text-lg text-charcoal mb-3">Why Choose Subscription?</h3>
                        <div className="space-y-3">
                          {/* <div className="flex items-center gap-3">
                            <PercentIcon className="h-5 w-5 text-vibrant-orange" />
                            <span className="text-gray-700">Save 10% on every order</span>
                          </div> */}
                          <div className="flex items-center gap-3">
                            <TruckIcon className="h-5 w-5 text-vibrant-orange" />
                            <span className="text-gray-700">Products to your doorstep</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-vibrant-orange" />
                            <span className="text-gray-700">Flexible delivery schedule</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-vibrant-orange" />
                            <span className="text-gray-700">Cancel or pause anytime</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={selectedProduct.quantity || 1}
                          onChange={(e) =>
                            setSelectedProduct({
                              ...selectedProduct,
                              quantity: parseInt(e.target.value, 10),
                            })
                          }
                          className="border rounded-xl px-3 py-2 w-24"
                        />
                      </div>
                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            handleProductToggle(selectedProduct);
                            setShowProductModal(false);
                          }}
                          className={`w-full py-4 px-6 rounded-2xl font-fredoka font-bold text-lg transition-all transform hover:scale-105 ${
                            selectedProducts.some(p => p.id === selectedProduct.id)
                              ? 'bg-light-gray text-medium-gray'
                              : 'bg-vibrant-orange hover:bg-sunny-yellow text-white shadow-lg'
                          }`}
                          disabled={selectedProducts.some(p => p.id === selectedProduct.id)}
                        >
                          {selectedProducts.some(p => p.id === selectedProduct.id)
                            ? 'Already Added to Subscription'
                            : 'Add to Subscription'
                          }
                        </button>
                        <button
                          onClick={() => setShowProductModal(false)}
                          className="w-full py-3 px-6 bg-white border-2 border-light-gray rounded-2xl font-fredoka font-medium text-charcoal hover:bg-soft-gray transition-colors"
                        >
                          Close
                        </button>
                      </div>

                      {/* Trust Badges */}
                      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-medium-gray">
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Secure</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>Pet Safe</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>Quality Assured</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Inline SVG placeholder — no external dependency
const PRODUCT_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f5f5f5'/%3E%3Cpath d='M150 90a60 60 0 1 0 0 120 60 60 0 0 0 0-120zm0 108a48 48 0 1 1 0-96 48 48 0 0 1 0 96z' fill='%23d0d0d0'/%3E%3Ccircle cx='150' cy='135' r='18' fill='%23d0d0d0'/%3E%3Cpath d='M110 195c0-22 18-40 40-40s40 18 40 40' fill='%23d0d0d0'/%3E%3C/svg%3E";

const getProductImageSrc = (product: Product): string => {
  if (product.images && product.images.length > 0) {
    const url = product.images[0].url;
    return url.startsWith('http') ? url : PRODUCT_PLACEHOLDER;
  }
  if (!product.primary_image?.url) return PRODUCT_PLACEHOLDER;
  const url = product.primary_image.url;
  return url.startsWith('http') ? url : PRODUCT_PLACEHOLDER;
};

// Product Card Component for Modal
interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  quantity: number;
  onToggle: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onQuantityChange: (productId: string, change: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, quantity, onToggle, onViewDetails, onQuantityChange }) => {
  const isOutOfStock = !product.is_in_stock || product.stock_quantity <= 0;
  const brandName = typeof product.brand === 'string' ? product.brand : (product.brand as any)?.name || '';
  const subPrice = product.subscription_discount_percentage && product.subscription_discount_percentage > 0
    ? product.price * (1 - product.subscription_discount_percentage / 100)
    : null;

  return (
    <motion.div
      whileHover={!isOutOfStock ? { y: -3 } : {}}
      className={`relative bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-vibrant-orange shadow-lg shadow-orange-100'
          : 'shadow-sm hover:shadow-md'
      } ${isOutOfStock ? 'opacity-70' : ''}`}
    >
      {/* Image area */}
      <div
        className="relative aspect-square bg-soft-gray cursor-pointer overflow-hidden"
        onClick={() => !isOutOfStock && onToggle(product)}
      >
        <img
          src={getProductImageSrc(product)}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${!isOutOfStock ? 'group-hover:scale-105' : ''}`}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PRODUCT_PLACEHOLDER; }}
        />

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs font-fredoka font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Save badge */}
        {product.subscription_discount_percentage && product.subscription_discount_percentage > 0 && !isOutOfStock && (
          <div className="absolute top-2 left-2 bg-mint-green text-white text-[10px] font-fredoka font-bold px-2 py-0.5 rounded-full shadow">
            Save {product.subscription_discount_percentage}%
          </div>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 bg-vibrant-orange text-white rounded-full p-1 shadow-md"
          >
            <Check className="h-3.5 w-3.5" />
          </motion.div>
        )}

      </div>

      {/* Info area */}
      <div className="p-3 flex flex-col flex-1">
        {brandName && (
          <p className="text-[10px] font-fredoka font-semibold text-primary-blue uppercase tracking-wide truncate mb-0.5">
            {brandName}
          </p>
        )}
        <h3
          className="font-fredoka font-semibold text-charcoal text-sm leading-tight line-clamp-2 mb-2 flex-1 cursor-pointer hover:text-vibrant-orange transition-colors"
          onClick={() => !isOutOfStock && onToggle(product)}
        >
          {product.name}
        </h3>

        {/* Price block */}
        <div className="mb-2">
          {subPrice !== null ? (
            <>
              <p className="text-[11px] text-gray-400 line-through leading-none">
                LKR {product.price.toLocaleString()}
              </p>
              <p className="font-fredoka font-bold text-vibrant-orange text-base leading-tight">
                LKR {subPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </>
          ) : (
            <p className="font-fredoka font-bold text-vibrant-orange text-base">
              LKR {product.price.toLocaleString()}
            </p>
          )}
        </div>

        {/* View Details button */}
        <button
          onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 mb-2 rounded-xl text-xs font-fredoka font-semibold text-primary-blue bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </button>

        {/* Quantity controls — visible only when selected */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden mb-2"
            >
              <div className="flex items-center justify-between bg-soft-gray rounded-xl px-3 py-2">
                <span className="text-xs font-fredoka font-semibold text-charcoal">Qty</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onQuantityChange(String(product.id), -1); }}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-vibrant-orange hover:text-white text-charcoal flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center font-fredoka font-bold text-charcoal text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onQuantityChange(String(product.id), 1); }}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-vibrant-orange hover:text-white text-charcoal flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <button
          onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) onToggle(product); }}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded-xl text-sm font-fredoka font-bold transition-all ${
            isOutOfStock
              ? 'bg-soft-gray text-medium-gray cursor-not-allowed'
              : isSelected
                ? 'bg-red-50 hover:bg-red-100 text-red-500 border border-red-200'
                : 'bg-vibrant-orange hover:bg-orange-600 text-white shadow-sm'
          }`}
        >
          {isOutOfStock ? 'Unavailable' : isSelected ? '✓ Added — Remove' : '+ Add to Box'}
        </button>
      </div>
    </motion.div>
  );
}

export default Subscriptions