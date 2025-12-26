import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Percent } from 'lucide-react';
import { Deal, DealCardProps } from '../../../types/deals';
import ReccomendationsGrid from '../Subscriptions/ReccomendationsGrid';
import SlideshowBanner from '../../banners/subscriptionbanner/SlideshowBanner';
import WhyPawsomeSection from '../../banners/whypawsome/WhyPawsomeSection';
import CategoryCarousel from '../../carousels/CategoryCarousel';
import TopBrandsCarousel from '../../carousels/brandCarousel/TopBrandsCarousel';
import { api } from '../../../services/api';

/* ------------------------------
   DealCard Component
-------------------------------- */
const DealCard: React.FC<DealCardProps> = ({ deal, onClick, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(deal)}
      className={`relative bg-sunny-yellow rounded-2xl overflow-hidden h-64 cursor-pointer group ${className}`}
    >
      <div className="absolute right-0 top-0 h-full w-1/2 z-20">
        <img
          src={deal.image || '/api/placeholder/200/300'}
          alt={deal.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-sunny-yellow via-sunny-yellow to-sunny-yellow/60" />

      <div className="relative z-20 h-full w-1/2 p-4 flex flex-col">
        {/* <div className="mb-3">
          <div className="bg-black/10 text-black text-xs px-3 py-1 rounded-full font-fredoka inline-block">
            {deal.discountType === 'percentage'
              ? `${deal.discount}% Off`
              : `${deal.discount} Off`}
          </div>
        </div> */}

        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-black font-fredoka font-bold text-lg mb-2">
            {deal.title}
          </h3>
          <p className="text-black text-sm opacity-90 font-fredoka mb-3">
            {deal.subtitle}
          </p>
        </div>

        <button className="bg-primary-blue text-white px-4 py-2 rounded-full text-sm font-fredoka">
          See More
        </button>
      </div>
    </motion.div>
  );
};

/* ------------------------------
   DealSection Component
-------------------------------- */
const DealSection = ({
  title,
  deals,
  onDealClick,
}: {
  title: string;
  deals: any[];
  onDealClick: (deal: Deal) => void;
}) => {
  if (!deals.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-charcoal">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <DealCard
              deal={{
                id: deal.id,
                title: deal.title,
                subtitle: deal.display_description || deal.description,
                offerType:
                  deal.deal_type === 'bogo' ? 'buy-get-free' : 'discount',
                discount: Number(deal.discount_value),
                image: deal.image,
                slug: deal.slug,
              } as Deal}
              onClick={onDealClick}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

/* ------------------------------
   Deals Page
-------------------------------- */
const Deals: React.FC = () => {
  const navigate = useNavigate();

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
        const response = await api.get('/deals/active');
        setDeals((response.data as any).data || []);
      } catch (err) {
        setError('Failed to load deals');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleDealClick = (deal: Deal) => {
    navigate(`/deals/${deal.slug}`);
  };

  if (loading) return <div className="text-center py-20">Loading deals...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  const productDeals = deals.filter(d => d.deal_type === 'product');
  const brandDeals = deals.filter(d => d.deal_type === 'brand');
  const categoryDeals = deals.filter(d => d.deal_type === 'category');
  const bogoDeals = deals.filter(d => d.deal_type === 'bogo');

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center mb-6">
            <Percent className="text-vibrant-orange mr-3 h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-fredoka font-bold text-charcoal">
              Pawsome Deals
            </h1>
          </div>
          <p className="text-xl text-medium-gray font-fredoka">
            Incredible discounts and offers on premium pet products
          </p>
        </motion.div>
        <SlideshowBanner slides={subscriptionSlides} autoPlay interval={6000} />

        <WhyPawsomeSection />

        <div className="space-y-16">
          <DealSection title="🐶 Active Product Deals" deals={productDeals} onDealClick={handleDealClick} />
          <DealSection title="🏷️ Active Brand Deals" deals={brandDeals} onDealClick={handleDealClick} />
          <DealSection title="📦 Active Category Deals" deals={categoryDeals} onDealClick={handleDealClick} />
          <DealSection title="🎁 Buy One Get One Deals" deals={bogoDeals} onDealClick={handleDealClick} />
        </div>

        <CategoryCarousel />
        <ReccomendationsGrid />
        <TopBrandsCarousel />
      </div>
    </div>
  );
};

export default Deals;
