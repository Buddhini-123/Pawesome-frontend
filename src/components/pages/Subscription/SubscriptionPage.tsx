import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars } from '@react-three/drei';
import { gsap } from 'gsap';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import SlideshowBanner from '../../common/SlideshowBanner';

// Types for subscription plans
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  savings?: string;
  features: string[];
  popular?: boolean;
  color: string;
  icon: string;
}

// 3D Pet Food Bowl Component
const PetFoodBowl: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <cylinderGeometry args={[0.8, 1, 0.4, 16]} />
        <meshPhysicalMaterial 
          color="#FF6B35" 
          metalness={0.3} 
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
};

// 3D Pet Toy Component
const PetToy: React.FC<{ position: [number, number, number], color: string }> = ({ position, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 1.2) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.7}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.3, 12, 8]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
};

// 3D Background Scene
const Background3D: React.FC = () => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#FF6B35" intensity={0.5} />
      
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade />
      
      <PetFoodBowl position={[-3, 2, -2]} />
      <PetFoodBowl position={[3, -1, -3]} />
      <PetToy position={[-2, -2, -1]} color="#4ECDC4" />
      <PetToy position={[2, 1, -2]} color="#FFE66D" />
      <PetToy position={[0, 3, -4]} color="#FF6B6B" />
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};

// Subscription Plan Card Component
const PlanCard: React.FC<{ plan: SubscriptionPlan; onSelect: (plan: SubscriptionPlan) => void; isSelected: boolean }> = ({ 
  plan, 
  onSelect, 
  isSelected 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-lg ${
        plan.popular 
          ? 'bg-gradient-to-br from-orange-400/20 via-amber-300/20 to-yellow-400/20 border-2 border-orange-400/50' 
          : 'bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20'
      } ${isSelected ? 'ring-4 ring-blue-400/50 transform scale-105' : ''}`}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(plan)}
      style={{
        background: `linear-gradient(135deg, ${plan.color}20, ${plan.color}10, transparent)`
      }}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-orange-400 to-amber-400 text-white px-6 py-2 rounded-full text-sm font-bold">
            🔥 Most Popular
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{plan.icon}</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
          <span className="text-gray-600 ml-2">/{plan.duration}</span>
        </div>
        {plan.savings && (
          <div className="text-green-600 font-semibold mt-2">{plan.savings}</div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-700">{feature}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
          plan.popular
            ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg shadow-orange-400/50'
            : 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg shadow-blue-400/50'
        } ${isSelected ? 'ring-4 ring-white/50' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSelected ? 'Selected ✓' : 'Choose Plan'}
      </motion.button>
    </motion.div>
  );
};

// FAQ Component
const FAQItem: React.FC<{ question: string; answer: string; isOpen: boolean; onToggle: () => void }> = ({
  question,
  answer,
  isOpen,
  onToggle
}) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left flex justify-between items-center focus:outline-none"
      >
        <h3 className="text-lg font-semibold text-gray-800">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-gray-700 mt-4 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Subscription Page Component
const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Care',
      price: 999,
      duration: 'month',
      features: [
        'Monthly health checkup',
        'Basic grooming service',
        'Vaccination reminders',
        '24/7 emergency helpline',
        'Pet care tips & guides'
      ],
      color: '#4ECDC4',
      icon: '🐕'
    },
    {
      id: 'premium',
      name: 'Premium Care',
      price: 1899,
      duration: 'month',
      savings: 'Save ₹300/month',
      popular: true,
      features: [
        'Bi-weekly health checkups',
        'Premium grooming & spa',
        'All vaccinations included',
        'Priority emergency response',
        'Nutrition consultation',
        'Pet training sessions',
        'Free home visits'
      ],
      color: '#FF6B35',
      icon: '🦮'
    },
    {
      id: 'ultimate',
      name: 'Ultimate Care',
      price: 2799,
      duration: 'month',
      savings: 'Save ₹500/month',
      features: [
        'Weekly health monitoring',
        'Luxury grooming & styling',
        'Complete medical coverage',
        'Instant emergency response',
        'Personal pet nutritionist',
        'Advanced training programs',
        'Daily exercise sessions',
        'Pet insurance included'
      ],
      color: '#8B5CF6',
      icon: '👑'
    }
  ];

  const faqs = [
    {
      question: "What's included in the subscription?",
      answer: "Each subscription includes regular health checkups, grooming services, vaccination tracking, emergency support, and access to our expert veterinary team. Higher tiers include additional services like nutrition consultation and training."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your subscription will remain active until the end of your current billing period."
    },
    {
      question: "Do you provide services for all types of pets?",
      answer: "We provide comprehensive care for dogs, cats, birds, and small mammals. Our veterinary team is trained to handle various pet species and their specific needs."
    },
    {
      question: "What areas do you cover for home visits?",
      answer: "We currently provide home visits within a 50km radius of major cities. Contact us to check if your area is covered, as we're constantly expanding our service areas."
    },
    {
      question: "Is there a trial period available?",
      answer: "Yes! We offer a 7-day free trial for new subscribers. You can experience our services risk-free and decide if our care plan is right for your pet."
    }
  ];

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.children,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
    }
  }, []);

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(selectedPlan?.id === plan.id ? null : plan);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <Background3D />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/80 via-amber-50/60 to-orange-100/80 backdrop-blur-[2px]"></div>
      
      <Header />
      
      {/* Slideshow Banner */}
      <section className="relative pt-20 pb-8">
        <div className="max-w-7xl mx-auto">
          <SlideshowBanner />
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center" ref={heroRef}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-6">
              Premium Pet Care
              <br />
              <span className="text-5xl md:text-6xl">Subscriptions</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Give your furry friends the care they deserve with our comprehensive subscription plans. 
            From regular health checkups to emergency support, we've got your pet covered! 🐾
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/30">
              <span className="text-gray-700 font-semibold">🏥 Expert Veterinary Care</span>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/30">
              <span className="text-gray-700 font-semibold">🏠 Home Visits Available</span>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/30">
              <span className="text-gray-700 font-semibold">📱 24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the subscription that best fits your pet's needs and your budget
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <PlanCard
                  plan={plan}
                  onSelect={handlePlanSelect}
                  isSelected={selectedPlan?.id === plan.id}
                />
              </motion.div>
            ))}
          </div>

          {selectedPlan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-green-400/20 to-blue-400/20 backdrop-blur-lg rounded-3xl p-8 border border-white/30 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to get started with {selectedPlan.name}?
                </h3>
                <p className="text-gray-600 mb-6">
                  Your pet will receive the best care with our {selectedPlan.name} subscription plan.
                </p>
                <motion.button
                  className="bg-gradient-to-r from-orange-400 to-amber-400 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-400/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe Now - ₹{selectedPlan.price}/{selectedPlan.duration}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Got questions? We've got answers!
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubscriptionPage;