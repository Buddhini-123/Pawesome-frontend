import React, { useState , useEffect} from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Percent } from 'lucide-react';
import { Deal, DealsPageData, DealCardProps } from '../../../types/deals';
import ReccomendationsGrid from '../Subscriptions/ReccomendationsGrid';
import SlideshowBanner from '../../banners/subscriptionbanner/SlideshowBanner';
import WhyPawsomeSection from '../../banners/whypawsome/WhyPawsomeSection';
import CategoryCarousel from '../../carousels/CategoryCarousel';
import TopBrandsCarousel from '../../carousels/brandCarousel/TopBrandsCarousel';
import {api} from "../../../services/api"

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
      className={`relative bg-sunny-yellow rounded-2xl overflow-hidden h-64 cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      {/* Dog Image - Keep original positioning */}
      <div className="absolute right-0 top-0 h-full w-1/2 z-20">
        <img
          src={deal.image || '/api/placeholder/200/300'}
          alt={deal.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-sunny-yellow via-sunny-yellow to-sunny-yellow/60"></div>

      {/* Content - Left Side Only */}
      <div className="relative z-20 h-full w-1/2 p-4 flex flex-col">
        {/* Top Row - Offer Badge */}
        <div className="mb-3">
          {deal.offerType && (
            <div className="bg-black/10 backdrop-blur-sm text-black text-xs px-3 py-1 rounded-full font-fredoka font-medium inline-block">
              {deal.offerType === 'buy-get-free' && 'Buy 2, Get 1 Free'}
              {deal.offerType === 'free-shipping' && 'Free Shipping'}
              {deal.offerType === 'referral' && 'Refer & Save'}
              {deal.offerType === 'upgrade' && 'Upgrade Deal'}
              {deal.offerType === 'discount' && `${deal.discount}% Off`}
              {deal.offerType === 'bundle' && 'Bundle Deal'}
              {deal.offerType === 'flash-sale' && 'Flash Sale'}
              {deal.offerType === 'bulk-discount' && 'Bulk Discount'}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Deal Title */}
          <h3 className="text-black font-fredoka font-bold text-lg leading-tight mb-2">
            {deal.title}
          </h3>
          
          {/* Deal Subtitle */}
          <p className="text-black text-sm opacity-90 font-fredoka mb-3 leading-relaxed">
            {deal.subtitle}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex text-black text-xs mr-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 fill-current mr-0.5" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-black text-xs font-fredoka opacity-80">(5.0)</span>
          </div>
        </div>

        {/* Bottom Row - Action Button */}
        <div>
          <button className="bg-primary-blue text-white px-4 py-2 rounded-full text-sm font-fredoka font-medium hover:bg-primary-blue/90 transition-colors group-hover:scale-105 transform duration-200">
            See More
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40"></div>
    </motion.div>
  );
};

const Deals: React.FC = () => {

  const subscriptionSlides = [
    {
      image:
        'https://cdn.create.vista.com/downloads/8182b741-5b10-465f-8a06-5dd2f17e23aa_1024.jpeg',
      title: 'Banner 1',
      subtitle: 'Up to 50% off on all subscriptions',
      cta: 'Subscribe Now',
      onClick: () => console.log('Slide 1 CTA clicked'),
    },
    {
      image: 'https://petpoints.co.uk/assets/purepet.jpg',
      title: 'Banner 2',
      subtitle: 'Up to 50% off on all subscriptions',
      cta: 'Subscribe Now',
      onClick: () => console.log('Slide 2 CTA clicked'),
    },
    {
      image:
        'https://cdnpublic.budgetpetproducts.com.au/contents/2025/05/21/24044014-2d7d-4f5a-938c-ed2fb11588a3.jpg',
      title: 'Banner 3',
      subtitle: 'Up to 50% off on all subscriptions',
      cta: 'Subscribe Now',
      onClick: () => console.log('Slide 3 CTA clicked'),
    },
    // ...other slides
  ]

  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await api.get("/deals"); // replace with your actual {{host}}
        setDeals((response.data as any).data || []); // backend returns "data": [...]
      } catch (err) {
        console.error("Error fetching deals:", err);
        setError("Failed to load deals");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);


  const navigate = useNavigate();

  const handleDealClick = (deal: Deal) => {
    navigate(`/deals/${deal.slug}`);
  };

  // Use imported mock data
  if (loading) {
    return <div className="text-center py-20">Loading deals...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

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
            <Percent className="text-vibrant-orange mr-3 h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-fredoka font-bold text-charcoal">Pawsome Deals</h1>
          </div>
          <p className="text-xl text-medium-gray max-w-2xl mx-auto font-fredoka">
            Incredible discounts and offers on premium pet products. Limited time only!
          </p>
        </motion.div>

        <SlideshowBanner slides={subscriptionSlides} autoPlay interval={6000} />
        
        <WhyPawsomeSection />
        {/* <ReccomendationsGrid /> */}

        {/* Deal Sections */}
        <div className="space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-charcoal mb-2">
                Active Deals
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.4
                  }}
                >
                  <DealCard
                    deal={{
                      id: deal.id,
                      title: deal.title,
                      subtitle: deal.display_description || deal.description,
                      offerType: "discount",
                      discount: Number(deal.discount_value),
                      image: deal.image,
                      slug: deal.slug
                    } as Deal}
                    onClick={handleDealClick}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        <CategoryCarousel />

        <ReccomendationsGrid />

        <TopBrandsCarousel />
      </div>
    </div>
  );
};

export default Deals;