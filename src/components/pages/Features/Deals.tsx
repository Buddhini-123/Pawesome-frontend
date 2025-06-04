import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Percent } from 'lucide-react';
import { Deal, DealsPageData, DealCardProps } from '../../../types/deals';

// Inline DealCard component to avoid import issues
const DealCard: React.FC<DealCardProps> = ({ deal, onClick, className = '' }) => {
  const handleClick = () => {
    onClick(deal);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-gradient-to-r from-energetic-orange to-calm-blue rounded-2xl overflow-hidden h-64 cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      {/* Paw Icon */}
      {/* <div className="absolute top-4 left-4 z-20">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path 
            d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM7 7C8.1 7 9 7.9 9 9C9 10.1 8.1 11 7 11C5.9 11 5 10.1 5 9C5 7.9 5.9 7 7 7ZM17 7C18.1 7 19 7.9 19 9C19 10.1 18.1 11 17 11C15.9 11 15 10.1 15 9C15 7.9 15.9 7 17 7ZM9.5 12C10.6 12 11.5 12.9 11.5 14C11.5 15.1 10.6 16 9.5 16C8.4 16 7.5 15.1 7.5 14C7.5 12.9 8.4 12 9.5 12ZM14.5 12C15.6 12 16.5 12.9 16.5 14C16.5 15.1 15.6 16 14.5 16C13.4 16 12.5 15.1 12.5 14C12.5 12.9 13.4 12 14.5 12Z" 
            fill="currentColor"
          />
        </svg>
      </div> */}

      {/* Rating Stars - Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center">
        <div className="flex text-white text-xs">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Dog Image */}
      <div className="absolute right-0 top-0 h-full w-1/2 z-10">
        <img
          src={deal.image || '/api/placeholder/200/300'}
          alt="Dog"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-energetic-orange via-energetic-orange/90 to-transparent z-5"></div>

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div className="max-w-[60%]">
          <h3 className="text-white font-bold text-lg leading-tight mb-2">{deal.title}</h3>
          <p className="text-white text-sm opacity-90 mb-3">{deal.subtitle}</p>
        </div>

        <div className="max-w-[60%]">
          <button className="bg-calm-blue text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors group-hover:scale-105 transform duration-200">
            See More
          </button>
        </div>
      </div>

      {/* Offer Badge */}
      {deal.offerType && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
            {deal.offerType === 'buy-get-free' && 'Buy 2, Get 1 Free'}
            {deal.offerType === 'free-shipping' && 'Free Shipping'}
            {deal.offerType === 'referral' && 'Refer & Save'}
            {deal.offerType === 'upgrade' && 'Upgrade Deal'}
            {deal.offerType === 'discount' && `${deal.discount}% Off`}
            {deal.offerType === 'bundle' && 'Bundle Deal'}
          </div>
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-15"></div>
    </motion.div>
  );
};

const Deals: React.FC = () => {
  const navigate = useNavigate();

  const handleDealClick = (deal: Deal) => {
    navigate(`/deals/${deal.slug}`);
  };

  // Mock data embedded directly to avoid import issues
  const mockDealsData: DealsPageData = {
    sections: [
      {
        id: 'weekly-deals',
        title: 'Bark-Worthy Deals This Week Only!',
        subtitle: 'Limited time offers on premium pet products',
        deals: [
          {
            id: 'buy-2-get-1-free',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'Stock up on your pup\'s favorites and get more for less – limited time only.',
            offerType: 'buy-get-free',
            image: 'https://png.pngtree.com/template/20220331/ourlarge/pngtree-small-fresh-pet-food-dog-food-poster-design-image_910832.jpg',
            isActive: true,
            validUntil: new Date('2025-06-15'),
            slug: 'buy-2-get-1-free-all-flavors',
            category: ['dog-food', 'premium'],
            products: ['premium-dog-food-1', 'premium-dog-food-2']
          },
          {
            id: 'free-shipping',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'Premium nutrition without the premium price tag – your wallet (and dog) will thank you.',
            offerType: 'free-shipping',
            image: 'https://therichpost.com/wp-content/uploads/2023/09/Pet-Food-Shop-Ecommerce-Template-in-Angular-16-1024x491.png',
            isActive: true,
            slug: 'free-shipping-subscription',
            category: ['subscription', 'shipping'],
            products: ['subscription-plan-1', 'subscription-plan-2']
          },
          {
            id: 'referral-deal',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'New to Pawsome? Let your furry friend try their new favorite meal.',
            offerType: 'referral',
            discount: 250,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShL8quw8VUzLkLs7xgVfU2yt4ZG4TfP6wLkw&s',
            isActive: true,
            slug: 'refer-friend-discount',
            category: ['referral', 'new-customer'],
            products: ['starter-pack-1', 'trial-pack-1']
          },
          {
            id: 'premium-upgrade',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'Wholesome meals made to fit on your budget.',
            offerType: 'upgrade',
            image: '/api/placeholder/200/300',
            isActive: true,
            slug: 'upgrade-to-premium',
            category: ['premium', 'upgrade'],
            products: ['premium-plan-1', 'premium-plan-2']
          }
        ]
      },
      {
        id: 'stock-up-save',
        title: 'Stock Up & Save on Pawsome Dog Food!',
        subtitle: 'Bulk buying benefits for smart pet parents',
        deals: [
          {
            id: 'bulk-discount-1',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'Stock up on your pup\'s favorites and get more for less – limited time only.',
            offerType: 'buy-get-free',
            image: '/api/placeholder/200/300',
            isActive: true,
            slug: 'bulk-buy-2-get-1',
            category: ['bulk', 'dog-food'],
            products: ['bulk-pack-1', 'bulk-pack-2']
          },
          {
            id: 'subscription-save',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'Premium nutrition without the premium price tag – your wallet (and dog) will thank you.',
            offerType: 'free-shipping',
            image: '/api/placeholder/200/300',
            isActive: true,
            slug: 'subscription-bulk-shipping',
            category: ['subscription', 'bulk'],
            products: ['bulk-subscription-1']
          },
          {
            id: 'family-pack',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'New to Pawsome? Let your furry friend try their new favorite meal.',
            offerType: 'bundle',
            discount: 30,
            image: '/api/placeholder/200/300',
            isActive: true,
            slug: 'family-pack-discount',
            category: ['family', 'bundle'],
            products: ['family-pack-1', 'family-pack-2']
          },
          {
            id: 'monthly-stock',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'Wholesome meals made to fit on your budget.',
            offerType: 'discount',
            discount: 25,
            image: '/api/placeholder/200/300',
            isActive: true,
            slug: 'monthly-stock-discount',
            category: ['monthly', 'stock'],
            products: ['monthly-supply-1']
          }
        ]
      },
      {
        id: 'loyalty-rewards',
        title: 'Loyal Pup? Earn Rewards Every Time You Buy!',
        subtitle: 'Join our loyalty program and save on every purchase',
        deals: [
          {
            id: 'loyalty-starter',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'Stock up on your pup\'s favorites and get more for less – limited time only.',
            offerType: 'buy-get-free',
            image: '/api/placeholder/200/300',
            isActive: true,
            slug: 'loyalty-starter-bonus',
            category: ['loyalty', 'starter'],
            products: ['loyalty-pack-1']
          },
          {
            id: 'points-shipping',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'Premium nutrition without the premium price tag – your wallet (and dog) will thank you.',
            offerType: 'free-shipping',
            image: '/api/placeholder/200/300',
            isActive: true,
            slug: 'loyalty-free-shipping',
            category: ['loyalty', 'shipping'],
            products: ['loyalty-subscription-1']
          },
          {
            id: 'double-points',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'New to Pawsome? Let your furry friend try their new favorite meal.',
            offerType: 'referral',
            discount: 500,
            image: '/api/placeholder/200/300',
            isActive: true,
            slug: 'double-points-referral',
            category: ['loyalty', 'points'],
            products: ['points-bonus-1']
          },
          {
            id: 'vip-upgrade',
            title: 'THE BEST FOOD FOR YOUR DOG',
            subtitle: 'Delicious food made with love',
            description: 'Wholesome meals made to fit on your budget.',
            offerType: 'upgrade',
            image: '/api/placeholder/200/300',
            isActive: true,
            slug: 'vip-loyalty-upgrade',
            category: ['loyalty', 'vip'],
            products: ['vip-membership-1']
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center mb-6">
            <Percent className="text-energetic-orange mr-3 h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal-gray">Pawsome Deals</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Incredible discounts and offers on premium pet products. Limited time only!
          </p>
        </motion.div>

        {/* Deal Sections */}
        <div className="space-y-16">
          {mockDealsData.sections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 0.6
              }}
              className="mb-12"
            >
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-charcoal-gray mb-2">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-lg text-gray-600 max-w-2xl">
                    {section.subtitle}
                  </p>
                )}
              </div>

              {/* Deals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {section.deals.map((deal, dealIndex) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: dealIndex * 0.1,
                      duration: 0.4
                    }}
                  >
                    <DealCard
                      deal={deal}
                      onClick={handleDealClick}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-energetic-orange to-calm-blue rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Never Miss a Deal!
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive offers, flash sales, and special promotions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
            />
            <button className="bg-white text-energetic-orange px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Deals;