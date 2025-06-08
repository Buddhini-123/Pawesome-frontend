import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../../ui/CartContext.tsx';
import { useNavigate } from 'react-router-dom';

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

const GiftCustomizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState<{ [key: number]: string[] }>({});
  const [isStepCompleted, setIsStepCompleted] = useState<{ [key: number]: boolean }>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addItem } = useCart();
  const navigate = useNavigate();

  const steps: Step[] = [
    {
      id: 1,
      title: "Choose a Theme Card",
      shortTitle: "Theme Card",
      minSelection: 1,
      maxSelection: 1,
      products: [
        { id: "theme1", name: "Birthday Celebration", price: 150, image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop", description: "Perfect for birthday celebrations", category: "theme" },
        { id: "theme2", name: "Get Well Soon", price: 150, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop", description: "Caring wishes for recovery", category: "theme" },
        { id: "theme3", name: "Welcome Home", price: 150, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop", description: "Perfect for new pet parents", category: "theme" },
        { id: "theme4", name: "Just Because", price: 150, image: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=300&h=300&fit=crop", description: "Show your love anytime", category: "theme" },
        { id: "theme5", name: "Holiday Special", price: 200, image: "https://images.unsplash.com/photo-1576859758361-c8d3b35ce432?w=300&h=300&fit=crop", description: "Festive celebrations", category: "theme" },
        { id: "theme6", name: "Congratulations", price: 150, image: "https://images.unsplash.com/photo-1531986362435-16b427eb9c26?w=300&h=300&fit=crop", description: "Celebrate achievements", category: "theme" },
      ]
    },
    {
      id: 2,
      title: "Select Your Main Theme Pet Toy",
      shortTitle: "Main Toy",
      minSelection: 1,
      maxSelection: 1,
      products: [
        { id: "toy1", name: "Squeaky Bone", price: 899, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop", description: "Classic squeaky bone toy", category: "toy" },
        { id: "toy2", name: "Tennis Ball Set", price: 599, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop", description: "Set of 3 tennis balls", category: "toy" },
        { id: "toy3", name: "Rope Toy", price: 749, image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=300&h=300&fit=crop", description: "Durable rope for tug of war", category: "toy" },
        { id: "toy4", name: "Plush Teddy", price: 1299, image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=300&h=300&fit=crop", description: "Soft and cuddly plush toy", category: "toy" },
        { id: "toy5", name: "Interactive Puzzle", price: 1599, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop", description: "Mental stimulation puzzle", category: "toy" },
        { id: "toy6", name: "Flying Disc", price: 699, image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop", description: "Perfect for outdoor play", category: "toy" },
      ]
    },
    {
      id: 3,
      title: "Select Your Complementary Pet Toys",
      shortTitle: "Extra Toys",
      minSelection: 1,
      maxSelection: 3,
      products: [
        { id: "ctoy1", name: "Mini Squeaky Mouse", price: 299, image: "https://images.unsplash.com/photo-1585559700398-b4cb4f65a611?w=300&h=300&fit=crop", description: "Small squeaky mouse toy", category: "toy" },
        { id: "ctoy2", name: "Feather Wand", price: 399, image: "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=300&h=300&fit=crop", description: "Interactive feather toy", category: "toy" },
        { id: "ctoy3", name: "Catnip Ball", price: 249, image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300&h=300&fit=crop", description: "Catnip-infused ball", category: "toy" },
        { id: "ctoy4", name: "Chew Ring", price: 349, image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop", description: "Durable chew ring", category: "toy" },
        { id: "ctoy5", name: "Laser Pointer", price: 599, image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=300&h=300&fit=crop", description: "Interactive laser toy", category: "toy" },
        { id: "ctoy6", name: "Treat Dispenser", price: 799, image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&h=300&fit=crop", description: "Puzzle treat dispenser", category: "toy" },
      ]
    },
    {
      id: 4,
      title: "Select Your Pet Treats",
      shortTitle: "Treats",
      minSelection: 1,
      maxSelection: 3,
      products: [
        { id: "treat1", name: "Chicken Jerky", price: 599, image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=300&h=300&fit=crop", description: "Premium chicken jerky treats", category: "treat" },
        { id: "treat2", name: "Dental Chews", price: 449, image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=300&h=300&fit=crop", description: "Healthy dental chews", category: "treat" },
        { id: "treat3", name: "Salmon Bites", price: 699, image: "https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=300&h=300&fit=crop", description: "Delicious salmon treats", category: "treat" },
        { id: "treat4", name: "Veggie Crunch", price: 399, image: "https://images.unsplash.com/photo-1585581190777-41d75e2ba755?w=300&h=300&fit=crop", description: "Healthy vegetable treats", category: "treat" },
        { id: "treat5", name: "Training Treats", price: 349, image: "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=300&h=300&fit=crop", description: "Small training rewards", category: "treat" },
        { id: "treat6", name: "Freeze-Dried Liver", price: 799, image: "https://images.unsplash.com/photo-1564486123817-39cef6e9e3a1?w=300&h=300&fit=crop", description: "Pure freeze-dried liver", category: "treat" },
      ]
    },
    {
      id: 5,
      title: "Select Pet Care Products",
      shortTitle: "Care Products",
      minSelection: 1,
      maxSelection: 2,
      products: [
        { id: "care1", name: "Gentle Shampoo", price: 899, image: "https://images.unsplash.com/photo-1556909114-8e3e17e6b19d?w=300&h=300&fit=crop", description: "Mild and gentle pet shampoo", category: "care" },
        { id: "care2", name: "Nail Clippers", price: 649, image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop", description: "Professional nail clippers", category: "care" },
        { id: "care3", name: "Ear Cleaner", price: 549, image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300&h=300&fit=crop", description: "Gentle ear cleaning solution", category: "care" },
        { id: "care4", name: "Toothbrush Set", price: 399, image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=300&h=300&fit=crop", description: "Pet dental care kit", category: "care" },
        { id: "care5", name: "Flea & Tick Spray", price: 799, image: "https://images.unsplash.com/photo-1615647285132-0855e8a0de31?w=300&h=300&fit=crop", description: "Natural flea protection", category: "care" },
        { id: "care6", name: "Paw Balm", price: 449, image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=300&h=300&fit=crop", description: "Moisturizing paw balm", category: "care" },
      ]
    },
    {
      id: 6,
      title: "Select Pet Accessories & Clothings",
      shortTitle: "Accessories",
      minSelection: 1,
      maxSelection: 2,
      products: [
        { id: "acc1", name: "Stylish Collar", price: 899, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop", description: "Designer collar with charm", category: "accessory" },
        { id: "acc2", name: "Cozy Sweater", price: 1299, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop", description: "Warm winter sweater", category: "clothing" },
        { id: "acc3", name: "Leash Set", price: 749, image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=300&h=300&fit=crop", description: "Matching leash and collar", category: "accessory" },
        { id: "acc4", name: "Bow Tie", price: 499, image: "https://images.unsplash.com/photo-1517519014922-8fc06b814a0e?w=300&h=300&fit=crop", description: "Formal bow tie accessory", category: "accessory" },
        { id: "acc5", name: "Rain Coat", price: 1599, image: "https://images.unsplash.com/photo-1587734195503-904fca47e0d9?w=300&h=300&fit=crop", description: "Waterproof rain protection", category: "clothing" },
        { id: "acc6", name: "ID Tag", price: 299, image: "https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=300&h=300&fit=crop", description: "Personalized ID tag", category: "accessory" },
      ]
    },
    {
      id: 7,
      title: "Add A Greeting Card",
      shortTitle: "Greeting Card",
      minSelection: 1,
      maxSelection: 1,
      products: [
        { id: "card1", name: "Happy Birthday", price: 199, image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop", description: "Colorful birthday card", category: "card" },
        { id: "card2", name: "Get Well Soon", price: 199, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop", description: "Caring get well message", category: "card" },
        { id: "card3", name: "Welcome Home", price: 199, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop", description: "Welcome new family member", category: "card" },
        { id: "card4", name: "Thank You", price: 199, image: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=300&h=300&fit=crop", description: "Express gratitude", category: "card" },
        { id: "card5", name: "Just Because", price: 199, image: "https://images.unsplash.com/photo-1576859758361-c8d3b35ce432?w=300&h=300&fit=crop", description: "Show you care", category: "card" },
        { id: "card6", name: "Custom Message", price: 299, image: "https://images.unsplash.com/photo-1531986362435-16b427eb9c26?w=300&h=300&fit=crop", description: "Write your own message", category: "card" },
      ]
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
    setIsAddingToCart(true);
    try {
      const giftBoxId = Date.now();
      addItem({
        id: giftBoxId,
        name: `Custom Pet Gift Box (${Object.values(selections).flat().length} items)`,
        price: getTotalPrice(),
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop"
      });
      setTimeout(() => { setIsAddingToCart(false); navigate('/cart'); }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
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
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-orange text-center mb-12"
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
                  step.id === currentStep ? 'bg-charcoal-gray text-white shadow-lg' : 
                  isStepCompleted[step.id] ? 'bg-green-500 text-white shadow-md' :
                  step.id === 1 || isStepCompleted[step.id - 1] ? 'bg-energetic-orange text-white hover:bg-warm-orange shadow-md' :
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
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal-gray mb-4">
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
                      isSelected ? 'ring-4 ring-energetic-orange bg-gradient-to-br from-energetic-orange/5 to-warm-orange/5' : 'hover:shadow-xl hover:scale-105'
                    }`} 
                    onClick={() => handleProductSelect(currentStep, product.id)} 
                    whileHover={{ y: -5 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="absolute -top-2 -right-2 bg-energetic-orange text-white rounded-full p-2 shadow-lg z-10"
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
                      <h3 className="text-xl font-bold text-charcoal-gray mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      <div className="text-2xl font-bold text-energetic-orange">Rs.{product.price}</div>
                    </div>
                    
                    <div className="text-center">
                      <button className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                        isSelected ? 'bg-energetic-orange text-white' : 'bg-gray-100 text-charcoal-gray hover:bg-energetic-orange hover:text-white'
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
                  currentStep === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-charcoal-gray hover:bg-gray-200'
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
                    canProceedToNext() ? 'bg-gradient-to-r from-energetic-orange to-warm-orange text-white hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
        <h3 className="text-xl font-bold text-charcoal-gray mb-4">Your Custom Box</h3>
        
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
                      <span className="font-semibold text-energetic-orange">Rs.{product.price}</span>
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
              <span className="text-energetic-orange">Rs.{getTotalPrice()}</span>
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
            <h3 className="text-2xl font-bold text-charcoal-gray mb-2">Gift Box Created!</h3>
            <p className="text-gray-600 mb-4">Your custom pet gift box is being added to cart...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-energetic-orange mx-auto"></div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GiftCustomizer;