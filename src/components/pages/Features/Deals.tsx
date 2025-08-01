import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Percent } from 'lucide-react';
import { Deal, DealsPageData, DealCardProps } from '../../../types/deals';
import { enhanceDeal, generateMockDealData } from '../../../utils/dealHelpers';
import { mockDealsData } from '../../mockDeals';
import ReccomendationsGrid from '../Subscriptions/ReccomendationsGrid';
import SlideshowBanner from '../../banners/subscriptionbanner/SlideshowBanner';
import WhyPawsomeSection from '../../banners/whypawsome/WhyPawsomeSection';
import CategoryCarousel from '../../carousels/CategoryCarousel';
import dogImg from '../../carousels/images/dog.png';
import catImg from '../../carousels/images/cat.png';
import birdImg from '../../carousels/images/bird.png';
import rodentImg from '../../carousels/images/rodent.png';
import TopBrandsCarousel from '../../carousels/brandCarousel/TopBrandsCarousel';
import FAQAccordion from '../../FAQ/FaqAccordions/FAQAccordion';
// Inline DealCard component to avoid import issues
const DealCard: React.FC<DealCardProps> = ({ deal, onClick, className = '' }) => {
  const handleClick = () => {
    onClick(deal);
  };

  const [expandedFAQ, setExpandedFAQ] = useState(null)

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

  const faqs = [
    {
      question: 'Want to know who we are?',
      answer: 'Discover our story, mission, and love for pets.',
    },
    {
      question: 'What brands does Pawsome offer?',
      answer:
        'We offer premium brands like Pedigree, Royal Canin, Whiskas, and many more.',
    },
    // ...more FAQ items
  ]

  const petCategories = [
    {
      bgClass: 'bg-sunny-yellow',
      image: dogImg,
      alt: 'Dog',
      route: '/dogs',
    },
    {
      bgClass: 'bg-primary-blue',
      image: catImg,
      alt: 'Cat',
      route: '/cats',
    },
    {
      bgClass: 'bg-sunny-yellow',
      image: birdImg,
      alt: 'Bird',
      route: '/birds',
    },
    {
      bgClass: 'bg-vibrant-orange',
      image: rodentImg,
      alt: 'Small Pet',
      route: '/other-animals',
    },
    // ...more categories
  ]

  const slides = [
    { image: 'https://cdn.create.vista.com/downloads/8182b741-5b10-465f-8a06-5dd2f17e23aa_1024.jpeg' },
    { image: 'https://cdn.create.vista.com/downloads/8182b741-5b10-465f-8a06-5dd2f17e23aa_1024.jpeg' },
    // add more banners as needed
  ]

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

  const [expandedFAQ, setExpandedFAQ] = useState(null)

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

  const faqs = [
    {
      question: 'Want to know who we are?',
      answer: 'Discover our story, mission, and love for pets.',
    },
    {
      question: 'What brands does Pawsome offer?',
      answer:
        'We offer premium brands like Pedigree, Royal Canin, Whiskas, and many more.',
    },
    // ...more FAQ items
  ]

  const petCategories = [
    {
      bgClass: 'bg-sunny-yellow',
      image: dogImg,
      alt: 'Dog',
      route: '/dogs',
    },
    {
      bgClass: 'bg-primary-blue',
      image: catImg,
      alt: 'Cat',
      route: '/cats',
    },
    {
      bgClass: 'bg-sunny-yellow',
      image: birdImg,
      alt: 'Bird',
      route: '/birds',
    },
    {
      bgClass: 'bg-vibrant-orange',
      image: rodentImg,
      alt: 'Small Pet',
      route: '/other-animals',
    },
    // ...more categories
  ]

  const slides = [
    { image: 'https://cdn.create.vista.com/downloads/8182b741-5b10-465f-8a06-5dd2f17e23aa_1024.jpeg' },
    { image: 'https://cdn.create.vista.com/downloads/8182b741-5b10-465f-8a06-5dd2f17e23aa_1024.jpeg' },
    // add more banners as needed
  ]

  const navigate = useNavigate();

  const handleDealClick = (deal: Deal) => {
    navigate(`/deals/${deal.slug}`);
  };

  // Use imported mock data
  const dealsData: DealsPageData = mockDealsData;

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
          {dealsData.sections.map((section, index) => (
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
                <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-charcoal mb-2">
                  {section.title}
                </h2>
                {/* {section.subtitle && (
                  <p className="text-lg text-medium-gray max-w-2xl">
                    {section.subtitle}
                  </p>
                )} */}
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

        <CategoryCarousel />

        <ReccomendationsGrid />

        <TopBrandsCarousel />
      </div>
    </div>
  );
};

export default Deals;