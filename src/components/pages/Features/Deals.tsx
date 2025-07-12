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
      className={`relative bg-vibrant-orange rounded-2xl overflow-hidden h-64 cursor-pointer group ${className}`}
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
      <div className="absolute inset-0 bg-vibrant-orange/90 z-5"></div>

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div className="max-w-[60%]">
          <h3 className="text-white font-fredoka font-bold text-lg leading-tight mb-2">{deal.title}</h3>
          <p className="text-white text-sm opacity-90 mb-3 font-fredoka">{deal.subtitle}</p>
        </div>

        <div className="max-w-[60%]">
          <button className="bg-primary-blue text-white px-4 py-2 rounded-full text-sm font-fredoka font-medium hover:bg-blue-700 transition-colors group-hover:scale-105 transform duration-200">
            See More
          </button>
        </div>
      </div>

      {/* Offer Badge */}
      {deal.offerType && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-fredoka font-medium">
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