import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag, Star, Heart } from 'lucide-react';
import { Deal, DealsPageData } from '../../types/deals';

const DealDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

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
            image: '/api/placeholder/200/300',
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
            image: '/api/placeholder/200/300',
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
            image: '/api/placeholder/200/300',
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
      }
    ]
  };

  // Find the deal by slug
  const deal = React.useMemo(() => {
    for (const section of mockDealsData.sections) {
      const foundDeal = section.deals.find(d => d.slug === slug);
      if (foundDeal) return foundDeal;
    }
    return null;
  }, [slug]);

  if (!deal) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal-gray mb-4">Deal Not Found</h1>
          <button 
            onClick={() => navigate('/deals')}
            className="bg-energetic-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  const handleBackClick = () => {
    navigate('/deals');
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-charcoal-gray hover:text-energetic-orange transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Deals
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Deal Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative bg-gradient-to-r from-energetic-orange to-calm-blue rounded-2xl overflow-hidden h-96"
            >
              <img 
                src={deal.image || '/api/placeholder/400/400'} 
                alt={deal.title}
                className="absolute right-0 top-0 h-full w-1/2 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-energetic-orange via-energetic-orange/90 to-transparent"></div>
              <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                <h1 className="text-white font-bold text-3xl leading-tight mb-4">
                  {deal.title}
                </h1>
                <p className="text-white text-lg opacity-90">
                  {deal.subtitle}
                </p>
              </div>
            </motion.div>

            {/* Deal Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-6"
            >
              {/* Offer Badge */}
              <div className="inline-flex items-center bg-energetic-orange/10 text-energetic-orange px-4 py-2 rounded-full">
                <Tag className="w-4 h-4 mr-2" />
                {deal.offerType === 'buy-get-free' && 'Buy 2, Get 1 Free on All Flavors'}
                {deal.offerType === 'free-shipping' && 'Free Shipping on Every Subscription Plan'}
                {deal.offerType === 'referral' && 'Refer a Friend & Both Get Rs. 250 Off'}
                {deal.offerType === 'upgrade' && 'Upgrade to Premium'}
                {deal.offerType === 'discount' && `${deal.discount}% Off All Items`}
                {deal.offerType === 'bundle' && 'Special Bundle Deal'}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-charcoal-gray mb-4">About This Deal</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {deal.description}
                </p>
              </div>

              {/* Deal Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-charcoal-gray mb-4">Deal Details</h3>
                <div className="space-y-3">
                  {deal.validUntil && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3 text-energetic-orange" />
                      Valid until {deal.validUntil.toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Star className="w-5 h-5 mr-3 text-energetic-orange" />
                    Premium quality products included
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Heart className="w-5 h-5 mr-3 text-energetic-orange" />
                    Perfect for all dog breeds and sizes
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-energetic-orange text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                  Claim This Deal
                </button>
                <button className="flex-1 border-2 border-energetic-orange text-energetic-orange px-8 py-4 rounded-lg font-semibold hover:bg-energetic-orange hover:text-white transition-colors">
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>

          {/* Related Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-charcoal-gray mb-6">Products Included in This Deal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mock related products */}
              {[1, 2, 3].map((product) => (
                <div key={product} className="border border-light-gray rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="bg-gray-100 rounded-lg h-32 mb-4"></div>
                  <h4 className="font-semibold text-charcoal-gray mb-2">Premium Dog Food {product}</h4>
                  <p className="text-gray-600 text-sm mb-3">High-quality nutrition for your furry friend</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-energetic-orange">₹999</span>
                    <button className="bg-energetic-orange text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DealDetail;