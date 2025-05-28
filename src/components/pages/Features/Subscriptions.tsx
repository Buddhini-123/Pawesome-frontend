// src/pages/Subscriptions.jsx
import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  Award,
  HeadphonesIcon,
  ChevronDown,
  ChevronUp,
  Package,
} from 'lucide-react'
import SlideshowBanner from '../../banners/subscriptionbanner/SlideshowBanner'
import WhyPawsomeSection from '../../banners/whypawsome/WhyPawsomeSection'
import CategoryCarousel from '../../carousels/CategoryCarousel'
import dogImg from '../../carousels/images/dog.png'
import catImg from '../../carousels/images/cat.png'
import birdImg from '../../carousels/images/bird.png'
import rodentImg from '../../carousels/images/rodent.png'
import TopBrandsCarousel from '../../carousels/brandCarousel/TopBrandsCarousel'
import FAQAccordion from '../../FAQ/FaqAccordions/FAQAccordion'
import ProductRecommendations from './SubscriptionComponents/ProductRecommendations';
import ReccomendationsGrid from '../Subscriptions/ReccomendationsGrid'

const Subscriptions = () => {
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
      bgClass: 'bg-soft-yellow',
      image: dogImg,
      alt: 'Dog',
      route: '/dogs',
    },
    {
      bgClass: 'bg-calm-blue',
      image: catImg,
      alt: 'Cat',
      route: '/cats',
    },
    {
      bgClass: 'bg-soft-yellow',
      image: birdImg,
      alt: 'Bird',
      route: '/birds',
    },
    {
      bgClass: 'bg-energetic-orange',
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <SlideshowBanner slides={subscriptionSlides} autoPlay interval={6000} />
        <WhyPawsomeSection />
        <CategoryCarousel categories={petCategories} />
        
        <TopBrandsCarousel />
        {/* <ReccomendationsGrid /> */}
        <FAQAccordion
          items={faqs}
          initialIndex={0}
          allowMultiple={false}
        />
        {/* <SlideshowBanner slides={slides} interval={6000} /> */}

      </div>
    </div>
  )
}

export default Subscriptions
