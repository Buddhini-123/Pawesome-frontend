import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { api, host } from "../../../services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface Step {
  id: number;
  title: string;
  shortTitle: string;
  products: Product[];
  minSelection: number;
  maxSelection?: number;
}

interface Theme {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price_range: {
    min: number;
    max: number;
    formatted: string;
    currency: string;
  };
  target_categories: JSON;
}

const GiftCustomizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState<{ [key: number]: string[] }>({});
  const [isStepCompleted, setIsStepCompleted] = useState<{ [key: number]: boolean }>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priorityProducts, setPriorityProducts] = useState<{ [key: number]: any[] }>({
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [],
  });

  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const themeRes = await api.get("/gifts/themes");
        setThemes((themeRes.data as any).data || []);

        const priorities = [2, 3, 4, 5, 6, 7];
        const responses = await Promise.all(
          priorities.map(p => api.get(`/products?gift_priority=${p}`))
        );

        const productsByPriority: { [key: number]: any[] } = {};
        priorities.forEach((p, index) => {
          productsByPriority[p] = (responses[index].data as any).data || [];
        });

        setPriorityProducts(productsByPriority);
      } catch (e) {
        console.error("Error fetching data:", e);
        setError("Failed to load gift customization data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSteps = (): Step[] => [
    {
      id: 1,
      title: "Choose a Theme Card",
      shortTitle: "Theme Card",
      minSelection: 1,
      maxSelection: 1,
      products: themes.map((theme) => ({
        id: `theme-${theme.id}`, // <--- Prefixed ID
        name: theme.name,
        price: theme.price_range?.min ?? 0,
        image: `${host}/storage/${theme.image_url}`,
        description: theme.description,
        category: "theme",
      })),
    },
    {
      id: 2,
      title: "Select Your Main Theme Pet Toy",
      shortTitle: "Main Toy",
      minSelection: 1,
      maxSelection: 1,
      products: priorityProducts[2].map(p => ({
        id: `prod-${p.id}`, // <--- Prefixed ID
        name: p.name,
        price: p.price,
        image: `${host}/storage/${p.primary_image.path}`,
        description: p.description,
        category: "main_toy",
      })),
    },
    {
      id: 3,
      title: "Select Your Complementary Pet Toys",
      shortTitle: "Extra Toys",
      minSelection: 1,
      maxSelection: 3,
      products: priorityProducts[3].map(p => ({
        id: `prod-${p.id}`, // <--- Prefixed ID
        name: p.name,
        price: p.price,
        image: `${host}/storage/${p.primary_image.path}`,
        description: p.description,
        category: "extra_toys",
      })),
    },
    {
      id: 4,
      title: "Select Your Pet Treats",
      shortTitle: "Treats",
      minSelection: 1,
      maxSelection: 3,
      products: priorityProducts[4].map(p => ({
        id: `prod-${p.id}`, // <--- Prefixed ID
        name: p.name,
        price: p.price,
        image: `${host}/storage/${p.primary_image.path}`,
        description: p.description,
        category: "treats",
      })),
    },
    {
      id: 5,
      title: "Select Pet Care Products",
      shortTitle: "Care Products",
      minSelection: 1,
      maxSelection: 2,
      products: priorityProducts[5].map(p => ({
        id: `prod-${p.id}`, // <--- Prefixed ID
        name: p.name,
        price: p.price,
        image: `${host}/storage/${p.primary_image.path}`,
        description: p.description,
        category: "care_products",
      })),
    },
    {
      id: 6,
      title: "Select Pet Accessories & Clothing",
      shortTitle: "Accessories",
      minSelection: 1,
      maxSelection: 2,
      products: priorityProducts[6].map(p => ({
        id: `prod-${p.id}`, // <--- Prefixed ID
        name: p.name,
        price: p.price,
        image: `${host}/storage/${p.primary_image.path}`,
        description: p.description,
        category: "accessories",
      })),
    },
    {
      id: 7,
      title: "Add A Greeting Card",
      shortTitle: "Greeting Card",
      minSelection: 1,
      maxSelection: 1,
      products: priorityProducts[7].map(p => ({
        id: `prod-${p.id}`, // <--- Prefixed ID
        name: p.name,
        price: p.price,
        image: `${host}/storage/${p.primary_image.path}`,
        description: p.description,
        category: "greeting_card",
      })),
    }
  ];

  const steps = getSteps();

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
      } else if (!step.maxSelection || currentSelections.length < step.maxSelection) {
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

  const handleAddToCart = async () => {
    if (!canProceedToNext()) return; 

    setIsAddingToCart(true);

    try {
      // Collect all products
      const selectedProductsMap: { [id: string]: any } = {};

      Object.entries(selections).forEach(([stepId, productIds]) => {
        const step = steps.find(s => s.id === parseInt(stepId));
        if (!step) return;

        productIds.forEach((productId) => {
          const product = step.products.find(p => p.id === productId);
          if (!product) return;

          // Because IDs are now unique (prefixed), this checks for true duplicates only
          if (selectedProductsMap[product.id]) {
            selectedProductsMap[product.id].quantity += 1;
          } else {
            selectedProductsMap[product.id] = {
              ...product, // Pass the whole product object including the new unique ID
              quantity: 1,
            };
          }
        });
      });

      const selectedProducts = Object.values(selectedProductsMap);

      if (selectedProducts.length === 0) {
        setIsAddingToCart(false);
        return;
      }

      // FIX 2: Use sequential await loop to prevent state batching issues
      for (const product of selectedProducts) {
        await addItem(product);
        // Small delay to allow React Context/State to settle
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setIsAddingToCart(false);
      navigate("/cart");

    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsAddingToCart(false);
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
                  : `Select ${currentStepData.minSelection}-${currentStepData.maxSelection || 'unlimited'} options`
                }
              </p>
            </div>

            {currentStepData.products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products available for this step.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {currentStepData.products.map((product) => {
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
                      onClick={handleAddToCart} 
                      disabled={!canProceedToNext() || isAddingToCart} 
                      className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                        canProceedToNext() && !isAddingToCart ? 'bg-gradient-to-r from-mint to-emerald-500 text-white hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isAddingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

      {/* Summary Sidebar (Hidden on Mobile) */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-2xl p-6 shadow-xl border border-gray-200 w-80 hidden xl:block z-50">
        <h3 className="text-xl font-bold text-charcoal mb-4">Your Custom Box</h3>
        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
          {Object.entries(selections).map(([stepId, productIds]) => {
            const step = steps.find(s => s.id === parseInt(stepId));
            if (!step || productIds.length === 0) return null;
            return (
              <div key={stepId} className="border-b border-gray-100 pb-2">
                <h4 className="font-semibold text-sm text-gray-700 mb-1">{step.shortTitle}</h4>
                {productIds.map(productId => {
                  const product = step.products.find(p => p.id === productId);
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
      </div>

      {isAddingToCart && (
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
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">Gift Box Created!</h3>
            <p className="text-gray-600 mb-4">Adding all 7 items to your cart...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-orange mx-auto"></div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GiftCustomizer;