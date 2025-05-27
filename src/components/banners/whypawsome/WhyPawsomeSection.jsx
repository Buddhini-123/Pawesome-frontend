import React from 'react';
import { ShoppingCart, Star, HeadphonesIcon, ChevronRight } from 'lucide-react';

/**
 * WhyPawsomeSection.jsx
 * "Why Pawsome?" feature highlights component
 */
const features = [
  {
    icon: <ShoppingCart className="w-6 h-6 text-green-600" />,  
    title: '10% off your first subscription order',
    description: 'Save 5% with regular deliveries',
  },
  {
    icon: <Star className="w-6 h-6 text-yellow-600" />,  
    title: 'Earn points and redeem rewards',
    description: 'Start now',
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6 text-blue-600" />,  
    title: 'Expert advice for your pet',
    description: 'Everything in our Magazine',
  },
];

const WhyPawsomeSection = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      {/* Section Title with lines */}
      <div className="flex items-center justify-center mb-10">
        <hr className="flex-grow border-t-2 border-orange-500" />
        <h2 className="mx-4 text-2xl md:text-3xl font-semibold text-gray-800">
          Why Pawsome ?
        </h2>
        <hr className="flex-grow border-t-2 border-orange-500" />
      </div>
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="p-4 bg-gray-100 rounded-full">
              {f.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {f.title}
              </h3>
              <button className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium">
                <span>{f.description}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyPawsomeSection;