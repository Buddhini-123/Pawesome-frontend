import React, { useState , useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import {api, host} from "../../../services/api"
import Product from '../Products/ProductTabs';

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
  
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await api.get("/gifts/themes");
        setThemes((res.data as any).data || []);
      } catch (err) {
        console.error("Failed to load themes:", err);
        setError("Failed to load themes");
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const steps: Step[] = [
    {
      id: 1,
      title: "Choose a Theme Card",
      shortTitle: "Theme Card",
      minSelection: 1,
      maxSelection: 1,
      products: themes
        .filter((theme) => Array.isArray(theme.target_categories) && theme.target_categories.includes("theme"))
        .map((theme) => ({
          id: String(theme.id),
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
      products: themes
        .filter((theme) => Array.isArray(theme.target_categories) && theme.target_categories.includes("toy"))
        .map((theme) => ({
          id: String(theme.id),
          name: theme.name,
          price: theme.price_range?.min ?? 0,
          image: `${host}/storage/${theme.image_url}`,
          description: theme.description,
          category: "toy",
        })),
    },
    {
      id: 3,
      title: "Select Your Complementary Pet Toys",
      shortTitle: "Extra Toys",
      minSelection: 1,
      maxSelection: 3,
      products: themes
        .filter((theme) => Array.isArray(theme.target_categories) && theme.target_categories.includes("c_toy"))
        .map((theme) => ({
          id: String(theme.id),
          name: theme.name,
          price: theme.price_range?.min ?? 0,
          image: `${host}/storage/${theme.image_url}`,
          description: theme.description,
          category: "c_toy",
        })),
    },
    {
      id: 4,
      title: "Select Your Pet Treats",
      shortTitle: "Treats",
      minSelection: 1,
      maxSelection: 3,
      products: themes
        .filter((theme) => Array.isArray(theme.target_categories) && theme.target_categories.includes("treat"))
        .map((theme) => ({
          id: String(theme.id),
          name: theme.name,
          price: theme.price_range?.min ?? 0,
          image: `${host}/storage/${theme.image_url}`,
          description: theme.description,
          category: "treat",
        })),
    },
    {
      id: 5,
      title: "Select Pet Care Products",
      shortTitle: "Care Products",
      minSelection: 1,
      maxSelection: 2,
      products: themes
        .filter((theme) => Array.isArray(theme.target_categories) && theme.target_categories.includes("care"))
        .map((theme) => ({
          id: String(theme.id),
          name: theme.name,
          price: theme.price_range?.min ?? 0,
          image: `${host}/storage/${theme.image_url}`,
          description: theme.description,
          category: "care",
        })),
    },
    {
      id: 6,
      title: "Select Pet Accessories & Clothings",
      shortTitle: "Accessories",
      minSelection: 1,
      maxSelection: 2,
      products: themes
        .filter((theme) => Array.isArray(theme.target_categories) && theme.target_categories.includes("accessory"))
        .map((theme) => ({
          id: String(theme.id),
          name: theme.name,
          price: theme.price_range?.min ?? 0,
          image: `${host}/storage/${theme.image_url}`,
          description: theme.description,
          category: "accessory",
        })),
    },
    {
      id: 7,
      title: "Add A Greeting Card",
      shortTitle: "Greeting Card",
      minSelection: 1,
      maxSelection: 1,
      products: themes
        .filter((theme) => Array.isArray(theme.target_categories) && theme.target_categories.includes("card"))
        .map((theme) => ({
          id: String(theme.id),
          name: theme.name,
          price: theme.price_range?.min ?? 0,
          image: `${host}/storage/${theme.image_url}`,
          description: theme.description,
          category: "card",
        })),
    }
  ];
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

  const getTotalPrice = () => {
    let total = 0;
    Object.entries(selections).forEach(([stepId, productIds]) => {
      const step = steps.find(s => s.id === parseInt(stepId));
      if (step) {
        productIds.forEach(productId => {
          const product = step.products.find(p => p.id === productId);
          if (product) total += product.price;
        });
      }
    });
    return total;
  };

  const handleAddToCart = async () => {
    if (!canProceedToNext()) return; 

    setIsAddingToCart(true);

    try {
      // Flatten all selections into actual product objects
      const selectedProducts: any[] = [];
      Object.entries(selections).forEach(([stepId, productIds]) => {
        const step = steps.find(s => s.id === parseInt(stepId));
        if (!step) return;

        productIds.forEach((productId) => {
          const product = step.products.find(p => p.id === productId);
          if (product) {
            selectedProducts.push({
              id: `gift-${product.id}-${Date.now()}`,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category,
              description: product.description,
              quantity: 1,
            });
          }
        });
      });

      if (selectedProducts.length === 0) {
        setIsAddingToCart(false);
        return;
      }

      // Add each selected product to cart
      selectedProducts.forEach(product => addItem(product));

      // Wait a short moment, then navigate to cart
      setTimeout(() => {
        setIsAddingToCart(false);
        navigate("/cart");
      }, 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsAddingToCart(false);
    }
  };

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
                whileHover={step.id === 1 || isStepCompleted[step.id - 1] ? { scale: 1.05 } : {}}
                whileTap={step.id === 1 || isStepCompleted[step.id - 1] ? { scale: 0.95 } : {}}
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
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-lg text-gray-600">
                {steps[currentStep - 1].maxSelection === 1 ? "Choose one option" : `Select ${steps[currentStep - 1].minSelection}-${steps[currentStep - 1].maxSelection || 'unlimited'} options`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {steps[currentStep - 1].products.map((product) => {
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

              <div className="text-center">
                <p className="text-sm text-gray-600">Selected: {(selections[currentStep] || []).length} of {steps[currentStep - 1].maxSelection || '∞'}</p>
                {!canProceedToNext() && <p className="text-sm text-red-500 mt-1">Please select at least {steps[currentStep - 1].minSelection} option(s)</p>}
              </div>

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
                      <span>Add to Cart - Rs.{getTotalPrice()}</span>
                    </>
                  )}
                </button>
              )}
            </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Summary Sidebar (Fixed) */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-2xl p-6 shadow-xl border border-gray-200 w-80 hidden xl:block z-50">
        <h3 className="text-xl font-bold text-charcoal mb-4">Your Custom Box</h3>
        
        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
          {Object.entries(selections).map(([stepId, productIds]) => {
            const step = steps.find(s => s.id === parseInt(stepId));
            if (!step || productIds.length === 0) return null;
            
            return (
              <div key={stepId} className="border-b border-gray-100 pb-2">
                <h4 className="font-semibold text-sm text-gray-700 mb-1">
                  {step.shortTitle}
                </h4>
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
        
        {getTotalPrice() > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-vibrant-orange">Rs.{getTotalPrice()}</span>
            </div>
            {getTotalPrice() >= 2000 && (
              <p className="text-green-600 text-sm mt-2">🚚 Free shipping included!</p>
            )}
          </div>
        )}
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
            <p className="text-gray-600 mb-4">Your custom pet gift box is being added to cart...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-orange mx-auto"></div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GiftCustomizer;