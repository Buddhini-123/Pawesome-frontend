import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { useLoyalty } from '../../../hooks/useLoyalty';
import { formatters } from '../../../utils/formatters';
import { orderService } from '../../../services/order.service';
import { loyaltyService } from '../../../services/loyalty.service';
import { PricingCalculation } from '../../../types';
import {
  CheckCircle,
  AlertCircle,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Gift,
  ChevronRight,
  ChevronLeft,
  Package,
  User,
  Phone,
  Home,
  Building,
  Navigation,
  Hash,
  Calendar,
  Lock,
  Info,
  Tag,
  Clock,
  Star
} from 'lucide-react';
import RedemptionSlider from '../../loyalty/RedemptionSlider';
import { useLocation } from "react-router-dom";
import {api, host} from "../../../services/api"
import { toast } from 'react-toastify';
import { normalizeCartItem } from '../../../utils/cartNormalizer';
interface CheckoutForm {
  // Shipping Information
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    street?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    addressType: 'home' | 'work' | 'other';
  };
  // Payment Information
  paymentMethod: 'card' | 'cod';
  cardDetails?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
  // Delivery Options
  deliveryOption: 'standard' | 'express';
  // Gift Options
  isGift: boolean;
  giftMessage?: string;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode, fallback: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode, fallback: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { loyaltyCard } = useLoyalty();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loyaltyRedemption, setLoyaltyRedemption] = useState({ points: 0, value: 0 });
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [addressOption, setAddressOption] = useState<'select' | 'custom'>('select');
  const [addresses, setAddresses] = useState<any[]>([]);

  // Pricing API integration states
  const [pricing, setPricing] = useState<PricingCalculation | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CheckoutForm>({
    shippingAddress: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      address: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      addressType: 'home'
    },
    paymentMethod: 'card',
    deliveryOption: 'standard',
    isGift: false
  });

  const { state } = useLocation();

  const isSubscription = state?.type === "subscription";
  const scheduleData = isSubscription ? state?.scheduleData : null;
  const selectedProducts = isSubscription ? state?.selectedProducts : cart;
  
  const calculateDeliveryCount = (startDate: string, endDate: string, intervalType: string, intervalValue: number = 1) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    let count = 0;
    let next = new Date(start);

    while (next <= end) {
      count++;

      if (intervalType === "weekly") {
        next.setDate(next.getDate() + 7 * intervalValue);
      } 
      else if (intervalType === "days") {
        next.setDate(next.getDate() + intervalValue);
      }
      else if (intervalType === "monthly") {
        next.setMonth(next.getMonth() + intervalValue);
      } 
      else {
        break;
      }
    }

    return count;
  };
  
  const deliveryCount = isSubscription && scheduleData
    ? calculateDeliveryCount(
        scheduleData.startDate,
        scheduleData.endDate,
        scheduleData.deliveryPeriod,
        1
      )
    : 1;

  const subscriptionSubtotal = isSubscription
    ? selectedProducts.reduce((sum: number, p: any) => {
        const price = Number(p.subscription_price || 0);
        const quantity = p.quantity || 1;
        return sum + price * quantity * deliveryCount;
      }, 0)
    : totalPrice;

  // Helper function to get currency display
  const getCurrencyDisplay = (currencyObj: any): string => {
    if (!currencyObj) return "LKR";
    if (typeof currencyObj === 'string') return currencyObj;
    if (currencyObj.code) return String(currencyObj.code);
    if (currencyObj.name) return String(currencyObj.name);
    return "LKR";
  };

  // Get currency from either subscription or cart
  const getCurrentCurrency = (): string => {
    // Product interface doesn't have currency field, always use LKR
    return "LKR";
  };

  const currentCurrency = getCurrentCurrency();

  // Helper function to safely display price
  const safeDisplayPrice = (price: any): string => {
    if (typeof price === 'number') return price.toFixed(2);
    if (typeof price === 'string') {
      const num = parseFloat(price);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    }
    if (price && typeof price === 'object') {
      // Try to extract price from object
      const extracted = price.value || price.amount || price.price || price.subscription_price || 0;
      const num = parseFloat(String(extracted));
      return isNaN(num) ? "0.00" : num.toFixed(2);
    }
    return "0.00";
  };

  // Load saved addresses
  useEffect(() => {
    if (user?.addresses) {
      setSavedAddresses(user.addresses);
      if (user.addresses.length > 0 && user.addresses[0].isDefault) {
        const defaultAddr = user.addresses[0];
        setSelectedAddressId(defaultAddr.id);
        setFormData(prev => ({
          ...prev,
          shippingAddress: {
            fullName: defaultAddr.fullName || user.name || '',
            phone: defaultAddr.phone || user.phone || '',
            address: defaultAddr.address || '',
            street: defaultAddr.street || '',
            city: defaultAddr.city || '',
            state: defaultAddr.state || '',
            pincode: defaultAddr.pincode || '',
            landmark: '',
            addressType: 'home'
          }
        }));
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/users/addresses');
        setAddresses((res.data as any).data);
        if ((res.data as any).data.length) setSelectedAddressId((res.data as any).data[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAddresses();
  }, []);

  // Fetch pricing from backend API
  const fetchPricing = async (subtotal: number) => {
    if (subtotal <= 0) return;

    setPricingLoading(true);
    setPricingError(null);

    try {
      const response = await api.request<PricingCalculation>('/pricing/calculate', {
        method: 'POST',
        body: { subtotal }
      });

      if (response.success && response.data) {
        setPricing(response.data);
      }
    } catch (error: any) {
      console.error('Pricing API error:', error);
      setPricingError('Failed to calculate pricing. Please try again.');
    } finally {
      setPricingLoading(false);
    }
  };

  // Debounced pricing API call when subtotal changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (subscriptionSubtotal > 0) {
        fetchPricing(subscriptionSubtotal);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [subscriptionSubtotal]);

  // Debug logging
  useEffect(() => {
    console.log("Checkout debug:", {
      isSubscription,
      step,
      currentCurrency,
      cartLength: cart?.length,
      selectedProductsLength: selectedProducts?.length,
      formDataPaymentMethod: formData.paymentMethod
    });
  }, [isSubscription, step, currentCurrency, cart, selectedProducts, formData.paymentMethod]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login', { state: { from: { pathname: '/checkout' } } });
    return null;
  }
  

  // Redirect to cart if empty
  if (!isSubscription && cart.length === 0) {
    navigate('/cart');
    return null;
  }

  // Calculate pricing - use backend API when available
  const baseShippingCost = subscriptionSubtotal >= 2000 ? 0 : 150;
  const deliveryCharge = formData.deliveryOption === 'express' ? 100 : 0;
  const codCharge = formData.paymentMethod === 'cod' ? 50 : 0;
  const shippingCost = baseShippingCost + deliveryCharge;

  // Use backend pricing calculation for birthday discount and total
  const birthdayDiscount = pricing?.birthday_discount?.applies ? pricing.birthday_discount.amount : 0;
  const subtotalAfterBirthdayDiscount = pricing?.total ?? subscriptionSubtotal;
  const subtotalAfterCoupon = subtotalAfterBirthdayDiscount - couponDiscount;
  const subtotalAfterLoyalty = subtotalAfterCoupon - loyaltyRedemption.value;
  const finalTotal = subtotalAfterLoyalty + shippingCost + codCharge;

  // Points to earn from backend API
  const pointsToEarn = pricing?.loyalty_points?.points_to_earn ?? Math.floor(finalTotal / 100);

  const handleShippingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };

  const handlePaymentMethodChange = (method: 'card' | 'cod') => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method,
      cardDetails: undefined,
      upiId: undefined
    }));
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          fullName: address.fullName || user?.name || '',
          phone: address.phone || user?.phone || '',
          address: address.address || '',
          street: address.street || '',
          city: address.city || '',
          state: address.state || '',
          pincode: address.pincode || '',
          landmark: '',
          addressType: address.type || 'home'
        }
      }));
    }
  };

  const validateShipping = () => {
    // user can choose: select-address OR custom-address
    if (addressOption === "select") {
      if (!selectedAddressId) {
        setError("Please select an address");
        return false;
      }
      return true; // address is valid
    }

    // CUSTOM ADDRESS VALIDATION
    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      addressType
    } = formData.shippingAddress;

    // Required fields
    if (!fullName || !phone || !address || !city || !state || !pincode) {
      setError("Please fill all required shipping details");
      return false;
    }

    // Phone number must be 10 digits
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }

    // Pincode 5 digits
    if (!/^\d{5}$/.test(pincode)) {
      setError("Please enter a valid 5-digit pincode");
      return false;
    }

    // Address type required
    if (!addressType) {
      setError("Please select address type (Home / Work / Other)");
      return false;
    }

    return true;
  };


  const validatePayment = () => {
    if (formData.paymentMethod === 'card') {
      if (!formData.cardDetails) {
        setFormData(prev => ({
          ...prev,
          cardDetails: { number: '', name: '', expiry: '', cvv: '' }
        }));
        setError('Please fill card details');
        return false;
      }
      const { number, name, expiry, cvv } = formData.cardDetails;
      if (!number || !name || !expiry || !cvv) {
        setError('Please fill all card details');
        return false;
      }
      if (!/^\d{16}$/.test(number.replace(/\s/g, ''))) {
        setError('Please enter a valid 16-digit card number');
        return false;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError('Please enter a valid CVV');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1 && validateShipping()) {
      setStep(2);
    } else if (step === 2 && validatePayment()) {
      setStep(3);
    }
  };

  const handlePreviousStep = () => {
      setError('');
      if (step === 3) setStep(2);
      else if (step === 2) setStep(1);
    };

  const getDeliveryAddressId = async () => {
    if (addressOption === 'select') {
      return selectedAddressId;
    } else {
      const res = await api.post('/users/addresses', {
        type: formData.shippingAddress.addressType,
        full_name: formData.shippingAddress.fullName,
        phone: formData.shippingAddress.phone,
        address_line1: formData.shippingAddress.address,
        city: formData.shippingAddress.city,
        district: formData.shippingAddress.state,
        postal_code: formData.shippingAddress.pincode
      });
      
      console.log(res);
      
      return (res.data as any).data.address.id;
    }
  };
  const buildShippingAddress = () => {
    // If user selected saved address
    if (addressOption === 'select' && selectedAddressId) {
      const selected = addresses.find(a => a.id === selectedAddressId);

      return {
        fullName: formData.shippingAddress.fullName,
        phone: formData.shippingAddress.phone,
        address: selected?.formatted_address ?? null,
        street: selected?.street ?? null,
        city: selected?.city ?? null,
        state: selected?.state ?? null,
        pincode: selected?.pincode ?? null,
        landmark: selected?.landmark ?? null,
        addressType: selected?.address_type ?? 'home',
      };
    }

    // Custom address OR empty fields
    return {
      fullName: formData.shippingAddress.fullName,
      phone: formData.shippingAddress.phone,
      address: formData.shippingAddress.address || null,
      street: formData.shippingAddress.street || null,
      city: formData.shippingAddress.city || null,
      state: formData.shippingAddress.state || null,
      pincode: formData.shippingAddress.pincode || null,
      landmark: formData.shippingAddress.landmark || null,
      addressType: formData.shippingAddress.addressType || 'home',
    };
  };

  const handlePlaceOrder = async () => {
    
    setError('');
    setIsProcessing(true);

    try {

      if (isSubscription) {
        
        const deliveryAddressId = await getDeliveryAddressId();
        console.log(deliveryAddressId, 'deliveryAddressId');
        

        const payload = {
          products: selectedProducts.map((product: any) => ({
            product_id: product.id,
            quantity: deliveryCount,
            preferences: product.preferences || {},
          })),
          subscription_data: {
            interval_type: scheduleData.deliveryPeriod,
            interval_value: 1,
            start_date: scheduleData.startDate,
            end_date: scheduleData.endDate,
            delivery_address_id: deliveryAddressId,
            payment_method_id: 2,
            preferences: {
              gift_wrap: "test",
              delivery_time: "morning",
            },
            subtotal: subscriptionSubtotal
          },
        };

        const response = await api.post("/subscriptions/direct-create", payload);
        if (response.success == false) {
          const errorMsg = response.error || response.message || "Subscription creation failed";

          toast.error(errorMsg);
          throw new Error(errorMsg);
        }
        toast.success("Subscription created successfully!");

        navigate("/subscriptions");
        
        return;
      }
      

      // 🌟 ELSE → Normal one-time order flow

      // 1. Redeem loyalty points FIRST (if any)
      let redemptionSuccess = false;
      if (loyaltyRedemption.points > 0) {
        try {
          const redemptionResult = await loyaltyService.redeemPoints(
            loyaltyRedemption.points,
            'ORDER_PENDING', // Will be updated with real order ID later
            'Checkout discount'
          );
          redemptionSuccess = true;
          console.log('Points redeemed:', redemptionResult);
        } catch (redemptionError: any) {
          setError(redemptionError.message);
          setIsProcessing(false);
          return; // Stop checkout if redemption fails
        }
      }

      // 2. Create order with discounted total
      const orderData = {
        items: cart
        .filter(item => !String(item.product.id).startsWith('theme-'))
        .map(item => ({
          productId: item.product.id, // Keep as string
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: buildShippingAddress(),
        paymentMethod: formData.paymentMethod,
        subtotal: subscriptionSubtotal,
        shippingCost,
        totalAmount: finalTotal,
        loyaltyPointsUsed: loyaltyRedemption.points,
        loyaltyDiscount: loyaltyRedemption.value,
        couponCode: appliedCoupon,
        couponDiscount,
        deliveryOption: formData.deliveryOption,
        isGift: formData.isGift,
        giftMessage: formData.giftMessage
      };

      const order = await orderService.createOrder(orderData);
      toast.success("Order placed successfully!");

      clearCart();

      navigate(`/order-confirmation/${order.id}`);

    } catch (err: any) {
      
        let errorMessage = "Failed to place order";

        if (err.response?.status === 422) {
          // Laravel validation errors
          const errors = err.response.data.errors;

          if (errors) {
            // Convert { field: ["error1", "error2"] } → array of messages
            const messages = Object.values(errors).flat();

            // Join with line breaks or commas
            errorMessage = messages.join(", "); 
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
      setIsProcessing(false);
    }
  };
  const normalizedCart = cart.map(normalizeCartItem);


  const applyCoupon = () => {
    // Mock coupon logic
    if (appliedCoupon.toUpperCase() === 'SAVE10') {
      setCouponDiscount(subscriptionSubtotal * 0.1);
    } else if (appliedCoupon.toUpperCase() === 'FIRST20') {
      setCouponDiscount(subscriptionSubtotal * 0.2);
    } else {
      setError('Invalid coupon code');
      setCouponDiscount(0);
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-8 flex items-center">
              <MapPin className="h-8 w-8 mr-3 text-primary-blue" />
              Shipping Information
            </h2>

            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-fredoka font-semibold text-charcoal mb-4">
                  Saved Addresses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {savedAddresses.map((addr) => (
                    <motion.div
                      key={addr.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddressSelect(addr.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedAddressId === addr.id 
                          ? 'border-primary-blue bg-primary-blue/5' 
                          : 'border-light-gray hover:border-primary-blue/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {addr.type === 'home' ? (
                              <Home className="h-4 w-4 mr-2 text-primary-blue" />
                            ) : (
                              <Building className="h-4 w-4 mr-2 text-primary-blue" />
                            )}
                            <span className="font-fredoka font-semibold text-charcoal">
                              {addr.type === 'home' ? 'Home' : 'Work'}
                            </span>
                            {addr.isDefault && (
                              <span className="ml-2 px-2 py-1 bg-mint-green/20 text-mint-green text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-medium-gray">{addr.fullName}</p>
                          <p className="text-sm text-medium-gray">{addr.address}</p>
                          <p className="text-sm text-medium-gray">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-sm text-medium-gray">{addr.phone}</p>
                        </div>
                        <div className="ml-2">
                          <input
                            type="radio"
                            checked={selectedAddressId === addr.id}
                            onChange={() => handleAddressSelect(addr.id)}
                            className="w-4 h-4 text-primary-blue"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <button
                  onClick={() => setSelectedAddressId(null)}
                  className="text-primary-blue font-fredoka font-medium hover:underline"
                >
                  + Add New Address
                </button>
              </div>
            )}

            {/* Address Form */}
            {(!savedAddresses.length || !selectedAddressId) && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      <User className="inline h-4 w-4 mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.shippingAddress.fullName}
                      onChange={(e) => handleShippingChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.shippingAddress.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Delivery Address</label>
                  <select
                    value={addressOption}
                    onChange={(e) => setAddressOption(e.target.value as 'select' | 'custom')}
                    className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                  >
                    <option value="select">Select Existing Address</option>
                    <option value="custom">Custom Address</option>
                  </select>
                </div>

                {addressOption === 'select' && (
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Choose Address</label>
                    <select
                      value={selectedAddressId || ''}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all mb-2"
                    >
                      {addresses.map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {addr.display_name} - {addr.formatted_address}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {addressOption === 'custom' && (
                  <>
                    <div>
                      <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                        <Home className="inline h-4 w-4 mr-2" />
                        Address *
                      </label>
                      <textarea
                        value={formData.shippingAddress.address}
                        onChange={e => setFormData({
                        ...formData,
                        shippingAddress: {...formData.shippingAddress, address: e.target.value}
                      })}
                        className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                        rows={3}
                        placeholder="House no., Building, Street, Area"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                          <Navigation className="inline h-4 w-4 mr-2" />
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.landmark}
                          onChange={(e) => handleShippingChange('landmark', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                          placeholder="Near landmark"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                          <Building className="inline h-4 w-4 mr-2" />
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.city}
                          onChange={e => setFormData({
                              ...formData,
                              shippingAddress: {...formData.shippingAddress, city: e.target.value}
                            })}
                                className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                          <MapPin className="inline h-4 w-4 mr-2" />
                          State *
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.state}
                          onChange={e => setFormData({
                            ...formData,
                            shippingAddress: {...formData.shippingAddress, state: e.target.value}
                          })}
                          className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                          <Hash className="inline h-4 w-4 mr-2" />
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={formData.shippingAddress.pincode}
                          onChange={e => setFormData({
                            ...formData,
                            shippingAddress: {...formData.shippingAddress, pincode: e.target.value}
                          })}
                          className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                          placeholder="5-digit pincode"
                          maxLength={5}
                          required
                        />
                      </div>
                    </div>

                    {/* Address Type */}
                    <div>
                      <label className="block text-sm font-fredoka font-medium text-charcoal mb-3">
                        Address Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="addressType"
                            value="home"
                            checked={formData.shippingAddress.addressType === 'home'}
                            onChange={e => setFormData({
                              ...formData,
                              shippingAddress: {...formData.shippingAddress, addressType: e.target.value as 'home' | 'work' | 'other'}
                            })}
                            className="mr-2"
                          />
                          <span className="font-fredoka">Home</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="addressType"
                            value="work"
                            checked={formData.shippingAddress.addressType === 'work'}
                            onChange={e => setFormData({
                              ...formData,
                              shippingAddress: {...formData.shippingAddress, addressType: e.target.value as 'home' | 'work' | 'other'}
                            })}
                            className="mr-2"
                          />
                          <span className="font-fredoka">Work</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="addressType"
                            value="other"
                            checked={formData.shippingAddress.addressType === 'other'}
                            onChange={e => setFormData({
                              ...formData,
                              shippingAddress: {...formData.shippingAddress, addressType: e.target.value as 'home' | 'work' | 'other'}
                            })}
                            className="mr-2"
                          />
                          <span className="font-fredoka">Other</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}

            {/* Delivery Options */}
            <div className="mt-8 pt-8 border-t-2 border-light-gray">
              <h3 className="text-lg font-fredoka font-semibold text-charcoal mb-4">
                Delivery Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label 
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.deliveryOption === 'standard' 
                      ? 'border-primary-blue bg-primary-blue/5' 
                      : 'border-light-gray hover:border-primary-blue/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={formData.deliveryOption === 'standard'}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryOption: 'standard' }))}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-primary-blue" />
                      <span className="font-fredoka font-medium">Standard Delivery</span>
                    </div>
                    <p className="text-sm text-medium-gray mt-1">5-7 business days</p>
                    <p className="text-sm font-fredoka font-semibold text-mint-green">
                      {baseShippingCost === 0 ? 'FREE' : `Rs. ${baseShippingCost}`}
                    </p>
                  </div>
                </label>

                <label 
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.deliveryOption === 'express' 
                      ? 'border-primary-blue bg-primary-blue/5' 
                      : 'border-light-gray hover:border-primary-blue/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={formData.deliveryOption === 'express'}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryOption: 'express' }))}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-vibrant-orange" />
                      <span className="font-fredoka font-medium">Express Delivery</span>
                    </div>
                    <p className="text-sm text-medium-gray mt-1">2-3 business days</p>
                    <p className="text-sm font-fredoka font-semibold text-vibrant-orange">
                      +Rs. 100
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Gift Options */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isGift}
                  onChange={(e) => setFormData(prev => ({ ...prev, isGift: e.target.checked }))}
                  className="mr-3"
                />
                <Gift className="h-5 w-5 mr-2 text-coral-red" />
                <span className="font-fredoka font-medium">This is a gift</span>
              </label>
              {formData.isGift && (
                <div className="mt-4">
                  <textarea
                    value={formData.giftMessage}
                    onChange={(e) => setFormData(prev => ({ ...prev, giftMessage: e.target.value }))}
                    placeholder="Add a gift message (optional)"
                    className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-coral-red focus:border-transparent transition-all"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-8 flex items-center">
              <CreditCard className="h-8 w-8 mr-3 text-vibrant-orange" />
              Payment Method
            </h2>
            
            {/* Payment Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === 'card' 
                    ? 'border-vibrant-orange bg-vibrant-orange/5' 
                    : 'border-light-gray hover:border-vibrant-orange/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={() => handlePaymentMethodChange('card')}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <CreditCard className="h-6 w-6 mr-2 text-vibrant-orange" />
                        <span className="font-fredoka font-semibold text-lg">Credit/Debit Card</span>
                      </div>
                      <p className="text-sm text-medium-gray">Pay securely with your card</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      formData.paymentMethod === 'card' 
                        ? 'border-vibrant-orange bg-vibrant-orange' 
                        : 'border-gray-300'
                    }`}>
                      {formData.paymentMethod === 'card' && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.label>

              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod' 
                    ? 'border-vibrant-orange bg-vibrant-orange/5' 
                    : 'border-light-gray hover:border-vibrant-orange/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={() => handlePaymentMethodChange('cod')}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <Truck className="h-6 w-6 mr-2 text-sunny-yellow" />
                        <span className="font-fredoka font-semibold text-lg">Cash on Delivery</span>
                      </div>
                      <p className="text-sm text-medium-gray">Pay when you receive</p>
                      <p className="text-xs text-coral-red mt-1">+Rs. 50 COD charges apply</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      formData.paymentMethod === 'cod' 
                        ? 'border-vibrant-orange bg-vibrant-orange' 
                        : 'border-gray-300'
                    }`}>
                      {formData.paymentMethod === 'cod' && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.label>
            </div>

            {/* Payment Details based on method */}
            <AnimatePresence mode="wait">
              {formData.paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-6 bg-gradient-to-br from-vibrant-orange/5 to-vibrant-orange/10 rounded-xl"
                >
                  <div className="bg-amber-50 p-4 rounded-xl flex items-start">
                    <Info className="h-5 w-5 text-vibrant-orange mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-fredoka font-semibold text-vibrant-orange">
                        Demo Mode
                      </p>
                      <p className="text-sm text-medium-gray">
                        Use test card: 4111 1111 1111 1111, Any future expiry, Any CVV
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardDetails?.number || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '');
                          const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                          setFormData(prev => ({
                            ...prev,
                            cardDetails: {
                              ...prev.cardDetails!,
                              number: formatted
                            }
                          }));
                        }}
                        className="w-full px-4 py-3 pl-12 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-vibrant-orange focus:border-transparent transition-all"
                        maxLength={19}
                      />
                      <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-medium-gray" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.cardDetails?.name || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        cardDetails: {
                          ...prev.cardDetails!,
                          name: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-vibrant-orange focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={formData.cardDetails?.expiry || ''}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setFormData(prev => ({
                              ...prev,
                              cardDetails: {
                                ...prev.cardDetails!,
                                expiry: value
                              }
                            }));
                          }}
                          className="w-full px-4 py-3 pl-12 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-vibrant-orange focus:border-transparent transition-all"
                          maxLength={5}
                        />
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-medium-gray" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                        CVV
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="123"
                          value={formData.cardDetails?.cvv || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            cardDetails: {
                              ...prev.cardDetails!,
                              cvv: e.target.value.replace(/\D/g, '')
                            }
                          }))}
                          className="w-full px-4 py-3 pl-12 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-vibrant-orange focus:border-transparent transition-all"
                          maxLength={4}
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-medium-gray" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {formData.paymentMethod === 'cod' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 bg-gradient-to-br from-sunny-yellow/10 to-sunny-yellow/20 rounded-xl"
                >
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-sunny-yellow mr-2 mt-0.5" />
                    <div>
                      <p className="font-fredoka font-semibold text-charcoal mb-1">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-medium-gray">
                        Rs. 50 additional charges apply for Cash on Delivery orders
                      </p>
                      <p className="text-sm text-medium-gray mt-2">
                        Please keep exact change ready for delivery partner
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Coupon Code */}
            <div className="mt-8 pt-8 border-t-2 border-light-gray">
              <h3 className="text-lg font-fredoka font-semibold text-charcoal mb-4">
                Have a coupon code?
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={appliedCoupon}
                  onChange={(e) => setAppliedCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-lavender focus:border-transparent transition-all uppercase"
                />
                <button
                  onClick={applyCoupon}
                  className="px-6 py-3 bg-lavender text-white rounded-xl hover:bg-lavender/90 transition-colors font-fredoka font-medium"
                >
                  Apply
                </button>
              </div>
              {couponDiscount > 0 && (
                <p className="text-sm text-mint-green mt-2 font-fredoka">
                  ✓ Coupon applied! You saved Rs. {safeDisplayPrice(couponDiscount)}
                </p>
              )}
              <div className="mt-2 text-sm text-medium-gray">
                <p>Try: <span className="font-fredoka font-semibold">SAVE10</span> for 10% off or <span className="font-fredoka font-semibold">FIRST20</span> for 20% off</p>
              </div>
            </div>

            {/* Loyalty Points */}
            {loyaltyCard && loyaltyCard.points > 0 && (
              <div className="mt-6">
                <RedemptionSlider 
                  orderTotal={subtotalAfterCoupon}
                  onRedemptionChange={(points, value) => setLoyaltyRedemption({ points, value })}
                />
              </div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-8">
              Review Your Order
            </h2>

            {/* Delivery Address */}
            <div className="mb-8">
              <h3 className="text-lg font-fredoka font-semibold text-charcoal mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-blue" />
                Delivery Address
              </h3>
              <div className="p-4 bg-soft-gray rounded-xl">
                <p className="font-fredoka font-semibold">{String(formData.shippingAddress.fullName)}</p>
                <p className="text-sm text-medium-gray">{String(formData.shippingAddress.address)}</p>
                <p className="text-sm text-medium-gray">
                  {String(formData.shippingAddress.city)}, {String(formData.shippingAddress.state)} - {String(formData.shippingAddress.pincode)}
                </p>
                <p className="text-sm text-medium-gray">{String(formData.shippingAddress.phone)}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="text-lg font-fredoka font-semibold text-charcoal mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-vibrant-orange" />
                Payment Method
              </h3>
              <div className="p-4 bg-soft-gray rounded-xl">
                <p className="font-fredoka font-semibold">
                  {formData.paymentMethod === 'card' && 'Credit/Debit Card'}
                  {formData.paymentMethod === 'cod' && 'Cash on Delivery'}
                </p>
                {formData.paymentMethod === 'card' && formData.cardDetails && (
                  <p className="text-sm text-medium-gray">
                    •••• •••• •••• {String(formData.cardDetails.number.slice(-4))}
                  </p>
                )}
              </div>
            </div>

            {/* Birthday Discount Banner */}
            {pricing?.birthday_discount?.applies && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <span className="text-6xl animate-bounce">🎉</span>
                  <div className="flex-1">
                    <h3 className="font-fredoka font-bold text-2xl mb-2">
                      {pricing.birthday_discount.message || '🎂 Happy Birthday! Enjoy your special discount'}
                    </h3>
                    <p className="text-lg opacity-95 font-fredoka">
                      You're saving LKR {pricing.birthday_discount.amount.toFixed(2)} on this order!
                    </p>
                    <p className="text-sm opacity-80 mt-1">
                      {pricing.birthday_discount.percentage}% birthday discount applied automatically
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-fredoka font-semibold text-charcoal mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-mint-green" />
                Order Items ({cart.length})
              </h3>
              <div className="space-y-3">
                {isSubscription ? (
                  selectedProducts?.map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-soft-gray rounded-xl">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.primary_image?.url ? `${host}${product.primary_image.url}` : '/placeholder.png'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-fredoka font-semibold text-charcoal">{String(product?.name || 'Product')}</p>
                          <p className="text-sm text-medium-gray">Qty: {deliveryCount} </p>
                        </div>
                      </div>
                      <p className="font-fredoka font-semibold text-charcoal">
                        {getCurrencyDisplay(product?.currency || 'LKR')} {safeDisplayPrice((product?.subscription_price || 0) * deliveryCount)}
                      </p>
                    </div>
                  ))
                ) : (
                normalizedCart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-soft-gray rounded-xl">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product?.image || '/placeholder.png'}
                        alt={item.product?.name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-fredoka font-semibold text-charcoal">{String(item.product?.name || 'Product')}</p>
                        <p className="text-sm text-medium-gray">Qty: {item.quantity} </p>
                      </div>
                    </div>
                    <p className="font-fredoka font-semibold text-charcoal">
                      {currentCurrency} {safeDisplayPrice((item.product?.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))
                )}
              </div>
            </div>

            {/* Gift Message */}
            {formData.isGift && formData.giftMessage && (
              <div className="mb-8 p-4 bg-coral-red/10 rounded-xl">
                <div className="flex items-start">
                  <Gift className="h-5 w-5 text-coral-red mr-2 mt-0.5" />
                  <div>
                    <p className="font-fredoka font-semibold text-charcoal mb-1">Gift Message</p>
                    <p className="text-sm text-medium-gray">{String(formData.giftMessage)}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-gray to-off-white">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <motion.div 
              className={`flex items-center ${step >= 1 ? 'text-primary-blue' : 'text-medium-gray'}`}
              animate={{ scale: step === 1 ? 1.1 : 1 }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                step >= 1 ? 'bg-primary-blue text-white' : 'bg-light-gray'
              }`}>
                {step > 1 ? <CheckCircle className="h-6 w-6" /> : '1'}
              </div>
              <span className="ml-3 font-fredoka font-medium hidden sm:inline">Shipping</span>
            </motion.div>
            
            <div className={`mx-4 sm:mx-8 w-16 sm:w-24 h-1 rounded-full transition-all ${
              step >= 2 ? 'bg-primary-blue' : 'bg-light-gray'
            }`} />
            
            <motion.div 
              className={`flex items-center ${step >= 2 ? 'text-vibrant-orange' : 'text-medium-gray'}`}
              animate={{ scale: step === 2 ? 1.1 : 1 }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                step >= 2 ? 'bg-vibrant-orange text-white' : 'bg-light-gray'
              }`}>
                {step > 2 ? <CheckCircle className="h-6 w-6" /> : '2'}
              </div>
              <span className="ml-3 font-fredoka font-medium hidden sm:inline">Payment</span>
            </motion.div>
            
            <div className={`mx-4 sm:mx-8 w-16 sm:w-24 h-1 rounded-full transition-all ${
              step >= 3 ? 'bg-mint-green' : 'bg-light-gray'
            }`} />
            
            <motion.div 
              className={`flex items-center ${step >= 3 ? 'text-mint-green' : 'text-medium-gray'}`}
              animate={{ scale: step === 3 ? 1.1 : 1 }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                step >= 3 ? 'bg-mint-green text-white' : 'bg-light-gray'
              }`}>
                3
              </div>
              <span className="ml-3 font-fredoka font-medium hidden sm:inline">Review</span>
            </motion.div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-red-500 mb-6 p-4 bg-coral-red/10 border-2 border-coral-red/20 text-coral-red rounded-xl flex items-center max-w-4xl mx-auto"
          >
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            <span className="font-fredoka text-red-500">{error}</span>
          </motion.div>
        )}

        {pricingError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-vibrant-orange/10 border-2 border-vibrant-orange/20 text-vibrant-orange rounded-xl flex items-center justify-between max-w-4xl mx-auto"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-fredoka">{pricingError}</span>
            </div>
            <button
              onClick={() => fetchPricing(subscriptionSubtotal)}
              className="px-4 py-2 bg-vibrant-orange text-white rounded-lg hover:bg-vibrant-orange/90 transition-colors font-fredoka text-sm"
            >
              Retry
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex justify-between"
            >
              {step > 1 ? (
                <button
                  onClick={handlePreviousStep}
                  className="flex items-center px-6 py-3 border-2 border-light-gray rounded-xl text-charcoal hover:bg-soft-gray transition-all font-fredoka font-medium"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Back
                </button>
              ) : (
                <button
                  onClick={() => navigate('/cart')}
                  className="flex items-center px-6 py-3 border-2 border-light-gray rounded-xl text-charcoal hover:bg-soft-gray transition-all font-fredoka font-medium"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Back to Cart
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="flex items-center px-8 py-3 bg-primary-blue text-white rounded-xl hover:bg-primary-blue/90 transition-all font-fredoka font-medium"
                >
                  Continue
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex items-center px-8 py-3 bg-mint-green text-white rounded-xl hover:bg-mint-green/90 transition-all font-fredoka font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Place Order
                    </>
                  )}
                </button>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <ErrorBoundary fallback={<div className="bg-white rounded-2xl shadow-xl p-6 text-red-500">Error loading order summary</div>}>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 sticky top-6"
              >
                <h3 className="text-xl font-fredoka font-bold text-charcoal mb-6">Order Summary</h3>
                
                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {isSubscription
                    ? selectedProducts?.map((product: any) => {
                        const currencyDisplay = getCurrencyDisplay(product.currency);
                        const priceDisplay = safeDisplayPrice(product.subscription_price);
                        
                        return (
                          <div key={product.id} className="flex justify-between items-start text-sm">
                            <div className="flex-1">
                              <p className="font-fredoka font-medium text-charcoal">{String(product.name)}</p>
                              <p className="text-medium-gray">
                                Qty: {deliveryCount} × {String(currencyDisplay)} {priceDisplay}
                              </p>
                              <p className="text-medium-gray">
                                (Quantity for the time period is {deliveryCount})
                              </p>
                            </div>
                            <p className="font-fredoka font-semibold text-charcoal ml-2">
                              {String(currencyDisplay)} {priceDisplay}
                            </p>
                          </div>
                        );
                      })
                    : cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                          <div className="flex-1">
                            <p className="font-fredoka font-medium text-charcoal">{String(item.product.name)}</p>
                            <p className="text-medium-gray">
                              Qty: {item.quantity} × {currentCurrency} {safeDisplayPrice(item.product.price)}
                            </p>
                          </div>
                          <p className="font-fredoka font-semibold text-charcoal ml-2">
                            {currentCurrency} {safeDisplayPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))
                  }
                </div>

                {/* Price Breakdown */}
                <div className="border-t-2 border-light-gray pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-medium-gray">Subtotal</span>
                    <span className="font-fredoka font-medium">
                      {currentCurrency} {safeDisplayPrice(subscriptionSubtotal)}
                    </span>
                  </div>

                  {/* Birthday Discount from Backend API */}
                  {pricingLoading && (
                    <div className="flex justify-between text-sm">
                      <span className="text-medium-gray">Checking for discounts...</span>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-blue" />
                    </div>
                  )}

                  {pricing?.birthday_discount?.applies && (
                    <div className="p-3 bg-gradient-to-r from-coral-red/10 to-sunny-yellow/10 rounded-xl border-2 border-coral-red/20">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">🎂</span>
                          <span className="font-fredoka font-semibold text-coral-red">Birthday Special!</span>
                        </div>
                        <span className="font-fredoka font-bold text-coral-red">
                          -{currentCurrency} {safeDisplayPrice(pricing.birthday_discount.amount)}
                        </span>
                      </div>
                      <p className="text-xs text-medium-gray ml-10">
                        {pricing.birthday_discount.message}
                      </p>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-medium-gray flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        Coupon Discount
                      </span>
                      <span className="font-fredoka font-medium text-mint-green">
                        -{currentCurrency} {safeDisplayPrice(couponDiscount)}
                      </span>
                    </div>
                  )}
                  
                  {loyaltyRedemption.value > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-medium-gray flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Loyalty Points
                      </span>
                      <span className="font-fredoka font-medium text-lavender">
                        -{currentCurrency} {safeDisplayPrice(loyaltyRedemption.value)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-medium-gray flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      Shipping
                    </span>
                    <span className="font-fredoka font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-mint-green">FREE</span>
                      ) : (
                        `${currentCurrency} ${safeDisplayPrice(shippingCost)}`
                      )}
                    </span>
                  </div>
                  
                  {formData.paymentMethod === 'cod' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-medium-gray">COD Charges</span>
                      <span className="font-fredoka font-medium">{currentCurrency} 50</span>
                    </div>
                  )}
                  
                  <div className="border-t-2 border-light-gray pt-3 flex justify-between">
                    <span className="font-fredoka font-bold text-lg text-charcoal">Total</span>
                    <span className="font-fredoka font-bold text-xl text-charcoal">
                      {currentCurrency} {safeDisplayPrice(finalTotal)}
                    </span>
                  </div>

                  {/* Points Earning Info - Always visible */}
                  <div className="mt-3 pt-3 border-t border-light-gray">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-lavender">
                        <Star className="h-4 w-4 mr-1 fill-lavender" />
                        <span className="font-fredoka font-medium">Points to Earn</span>
                      </div>
                      <span className="font-fredoka font-bold text-lavender text-base">
                        +{pointsToEarn} pts
                      </span>
                    </div>
                    {pricing?.loyalty_points && (
                      <div className="mt-1 text-xs text-medium-gray text-right">
                        New balance: {pricing.loyalty_points.new_balance} points
                      </div>
                    )}
                  </div>
                </div>

                {/* Loyalty Points Earning - Prominent Banner */}
                <div className="mt-6 p-4 bg-gradient-to-r from-lavender/20 to-primary-blue/10 rounded-xl border-2 border-lavender/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="bg-lavender rounded-full p-2 mr-3">
                          <Star className="h-5 w-5 text-white fill-white" />
                        </div>
                        <div>
                          <p className="font-fredoka font-bold text-charcoal text-base">
                            Earn {pointsToEarn} Loyalty Points
                          </p>
                          <p className="text-xs text-medium-gray">
                            Complete this purchase to earn rewards
                          </p>
                        </div>
                      </div>
                      {pricing?.loyalty_points && (
                        <div className="ml-12 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-medium-gray">Current Balance:</span>
                            <span className="font-fredoka font-semibold text-charcoal">
                              {pricing.loyalty_points.current_balance} pts
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-medium-gray">After Purchase:</span>
                            <span className="font-fredoka font-bold text-lavender">
                              {pricing.loyalty_points.new_balance} pts
                            </span>
                          </div>
                        </div>
                      )}
                      {!loyaltyCard && (
                        <div className="ml-12 mt-2">
                          <p className="text-xs text-primary-blue font-fredoka">
                            💡 Join our loyalty program to start earning rewards!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-4 bg-mint-green/10 rounded-xl">
                  <div className="flex items-center text-mint-green">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="text-sm font-fredoka font-medium">100% Secure Checkout</span>
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-medium-gray">
                    Estimated delivery by
                  </p>
                  <p className="font-fredoka font-semibold text-charcoal">
                    {formData.deliveryOption === 'express' 
                      ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })
                      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })
                    }
                  </p>
                </div>
              </motion.div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;