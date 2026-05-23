import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, host } from "../../../services/api";

// Step 1 — Interfaces
interface GiftItem {
  id: string;       // "theme-5" or "prod-12"
  rawId: number;    // the actual DB id (5 or 12)
  name: string;
  price: number;
  image: string;
  description: string;
  type: 'theme' | 'product';
}

interface GiftStep {
  id: number;
  key: string;
  title: string;
  shortTitle: string;
  type: 'theme' | 'product';
  items: GiftItem[];
  minSelection: number;
  maxSelection: number;
}

// Step 4 — Image helper
const getItemImage = (item: any, type: string): string => {
  if (type === 'theme') {
    if (item.image_url) return item.image_url.startsWith('http')
      ? item.image_url
      : `${host}/storage/${item.image_url}`;
  }
  // product
  if (item.primary_image?.image_url) return item.primary_image.image_url;
  if (item.primary_image?.path)      return `${host}/storage/${item.primary_image.path}`;
  return 'https://via.placeholder.com/300x300/f0f0f0/999999?text=No+Image';
};

const GiftCustomizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState<{ [key: number]: string[] }>({});
  const [isStepCompleted, setIsStepCompleted] = useState<{ [key: number]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step 2 — Single steps state (replaces themes + priorityProducts)
  const [steps, setSteps] = useState<GiftStep[]>([]);

  // Step 2 — Personalization state
  const [giftDetails, setGiftDetails] = useState({
    recipient_name: '',
    custom_message: '',
    occasion: '',
  });
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);

  const navigate = useNavigate();

  // Step 3 — Single API call to /gifts/sections
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await api.get('/gifts/sections');
        const sectionsData: any[] = (res.data as any).data || [];

        const stepMinMax: Record<string, { min: number; max: number; short: string }> = {
          theme:          { min: 1, max: 1, short: 'Theme Card' },
          toy:            { min: 1, max: 1, short: 'Pet Toy' },
          treat:          { min: 1, max: 3, short: 'Treats' },
          care:           { min: 1, max: 2, short: 'Care Products' },
          accessory:      { min: 1, max: 2, short: 'Accessories' },
          greeting_card:  { min: 1, max: 1, short: 'Greeting Card' },
          wrapping_paper: { min: 1, max: 1, short: 'Wrapping Paper' },
        };

        const built: GiftStep[] = sectionsData.map((section: any) => {
          const config = stepMinMax[section.key] ?? { min: 1, max: 1, short: section.label };

          const items: GiftItem[] = (section.items || []).map((item: any) => ({
            id:          `${section.type}-${item.id}`,
            rawId:       item.id,
            name:        item.name,
            price:       section.type === 'theme'
                           ? (item.price_range?.min ?? 0)
                           : Number(item.price),
            image:       getItemImage(item, section.type),
            description: item.description ?? '',
            type:        section.type,
          }));

          return {
            id:           section.step,
            key:          section.key,
            title:        section.label,
            shortTitle:   config.short,
            type:         section.type,
            items,
            minSelection: config.min,
            maxSelection: config.max,
          };
        });

        setSteps(built);
      } catch (e) {
        console.error('Error fetching gift sections:', e);
        setError('Failed to load gift customization data');
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  // Step 5 — handleProductSelect now uses step.items
  const handleProductSelect = (stepId: number, productId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    const currentSelections = selections[stepId] || [];

    if (currentSelections.includes(productId)) {
      const newSelections = currentSelections.filter(id => id !== productId);
      setSelections(prev => ({ ...prev, [stepId]: newSelections }));
      setIsStepCompleted(prev => ({ ...prev, [stepId]: newSelections.length >= step.minSelection }));
    } else {
      let newSelections = [...currentSelections];

      if (step.maxSelection === 1) {
        newSelections = [productId];
      } else if (currentSelections.length < step.maxSelection) {
        newSelections.push(productId);
      } else {
        return;
      }

      setSelections(prev => ({ ...prev, [stepId]: newSelections }));
      setIsStepCompleted(prev => ({ ...prev, [stepId]: newSelections.length >= step.minSelection }));
    }
  };

  const canProceedToNext = () => isStepCompleted[currentStep] || false;
  const goToNextStep = () => { if (canProceedToNext() && currentStep < steps.length) setCurrentStep(currentStep + 1); };
  const goToPreviousStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  // Step 6 — Handle adding gift box to cart
  const handleAddGiftBoxToCart = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login', { state: { from: '/gifts/customize' } });
      return;
    }

    setShowPersonalizeModal(true);
  };

  const submitGiftBoxToCart = async () => {
    setShowPersonalizeModal(false);
    setIsSubmitting(true);

    try {
      // Collect selected products (non-theme steps)
      const productMap: Record<number, number> = {};
      steps.forEach(step => {
        if (step.type !== 'product') return;
        const ids = selections[step.id] ?? [];
        ids.forEach(id => {
          const item = step.items.find(p => p.id === id);
          if (!item) return;
          productMap[item.rawId] = (productMap[item.rawId] ?? 0) + 1;
        });
      });

      const products = Object.entries(productMap).map(([productId, quantity]) => ({
        product_id: Number(productId),
        quantity,
      }));

      console.log('Adding gift box to cart:', { products, count: products.length });

      if (products.length === 0) {
        throw new Error('No products selected. Please select at least one product.');
      }

      // Add to cart via new endpoint
      const res = await api.post<any>('/cart/add-gift-box', {
        products,
        recipient_name: giftDetails.recipient_name || undefined,
        gift_message: giftDetails.custom_message || undefined,
      });

      console.log('API Response:', res);

      // Check if the API call succeeded
      if (!res || !res.data) {
        throw new Error('Invalid response from server');
      }

      const apiResponse = res.data as any;

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to add gift box to cart');
      }

      const responseData = apiResponse.data || apiResponse;
      const totalQuantity = responseData.total_quantity ?? products.reduce((sum, p) => sum + p.quantity, 0);

      console.log('Navigating to confirmation with:', { totalQuantity, products: products.length });

      // Navigate to success page
      navigate('/gifts/cart-confirmation', {
        state: {
          itemsAdded: totalQuantity,
          productsCount: products.length,
          recipientName: giftDetails.recipient_name || null,
        },
        replace: true,
      });

    } catch (err: any) {
      console.error('Failed to add gift box to cart:', err);
      alert(err.message || 'Failed to add gift box to cart. Please try again.');
      setError(err.message || 'Failed to add gift box to cart. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowPersonalizeModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-vibrant-orange mx-auto mb-4"></div>
          <p className="text-xl text-charcoal">Loading gift customizer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-vibrant-orange text-white rounded-xl font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep - 1];

  if (!currentStepData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500">No steps available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-amber-50">
      <section className="pt-8 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-sunny-yellow text-center mb-12"
          >
            Let's Wrap it !!!
          </motion.h1>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {steps.map((step) => (
              <motion.button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                disabled={step.id > 1 && !isStepCompleted[step.id - 1]}
                className={`px-6 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                  step.id === currentStep ? 'bg-charcoal text-white shadow-lg' :
                  isStepCompleted[step.id] ? 'bg-green-500 text-white shadow-md' :
                  step.id === 1 || isStepCompleted[step.id - 1] ? 'bg-vibrant-orange text-white hover:bg-sunny-yellow shadow-md' :
                  'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isStepCompleted[step.id] && <Check className="h-4 w-4" />}
                  <span>{step.id === 1 ? step.title : `Step ${step.id}`}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="container mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
                  {currentStepData.title}
                </h2>
                <p className="text-lg text-gray-600">
                  {currentStepData.maxSelection === 1
                    ? "Choose one option"
                    : `Select ${currentStepData.minSelection}–${currentStepData.maxSelection} options`
                  }
                </p>
              </div>

              {/* Step 5 — step.items */}
              {currentStepData.items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products available for this step.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentStepData.items.map((product) => {
                      const isSelected = (selections[currentStep] || []).includes(product.id);

                      return (
                        <motion.div
                          key={product.id}
                          className={`relative bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 ${
                            isSelected ? 'ring-4 ring-vibrant-orange bg-gradient-to-br from-vibrant-orange/5 to-sunny-yellow/5' : 'hover:shadow-xl hover:scale-105'
                          }`}
                          onClick={() => handleProductSelect(currentStep, product.id)}
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 bg-vibrant-orange text-white rounded-full p-2 shadow-lg z-10"
                            >
                              <Check className="h-4 w-4" />
                            </motion.div>
                          )}

                          <div className="text-center mb-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-xl mb-4"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/300x300/f0f0f0/999999?text=Product+Image";
                              }}
                            />
                            <h3 className="text-xl font-bold text-charcoal mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                            <div className="text-2xl font-bold text-vibrant-orange">Rs.{product.price}</div>
                          </div>

                          <div className="text-center">
                            <button className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                              isSelected ? 'bg-vibrant-orange text-white' : 'bg-gray-100 text-charcoal hover:bg-vibrant-orange hover:text-white'
                            }`}>
                              {isSelected ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={goToPreviousStep}
                      disabled={currentStep === 1}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        currentStep === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                      }`}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      <span>Previous</span>
                    </button>

                    {/* Step 7 — Updated final button */}
                    {currentStep < steps.length ? (
                      <button
                        onClick={goToNextStep}
                        disabled={!canProceedToNext()}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          canProceedToNext() ? 'bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Next</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleAddGiftBoxToCart}
                        disabled={!canProceedToNext() || isSubmitting}
                        className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                          canProceedToNext() && !isSubmitting
                            ? 'bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white hover:shadow-lg'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            <span>Adding to Cart...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Step 9 — Summary sidebar with running total */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-2xl p-6 shadow-xl border border-gray-200 w-80 hidden xl:block z-50">
        <h3 className="text-xl font-bold text-charcoal mb-4">Your Custom Box</h3>
        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
          {Object.entries(selections).map(([stepId, productIds]) => {
            const step = steps.find(s => s.id === parseInt(stepId));
            if (!step || productIds.length === 0) return null;
            return (
              <div key={stepId} className="border-b border-gray-100 pb-2">
                <h4 className="font-semibold text-sm text-gray-700 mb-1">{step.shortTitle}</h4>
                {productIds.map(productId => {
                  const product = step.items.find(p => p.id === productId);
                  if (!product) return null;
                  return (
                    <div key={productId} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 truncate">{product.name}</span>
                      <span className="font-semibold text-vibrant-orange">Rs.{product.price}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {Object.keys(selections).length > 0 && (() => {
          const subtotal = steps.reduce((sum, step) => {
            const ids = selections[step.id] ?? [];
            return sum + ids.reduce((s, id) => {
              const item = step.items.find(p => p.id === id);
              return s + (item?.price ?? 0);
            }, 0);
          }, 0);
          const discountPct = subtotal >= 10000 ? 10 : subtotal >= 5000 ? 8 : subtotal >= 2500 ? 6 : subtotal >= 1000 ? 5 : 0;
          const discountAmt = subtotal * (discountPct / 100);
          const finalTotal = subtotal - discountAmt;
          return (
            <div className="border-t border-gray-200 pt-3 space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>Rs.{subtotal.toFixed(2)}</span>
              </div>
              {discountPct > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-semibold">
                  <span>Bundle Discount ({discountPct}%)</span>
                  <span>- Rs.{discountAmt.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-charcoal text-base">
                <span>Total</span><span>Rs.{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Step 7 — Updated loading overlay */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md text-center"
          >
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">Adding to Cart!</h3>
            <p className="text-gray-600 mb-4">Adding your gift box items...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-orange mx-auto"></div>
          </motion.div>
        </motion.div>
      )}

      {/* Step 8 — Personalization modal */}
      {showPersonalizeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-charcoal mb-6">Add Gift Details (Optional) 🎁</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Recipient's Name
                </label>
                <input
                  type="text"
                  placeholder="Who is this gift for? (optional)"
                  value={giftDetails.recipient_name}
                  onChange={e => setGiftDetails(prev => ({ ...prev, recipient_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Occasion</label>
                <select
                  value={giftDetails.occasion}
                  onChange={e => setGiftDetails(prev => ({ ...prev, occasion: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                >
                  <option value="">Select occasion (optional)</option>
                  <option value="birthday">Birthday</option>
                  <option value="christmas">Christmas</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="just_because">Just Because</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gift Message</label>
                <textarea
                  rows={3}
                  placeholder="Write a personal message..."
                  value={giftDetails.custom_message}
                  onChange={e => setGiftDetails(prev => ({ ...prev, custom_message: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-vibrant-orange resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPersonalizeModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-charcoal font-semibold hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={submitGiftBoxToCart}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white hover:shadow-lg transition-all"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GiftCustomizer;
