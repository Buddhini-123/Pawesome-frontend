// src/pages/Subscriptions.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Award,
  HeadphonesIcon,
  Package,
  X,
  Plus,
  Minus,
  Calendar,
  Percent as PercentIcon,
  Eye,
  Check,
  TruckIcon,
  ShieldCheck,
  Heart,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  SkipForward,
  Trash2,
  Repeat,
  Sparkles,
  Wand2,
  Zap,
  CheckCircle,
  Star,
  Gift,
  Tag,
  Mail,
} from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import ActiveSubscriptionsSidebar from '../../subscriptions/ActiveSubscriptionsSidebar'
import { api } from "../../../services/api"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// ── Paw prints for hero background (matches Gifts page) ───────────────
const PAW_POSITIONS = [
  { left:  '4%', top: '12%', size: 44, dur: 7,  delay: 0,   img: 'paw-left'  },
  { left: '12%', top: '72%', size: 36, dur: 9,  delay: 1.2, img: 'paw-right' },
  { left: '80%', top: '18%', size: 48, dur: 8,  delay: 0.5, img: 'paw-right' },
  { left: '88%', top: '68%', size: 38, dur: 7,  delay: 1.8, img: 'paw-left'  },
  { left: '50%', top: '82%', size: 32, dur: 10, delay: 0.3, img: 'paw-right' },
  { left: '38%', top:  '6%', size: 40, dur: 8,  delay: 0.9, img: 'paw-left'  },
  { left: '65%', top: '78%', size: 34, dur: 9,  delay: 1.5, img: 'paw-right' },
  { left: '25%', top: '35%', size: 38, dur: 7,  delay: 0.6, img: 'paw-left'  },
];

// ── Hand-drawn illustrations (scattered per section) ──────────────────
const SUB_ILLUSTRATIONS = [
  // How section
  { src: 'heart-illustrations.png',    left: '5%',  top: '15%', size:  90, rotate: -18, dur: 7,  delay: 0.3, opacity: 0.18, section: 'how'    },
  { src: 'dog-illustrations.png',      left: '88%', top: '8%',  size: 110, rotate:  20, dur: 8,  delay: 0.9, opacity: 0.15, section: 'how'    },
  { src: 'scribble-illustrations.png', left: '92%', top: '60%', size:  85, rotate: -30, dur: 6,  delay: 1.4, opacity: 0.14, section: 'how'    },
  { src: 'hypnotize-illustrations.png',left: '2%',  top: '65%', size:  95, rotate:  12, dur: 9,  delay: 0.6, opacity: 0.13, section: 'how'    },
  { src: 'small-hear-illustrations.png',left:'50%', top: '92%', size:  65, rotate:  25, dur: 5,  delay: 2.0, opacity: 0.16, section: 'how'    },
  { src: 'cat-illustrations.png',      left: '40%', top: '3%',  size: 100, rotate:  -5, dur: 7,  delay: 1.2, opacity: 0.13, section: 'how'    },

  // Plan builder section
  { src: 'scribble-illustrations.png', left: '1%',  top: '10%', size:  95, rotate:  18, dur: 8,  delay: 0.5, opacity: 0.14, section: 'plan'   },
  { src: 'heart-illustrations.png',    left: '90%', top: '5%',  size:  80, rotate: -22, dur: 6,  delay: 1.0, opacity: 0.18, section: 'plan'   },
  { src: 'dog-illustrations.png',      left: '85%', top: '70%', size: 105, rotate:  10, dur: 7,  delay: 0.2, opacity: 0.14, section: 'plan'   },
  { src: 'hypnotize-illustrations.png',left: '3%',  top: '75%', size:  90, rotate: -15, dur: 9,  delay: 1.6, opacity: 0.13, section: 'plan'   },
  { src: 'small-hear-illustrations.png',left:'55%', top: '95%', size:  70, rotate:  30, dur: 5,  delay: 0.8, opacity: 0.16, section: 'plan'   },
];

// ── Leaf configs (matches Gifts page) ─────────────────────────────────
const SUB_LEAVES = [
  { top:  '2%', left:  '-2%', size: 260, rotate:   15, dur: 7,  delay: 0   },
  { top:  '5%', left:  '78%', size: 280, rotate:  -55, dur: 9,  delay: 1.2 },
  { top: '55%', left:  '88%', size: 260, rotate: -110, dur: 7,  delay: 2.1 },
  { top: '62%', left:   '8%', size: 280, rotate:  300, dur: 9,  delay: 0.8 },
  { top: '30%', left:   '3%', size: 270, rotate:  170, dur: 8,  delay: 1.8 },
  { top: '74%', left:  '65%', size: 250, rotate:  130, dur: 6,  delay: 1.5 },
];

// ── Step card color palette (matches Gifts page) ──────────────────────
const SUB_STEP_COLORS = [
  { bg: '#FF8B61', text: '#7A2800' },
  { bg: '#1BBBFF', text: '#004D6B' },
  { bg: '#48FFF2', text: '#004D50' },
  { bg: '#FFDB4D', text: '#7A5500' },
  { bg: '#FC6884', text: '#7A0030' },
  { bg: '#B791FF', text: '#2D0066' },
];

// ── Subscription "How to" steps ───────────────────────────────────────
const SUB_STEPS = [
  { id: 1, title: 'Pick Products',   emoji: '🛒', desc: 'Browse & select favourites',    illust: 'scribble-illustrations.png',  Icon: ShoppingCart },
  { id: 2, title: 'Set Schedule',    emoji: '📅', desc: 'Daily, weekly, monthly',        illust: 'dog-illustrations.png',       Icon: Calendar     },
  { id: 3, title: 'Unlock Benefits', emoji: '🎁', desc: 'Save 10% + free shipping',      illust: 'heart-illustrations.png',     Icon: Award        },
  { id: 4, title: 'Relax & Enjoy',   emoji: '📦', desc: 'Auto-deliver, we handle rest',  illust: 'cat-illustrations.png',       Icon: Package      },
];

// ── Top-level benefits strip (matches Gifts page style) ───────────────
const SUB_BENEFITS = [
  { icon: <PercentIcon  className="w-7 h-7" />, title: 'Save Up to 10%',  desc: 'On every subscription order' },
  { icon: <TruckIcon    className="w-7 h-7" />, title: 'Free Delivery',   desc: 'On orders above Rs. 2,000'   },
  { icon: <RefreshCw    className="w-7 h-7" />, title: 'Skip Anytime',    desc: 'Flexible delivery control'   },
  { icon: <ShieldCheck  className="w-7 h-7" />, title: 'Priority Care',   desc: '24/7 member support'         },
];

// ── Reusable illustration background layer ────────────────────────────
const SubIllustrationBg: React.FC<{ section: string }> = ({ section }) => (
  <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
    {SUB_ILLUSTRATIONS.filter(il => il.section === section).map((il, i) => (
      <motion.img
        key={i}
        src={`/icons/illustrations/${il.src}`}
        alt="" aria-hidden="true"
        className="absolute"
        style={{ left: il.left, top: il.top, width: il.size, height: il.size, opacity: il.opacity, rotate: `${il.rotate}deg` }}
        animate={{ y: [0, -14, 6, -10, 0], rotate: [il.rotate, il.rotate + 8, il.rotate - 5, il.rotate + 3, il.rotate] }}
        transition={{ duration: il.dur, repeat: Infinity, delay: il.delay, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

// ── Interactive hero illustration (matches Gifts page) ────────────────
type SubIllustState = 'floating' | 'hovered' | 'clicked' | 'returning';
type SubClickEffect = 'bounce' | 'spin' | 'wiggle' | 'pulse';

const SubHeroIllust: React.FC<{
  src: string;
  className?: string;
  style: React.CSSProperties;
  floatY: number[];
  floatRotate?: number[];
  dur: number;
  delay?: number;
  hoverX?: number;
  hoverY?: number;
  clickEffect: SubClickEffect;
  baseRotate?: number;
}> = ({ src, className = '', style, floatY, floatRotate, dur, delay = 0, hoverX = 0, hoverY = -24, clickEffect, baseRotate = 0 }) => {
  const [state, setState] = useState<SubIllustState>('floating');

  const animate = (() => {
    if (state === 'hovered') return { x: hoverX, y: hoverY, scale: 1.14, rotate: baseRotate + 6 };
    if (state === 'clicked') {
      if (clickEffect === 'bounce') return { y: [0, -55, 14, -28, 5, 0], scale: [1, 1.28, 0.88, 1.16, 0.96, 1], rotate: baseRotate };
      if (clickEffect === 'spin')   return { rotate: [baseRotate, baseRotate + 360], scale: [1, 1.18, 1] };
      if (clickEffect === 'wiggle') return { x: [0, -18, 18, -12, 12, -6, 6, 0], rotate: [baseRotate, baseRotate - 14, baseRotate + 14, baseRotate] };
      if (clickEffect === 'pulse')  return { scale: [1, 1.55, 0.82, 1.28, 0.94, 1], rotate: baseRotate };
    }
    if (state === 'returning') return { x: 0, y: 0, scale: 1, rotate: baseRotate };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a: any = { y: floatY };
    if (floatRotate) a.rotate = floatRotate;
    return a;
  })();

  const transition = (() => {
    if (state === 'hovered')   return { duration: 0.22, ease: 'easeOut' as const };
    if (state === 'clicked')   return { duration: clickEffect === 'spin' ? 0.6 : 0.52, ease: 'easeOut' as const };
    if (state === 'returning') return { type: 'spring' as const, stiffness: 38, damping: 11 };
    return { duration: dur, repeat: Infinity, delay, ease: 'easeInOut' as const };
  })();

  return (
    <motion.img
      src={src}
      alt="" aria-hidden="true"
      className={`absolute select-none cursor-pointer ${className}`}
      style={style}
      animate={animate}
      transition={transition}
      onHoverStart={() => { if (state === 'floating') setState('hovered'); }}
      onHoverEnd={() => { if (state === 'hovered') setState('returning'); }}
      onClick={() => setState('clicked')}
      onAnimationComplete={() => {
        if (state === 'clicked') setState('returning');
        else if (state === 'returning') setState('floating');
      }}
    />
  );
};

interface Subscription {
  id: number;
  status: string;
  status_label: string;
  name: string;
  startDate: Date;
  frequency: number;
  schedule: {
    interval_type: string;
    interval_value: number;
    interval_description: string;
    start_date: string;
    end_date: string;
    next_delivery_date: string;
    last_delivery_date: string | null;
    days_until_next_delivery: number;
  };
  pricing: {
    subtotal: number;
    discount_amount: number;
    discount_percentage: number;
    tax_amount: number;
    total_amount: number;
    total_subscription_cost?: number;
    per_delivery_cost?: number;
    currency: string;
  };
  delivery_schedule?: {
    total_deliveries: number;
    completed_deliveries: number;
    remaining_deliveries: number;
  };
  items: any[];
  total_items: number;
  delivery: { address_id: number; payment_method_id: number };
  preferences?: Record<string, any>;
  metadata?: any[];
  timestamps?: Record<string, any>;
  actions?: Record<string, any>;
  deliveryAddress: string;
  nextDelivery: string | null;
   total: number;
  savedAmount: number;
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: number
  name: string
  slug: string
  price: number
  stock_quantity: number
  category: Category
  primary_image?: { url: string } | null;
  preferences: string
  quantity: number
  brand?: string;
  originalPrice?: number;
  discount_percentage?: number;
  images?: { url: string }[];
  rating?: number;
  rating_avg?: number;
  review_count?: number;
  is_in_stock?: boolean;
  description?: string;
  subcategory?: string;
  currency?: string;
  // Subscription fields
  subscription_enabled?: boolean;
  subscription_discount_percentage?: number;
  min_subscription_quantity?: number;
  max_subscription_quantity?: number;
  // Weight and dimensions
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit?: string;
  };
}

interface MappedSubscription {
  id: any;
  name: string;
  products: any;
  frequency: any;
  nextDelivery: any;
  total: any;
  startDate: any;
  status: any;
  deliveryAddress: string;
  savedAmount: any;
  totalDeliveries?: number;
  completedDeliveries?: number;
  remainingDeliveries?: number;
  perDeliveryCost?: number;
  totalSubscriptionCost?: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}


const Subscriptions = () => {

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [confirmedProducts, setConfirmedProducts] = useState<Product[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [deliveryFrequency, setDeliveryFrequency] = useState('monthly')
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})
  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeSubscriptions, setActiveSubscriptions] = useState<MappedSubscription[]>([]);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [deliveryPeriod, setDeliveryPeriod] = useState("");
  const [intervalType, setIntervalType] = useState<'weekly' | 'monthly' | 'custom'>('weekly');
  const [intervalValue, setIntervalValue] = useState(1);

  // Inline action states (replace window.confirm / prompt)
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showConfirmPause, setShowConfirmPause] = useState(false);
  const [showConfirmSkip, setShowConfirmSkip] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [showRescheduleInput, setShowRescheduleInput] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // ── Section refs for scroll-driven parallax (matches Gifts page) ────
  const heroRef = useRef<HTMLElement>(null);
  const howRef  = useRef<HTMLElement>(null);
  const planRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: howP  } = useScroll({ target: howRef,  offset: ['start end',   'end start'] });
  const { scrollYProgress: planP } = useScroll({ target: planRef, offset: ['start end',   'end start'] });
  const heroS = useSpring(heroP, { stiffness: 55, damping: 22, restDelta: 0.001 });
  const howS  = useSpring(howP,  { stiffness: 55, damping: 22, restDelta: 0.001 });
  const planS = useSpring(planP, { stiffness: 55, damping: 22, restDelta: 0.001 });
  const heroIllustY = useTransform(heroS, [0, 1], [0, -150]);
  const heroPawY    = useTransform(heroS, [0, 1], [0,  -70]);
  const heroTextY   = useTransform(heroS, [0, 1], [0,  -45]);
  const howBgY      = useTransform(howS,  [0, 1], [80, -80]);
  const howLeafY    = useTransform(howS,  [0, 1], [50, -60]);
  const planBgY     = useTransform(planS, [0, 1], [80, -80]);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get("/subscriptions");
      const data = response.data as {
        success: boolean;
        data: any[];
        pagination: any;
      };

      console.log("Mapped subscriptions2:", data.data); // Debug log

      if (data && Array.isArray(data.data)) {
        const mappedSubscriptions: MappedSubscription[] = data.data.map((item: any) => {
          // Map all product names for display
          const productNames = item.items?.map((subItem: any) => subItem.product?.name) || [];

          return {
            id: item.id,
            name: productNames.join(", ") || "Unknown Product", // Join all product names
            products: item.total_items || 0,
            frequency: item.schedule?.interval_description || "N/A",
            nextDelivery: item.schedule?.next_delivery_date || null,
            total: item.pricing?.total_amount || 0,
            startDate: item.schedule?.start_date || null,
            status: item.status_label || "Unknown",
            deliveryAddress: item.delivery?.address_id
              ? `Address ID: ${item.delivery.address_id}`
              : "Default Address",
            savedAmount: item.items?.reduce((sum: number, subItem: any) => sum + (subItem.pricing?.total_savings || 0), 0) || 0,
            // Enhanced delivery schedule tracking
            totalDeliveries: item.delivery_schedule?.total_deliveries,
            completedDeliveries: item.delivery_schedule?.completed_deliveries || 0,
            remainingDeliveries: item.delivery_schedule?.remaining_deliveries,
            perDeliveryCost: item.pricing?.per_delivery_cost,
            totalSubscriptionCost: item.pricing?.total_subscription_cost,
            items: item.items?.map((subItem: any) => ({
              name: subItem.product?.name || "Unknown Product",
              quantity: subItem.quantity || 1,
              price: subItem.pricing?.unit_price || 0,
            })) || [],
          };
        });

        console.log("Mapped subscriptions:", mappedSubscriptions); // Debug log
        setActiveSubscriptions(mappedSubscriptions);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("User is unauthenticated. Redirecting to login...");
      } else {
        console.error("Error fetching subscriptions:", error);
      }
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Fetch products with pagination
  const fetchProducts = async (page: number = 1, category: string = 'all') => {
    setIsLoadingProducts(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        subscription_only: 'true',
      });

      // Add category filter if not 'all'
      if (category !== 'all') {
        params.append('category', category);
      }

      const response = await api.get(`/products?${params.toString()}`);
      const data = response.data as any;

      if (data.success && data.data) {
        setProducts(data.data);

        // Handle pagination metadata
        if (data.pagination) {
          setCurrentPage(data.pagination.current_page || page);
          setTotalPages(data.pagination.last_page || 1);
          setTotalProducts(data.pagination.total || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories((res.data as any).data || []);
    });
    fetchProducts(1);
  }, []);

  // Fetch products when page or category changes
  useEffect(() => {
    if (isModalOpen) {
      fetchProducts(currentPage, selectedCategory);
    }
  }, [currentPage, selectedCategory, isModalOpen]);


  const handleProductToggle = (product: Product) => {
    // Validate product eligibility
    if (!product.subscription_enabled) {
      toast.error("This product is not available for subscription");
      return;
    }

    if (!product.is_in_stock || product.stock_quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id)
      if (isSelected) {
        // Remove product and its quantity
        const newQuantities = { ...productQuantities }
        delete newQuantities[product.id]
        setProductQuantities(newQuantities)
        return prev.filter(p => p.id !== product.id)
      } else {
        // Use quantity already set on product (e.g. from modal stepper), else fall back to min
        const minQty = product.min_subscription_quantity || 1;
        const qty = product.quantity && product.quantity >= minQty ? product.quantity : minQty;
        setProductQuantities(prev => ({ ...prev, [product.id]: qty }))
        return [...prev, product]
      }
    })
  }

  const handleQuantityChange = (productId: string, change: number) => {
    setProductQuantities(prev => {
      // Find the product to get min/max quantities
      const product = confirmedProducts.find(p => p.id === Number(productId)) ||
                     selectedProducts.find(p => p.id === Number(productId));

      const minQty = product?.min_subscription_quantity || 1;
      const maxQty = product?.max_subscription_quantity || 99;

      const currentQty = prev[productId] || minQty;
      const newQty = Math.max(minQty, Math.min(maxQty, currentQty + change));

      // Show warning if hitting limits
      if (newQty === maxQty && currentQty + change > maxQty) {
        toast.warning(`Maximum quantity for this product is ${maxQty}`);
      } else if (newQty === minQty && currentQty + change < minQty) {
        toast.warning(`Minimum quantity for this product is ${minQty}`);
      }

      return { ...prev, [productId]: newQty }
    })
  }

  const handleConfirmSelection = (scheduleData: any) => {
    if (!scheduleData.startDate) {
      toast.error("Please select a start date");
      return;
    }

    if (scheduleData.endDate && new Date(scheduleData.endDate) <= new Date(scheduleData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    // Validate interval values
    if (!scheduleData.intervalType || !scheduleData.intervalValue) {
      toast.error("Please select a valid delivery frequency");
      return;
    }

    // Attach quantities and calculate subscription price for each product
    const productsWithQuantities = selectedProducts.map(product => {
      const quantity = productQuantities[product.id] || 1;
      const discountPercent = product.subscription_discount_percentage || 0;
      const discountMultiplier = 1 - (discountPercent / 100);
      const subscriptionPrice = Math.floor(product.price * discountMultiplier);

      return {
        ...product,
        quantity,
        subscription_price: subscriptionPrice
      };
    });

    console.log(`[Subscriptions] Creating subscription: ${productsWithQuantities.length} products, ${scheduleData.intervalType} from ${scheduleData.startDate} to ${scheduleData.endDate || 'ongoing'}`);

    navigate('/checkout', {
      state: {
        type: "subscription",
        scheduleData,
        selectedProducts: productsWithQuantities
      },
    });
  };


  const handleOpenModal = () => {
    setSelectedProducts(confirmedProducts)
    setIsModalOpen(true)
    setCurrentPage(1) // Reset to first page when opening modal
  }

  const handleSubscriptionClick = (subscription: MappedSubscription) => {
    setSelectedSubscription(subscription as any)
    setShowSubscriptionModal(true)
  }

  const handleManageSubscription = (e: React.MouseEvent, subscription: MappedSubscription) => {
    e.stopPropagation() // Prevent card click
    setSelectedSubscription(subscription as any)
    setShowSubscriptionModal(true)
  }

  const handleRemoveProduct = (productId: number) => {
    setConfirmedProducts(prev => prev.filter(p => p.id !== productId))
    const newQuantities = { ...productQuantities }
    delete newQuantities[productId]
    setProductQuantities(newQuantities)
  }

  const handleViewProductDetails = async (product: Product) => {
    try {
      // Use slug instead of id for product details endpoint
      const response = await api.get(`/products/${product.slug || product.id}`);

      if (response.success && response.data) {
        const productData = (response.data as any)?.data?.product || (response.data as any);

        // Debug: Log the full API response to check weight and dimensions
        console.log('[Subscriptions] Full API Response:', response);
        console.log('[Subscriptions] Product Data:', productData);
        console.log('[Subscriptions] Weight:', productData?.weight);
        console.log('[Subscriptions] Dimensions:', productData?.dimensions);

        // Pre-seed quantity: use the saved cart quantity so the stepper starts at the right value
        const savedQty = productQuantities[productData.id];
        setSelectedProduct({ ...productData, quantity: savedQty || productData.quantity || 1 });
        setShowProductModal(true);
      } else {
        // Product not found or API error
        const errorMsg = (response as any).error || 'Product not found';
        console.error("Failed to load product:", errorMsg);
        toast.error(`Product not available`);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product details");
    }
  };

 const handleCancel = async (subscriptionId: number) => {
  try {
    const response = await api.delete(`/subscriptions/${subscriptionId}/cancel`);
    const data = response.data as any;

    if (data.success) {
      setShowSubscriptionModal(false);
      setSelectedSubscription(null);
      setShowConfirmCancel(false);
      toast.success("Subscription cancelled successfully");
      await fetchSubscriptions();
    } else {
      toast.error(data.message || "Failed to cancel subscription");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    console.error("Cancel subscription error:", error.response || error.message);
  }
};

const handlePause = async (subscriptionId: number) => {
  try {
    const response = await api.put(`/subscriptions/${subscriptionId}/pause`);
    const data = response.data as any;

    if (data.success) {
      toast.success("Subscription paused successfully");
      setShowConfirmPause(false);
      await fetchSubscriptions();
      setShowSubscriptionModal(false);
    } else {
      toast.error(data.message || "Failed to pause subscription");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    console.error("Pause subscription error:", error.response || error.message);
  }
};

const handleResume = async (subscriptionId: number) => {
  try {
    const response = await api.put(`/subscriptions/${subscriptionId}/resume`);
    const data = response.data as any;

    if (data.success) {
      toast.success("Subscription resumed successfully");
      await fetchSubscriptions(); // Refresh subscriptions list
      setShowSubscriptionModal(false);
    } else {
      toast.error(data.message || "Failed to resume subscription");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    console.error("Resume subscription error:", error.response || error.message);
  }
};

const handleSkipDelivery = async (subscriptionId: number) => {
  try {
    const response = await api.put(`/subscriptions/${subscriptionId}/skip-delivery`);
    const data = response.data as any;

    if (data.success) {
      toast.success("Next delivery skipped successfully");
      setShowConfirmSkip(false);
      await fetchSubscriptions();
    } else {
      toast.error(data.message || "Failed to skip delivery");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    console.error("Skip delivery error:", error.response || error.message);
  }
};

const handleReschedule = async (subscriptionId: number, newDate: string) => {
  try {
    const response = await api.put(`/subscriptions/${subscriptionId}/reschedule`, {
      next_delivery_date: newDate
    });
    const data = response.data as any;

    if (data.success) {
      toast.success("Delivery rescheduled successfully");
      setShowRescheduleInput(false);
      setRescheduleDate('');
      await fetchSubscriptions();
    } else {
      toast.error(data.message || "Failed to reschedule delivery");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    console.error("Reschedule delivery error:", error.response || error.message);
  }
};

  // Products are now filtered on the backend
  const filteredProducts = products;

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to page 1 when category changes
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-warm-white">

      {/* ── Hero (Gifts-page theme) ─────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden bg-primary-blue min-h-[560px] md:min-h-[620px] flex items-center">
        {/* Interactive illustrations — fastest parallax */}
        <motion.div style={{ y: heroIllustY }} className="absolute inset-0">
          <SubHeroIllust
            src="/icons/illustrations/dog-illustrations.png"
            className="hidden md:block"
            style={{ width: 460, height: 460, bottom: -30, right: -30, objectFit: 'contain' }}
            floatY={[0, -16, 0]} dur={5} hoverX={-20} hoverY={-28} clickEffect="bounce"
          />
          <SubHeroIllust
            src="/icons/illustrations/cat-illustrations.png"
            className="hidden md:block"
            style={{ width: 440, height: 440, bottom: -20, left: -30, objectFit: 'contain', opacity: 0.85 }}
            floatY={[0, -12, 0]} floatRotate={[0, 4, 0]} dur={4.5} delay={0.6}
            hoverX={20} hoverY={-24} clickEffect="wiggle"
          />
          <SubHeroIllust
            src="/icons/illustrations/heart-illustrations.png"
            style={{ width: 110, height: 110, top: '6%', right: '14%', opacity: 0.9 }}
            floatY={[0, -12, 0]} floatRotate={[-6, 6, -6]} dur={3.8} delay={0.4}
            hoverY={-30} clickEffect="pulse"
          />
          <SubHeroIllust
            src="/icons/illustrations/small-hear-illustrations.png"
            style={{ width: 72, height: 72, top: '12%', left: '22%', opacity: 0.85 }}
            floatY={[0, -10, 0]} dur={3.2} delay={1.0}
            hoverY={-22} clickEffect="pulse"
          />
          <SubHeroIllust
            src="/icons/illustrations/scribble-illustrations.png"
            style={{ width: 200, height: 200, top: '-20px', left: '38%', opacity: 0.22 }}
            floatY={[0, -8, 0]} floatRotate={[15, 22, 15]} dur={9}
            hoverY={-18} clickEffect="spin" baseRotate={15}
          />
          <SubHeroIllust
            src="/icons/illustrations/hypnotize-illustrations.png"
            style={{ width: 130, height: 130, bottom: '8%', left: '44%', opacity: 0.28 }}
            floatY={[0, -6, 0]} floatRotate={[0, 360, 360]} dur={14}
            hoverY={-20} clickEffect="spin"
          />
        </motion.div>

        {/* Paw prints — mid parallax */}
        <motion.div style={{ y: heroPawY }} className="absolute inset-0 pointer-events-none select-none">
          {PAW_POSITIONS.map((p, i) => (
            <motion.img
              key={i}
              src={`/icons/${p.img}.png`}
              alt="" aria-hidden="true"
              className="absolute"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size, opacity: 0.10, filter: 'brightness(0) invert(1)' }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        {/* Text — slowest parallax */}
        <motion.div style={{ y: heroTextY }} className="relative z-10 w-full">
          <div className="container mx-auto px-6 lg:px-12 py-20 md:py-24 flex justify-center">
            <motion.div
              className="text-center max-w-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <motion.h1
                className="font-fredoka font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-5"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
              >
                Never Run
                <br />
                <span className="text-sunny-yellow">Out Again</span>
              </motion.h1>

              <motion.p
                className="font-nunito text-white/80 text-lg md:text-xl mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.6 }}
              >
                Curated boxes of your pet's essentials — delivered on your schedule, with 10% off every order and zero commitment.
              </motion.p>

              <motion.div
                className="flex flex-row items-center justify-center gap-4 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.6 }}
              >
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 bg-sunny-yellow text-charcoal font-fredoka font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:scale-[1.04] hover:shadow-xl transition-all duration-300"
                >
                  <Package className="w-5 h-5" /> Browse Products
                </button>
                <button
                  onClick={() => setShowSidebar(true)}
                  className="flex items-center gap-2 bg-white/15 border-2 border-white/40 text-white font-fredoka font-bold px-8 py-3.5 rounded-2xl hover:bg-white/25 hover:scale-[1.04] transition-all duration-300"
                >
                  <Repeat className="w-5 h-5" /> My Subscriptions
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Benefits strip ──────────────────────────────────────────── */}
      <section className="bg-primary-blue py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SUB_BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <motion.div
                  className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white mb-1"
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 200, damping: 14 }}
                >
                  {b.icon}
                </motion.div>
                <h4 className="font-fredoka font-bold text-white text-sm md:text-base">{b.title}</h4>
                <p className="font-nunito text-white/70 text-xs hidden md:block">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section ref={howRef} className="relative overflow-hidden bg-sky-light py-20 px-4">
        {/* Illustration bg — fastest parallax */}
        <motion.div style={{ y: howBgY }} className="absolute inset-0 pointer-events-none">
          <SubIllustrationBg section="how" />
        </motion.div>
        {/* Leaf layer — mid parallax */}
        <motion.div style={{ y: howLeafY }} className="absolute inset-0 pointer-events-none select-none">
          {SUB_LEAVES.map((l, i) => (
            <motion.img
              key={i}
              src="/icons/leaf-layer.png"
              alt="" aria-hidden="true"
              className="absolute"
              style={{ top: l.top, left: l.left, width: l.size, height: l.size, opacity: 0.22, mixBlendMode: 'multiply' }}
              animate={{ y: [0, -20, 10, -15, 0], rotate: [l.rotate, l.rotate + 10, l.rotate - 6, l.rotate + 4, l.rotate] }}
              transition={{ duration: l.dur, repeat: Infinity, delay: l.delay, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        <div className="relative z-10 container mx-auto max-w-7xl">
          {/* Heading */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-fredoka font-bold mb-3"
              style={{ color: '#004D6B' }}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            >
              How Subscriptions Work 🐾
            </motion.h2>
            <motion.p
              className="font-nunito text-lg max-w-2xl mx-auto"
              style={{ color: '#004D6B', opacity: 0.82 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Four simple steps to never worry about running out of pet essentials again.
            </motion.p>
          </motion.div>

          {/* Step cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {SUB_STEPS.map((step, i) => {
              const col = SUB_STEP_COLORS[i];
              const StepIcon = step.Icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 40, scale: 0.93 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
                  whileHover={{ y: -7, scale: 1.03 }}
                  className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-default"
                  style={{ backgroundColor: col.bg, minHeight: 180 }}
                >
                  {/* Decorative step number */}
                  <span
                    className="absolute -top-1 right-1 font-fredoka font-bold leading-none select-none pointer-events-none"
                    style={{ fontSize: 64, color: col.text, opacity: 0.12, lineHeight: 1 }}
                  >
                    {String(step.id).padStart(2, '0')}
                  </span>
                  {/* Illustration */}
                  <img
                    src={`/icons/illustrations/${step.illust}`}
                    alt="" aria-hidden
                    className="absolute bottom-0 right-0 w-14 h-14 object-contain pointer-events-none select-none"
                    style={{ opacity: 0.18 }}
                  />
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center p-4 md:p-5">
                    <div
                      className="w-11 h-11 bg-white/30 rounded-xl flex items-center justify-center mb-2"
                      style={{ color: col.text }}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-fredoka font-bold text-lg leading-tight mb-1" style={{ color: col.text }}>
                      {step.title}
                    </h3>
                    <div className="h-px w-8 rounded-full mb-1.5" style={{ backgroundColor: `${col.text}55` }} />
                    <p className="font-nunito text-sm leading-snug" style={{ color: col.text, opacity: 0.74 }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Start Your Plan CTA (split layout like Gifts "Build Your Own") ── */}
      <section ref={planRef} className="relative overflow-hidden py-24 px-4" style={{ background: 'linear-gradient(160deg, #E8F7FF 0%, #FFFAF0 55%)' }}>
        <motion.div style={{ y: planBgY }} className="absolute inset-0 pointer-events-none">
          <SubIllustrationBg section="plan" />
        </motion.div>
        <div className="relative z-10 container mx-auto max-w-7xl">
          {/* Heading */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <img src="/icons/illustrations/scribble-illustrations.png" alt="" aria-hidden className="w-10 h-10 opacity-40" style={{ rotate: '-18deg' }} />
              <h2 className="font-fredoka font-bold text-4xl md:text-5xl" style={{ color: '#004D6B' }}>
                Start Your Plan
              </h2>
              <img src="/icons/illustrations/heart-illustrations.png" alt="" aria-hidden className="w-9 h-9 opacity-40" style={{ rotate: '12deg' }} />
            </div>
            <p className="font-nunito text-lg max-w-xl mx-auto" style={{ color: '#004D6B', opacity: 0.70 }}>
              Pick your products, set a schedule, and save 10% on every delivery.
            </p>
          </motion.div>

          {/* Main layout: CTA card (left) + feature pills (right) */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-stretch">
            {/* CTA showcase card */}
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-3xl bg-primary-blue lg:w-[40%] flex-shrink-0"
              style={{ minHeight: 460, boxShadow: '0 24px 64px rgba(27,187,255,0.32)' }}
            >
              <motion.img
                src="/icons/illustrations/dog-illustrations.png"
                alt="" aria-hidden
                className="absolute bottom-0 right-0 pointer-events-none select-none"
                style={{ width: '62%', opacity: 0.58 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <img
                src="/icons/illustrations/scribble-illustrations.png"
                alt="" aria-hidden
                className="absolute top-5 right-5 w-14 pointer-events-none select-none"
                style={{ opacity: 0.14, rotate: '28deg' }}
              />
              <img
                src="/icons/illustrations/small-hear-illustrations.png"
                alt="" aria-hidden
                className="absolute bottom-36 left-6 w-10 pointer-events-none select-none"
                style={{ opacity: 0.18, rotate: '-18deg' }}
              />

              <div className="relative z-10 flex flex-col h-full p-8 pt-10">
                <h3 className="font-fredoka font-bold text-white leading-tight mb-3" style={{ fontSize: 'clamp(1.8rem, 2.4vw, 2.5rem)' }}>
                  Your pet's<br />
                  <span className="text-sunny-yellow">favourites</span>,<br />
                  on autopilot.
                </h3>
                <p className="font-nunito text-white/65 text-sm mb-6 leading-relaxed" style={{ maxWidth: 240 }}>
                  Pick from our full catalogue — food, treats, toys, grooming & more.
                </p>

                <div className="flex flex-col gap-2.5 mb-8">
                  {[
                    '10% off every recurring order',
                    'Free delivery over Rs. 2,000',
                    'Pause, skip, or cancel any time',
                    'Loyalty points on every box',
                  ].map(text => (
                    <div key={text} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-sunny-yellow flex-shrink-0" />
                      <span className="font-nunito text-white/80 text-sm">{text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleOpenModal}
                  className="inline-flex items-center gap-2 bg-sunny-yellow text-charcoal font-fredoka font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 self-start"
                >
                  <ShoppingCart className="w-4 h-4" /> Build My Box
                </button>
              </div>
            </motion.div>

            {/* Right feature grid */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {[
                { Icon: PercentIcon, title: 'Save 10%',         desc: 'Every recurring order' },
                { Icon: TruckIcon,   title: 'Free Delivery',    desc: 'Above Rs. 2,000'       },
                { Icon: Calendar,    title: 'Flexible Schedule',desc: 'Daily · Weekly · Monthly' },
                { Icon: RefreshCw,   title: 'Skip Anytime',     desc: 'Full control, always'  },
                { Icon: Award,       title: 'Loyalty Points',   desc: 'Earn on every box'     },
                { Icon: ShieldCheck, title: 'Priority Care',    desc: '24/7 member support'   },
              ].map((f, i) => {
                const col = SUB_STEP_COLORS[i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, scale: 0.94 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="relative overflow-hidden rounded-2xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-default"
                    style={{ backgroundColor: col.bg, minHeight: 140 }}
                  >
                    <div
                      className="w-11 h-11 bg-white/30 rounded-xl flex items-center justify-center mb-2"
                      style={{ color: col.text }}
                    >
                      <f.Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-fredoka font-bold text-base md:text-lg leading-tight mb-0.5" style={{ color: col.text }}>
                      {f.title}
                    </h3>
                    <p className="font-nunito text-xs md:text-sm leading-snug" style={{ color: col.text, opacity: 0.74 }}>
                      {f.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Features bar (matches Gifts page) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-3xl bg-sunny-yellow px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <img src="/icons/illustrations/scribble-illustrations.png" alt="" aria-hidden
              className="absolute -top-5 -left-5 w-24 opacity-10 pointer-events-none select-none" style={{ rotate: '-20deg' }} />
            <img src="/icons/illustrations/heart-illustrations.png" alt="" aria-hidden
              className="absolute -bottom-4 -right-4 w-20 opacity-10 pointer-events-none select-none" style={{ rotate: '15deg' }} />

            {[
              { Icon: Sparkles, title: 'Hand-picked',    desc: 'Premium brands only'   },
              { Icon: Tag,      title: 'Save 10%',       desc: 'On every order'        },
              { Icon: Mail,     title: 'Gift-ready',     desc: 'Add a personal note'   },
              { Icon: Zap,      title: 'Fast Dispatch',  desc: 'Order before 2 PM'     },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.12 + i * 0.10, duration: 0.45, ease: 'easeOut' }}
                className="relative z-10 text-center"
              >
                <motion.div
                  className="w-14 h-14 bg-white/55 rounded-2xl flex items-center justify-center mx-auto mb-3 text-charcoal"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + i * 0.10, type: 'spring', stiffness: 220, damping: 14 }}
                  whileHover={{ scale: 1.12, rotate: -5 }}
                >
                  <f.Icon className="w-6 h-6" />
                </motion.div>
                <h3 className="font-fredoka font-bold text-charcoal mb-0.5">{f.title}</h3>
                <p className="text-sm font-nunito text-charcoal/65">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Confirmed plan wrapper (keeps existing logic) ───────────── */}
      <div className="container mx-auto px-4 py-12">

        {/* Selected Products Section - Enhanced Design */}
        {confirmedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto mt-16"
          >
            {/* Main Container with Gradient Border */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-vibrant-orange rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
              </div>

              {/* Header Section */}
              <div className="relative bg-primary-blue p-8 overflow-hidden">
                <img src="/icons/illustrations/scribble-illustrations.png" alt="" aria-hidden className="absolute -top-3 -right-3 w-20 pointer-events-none select-none" style={{ opacity: 0.14, rotate: '18deg' }} />
                <img src="/icons/illustrations/heart-illustrations.png" alt="" aria-hidden className="absolute -bottom-4 left-6 w-14 pointer-events-none select-none" style={{ opacity: 0.16, rotate: '-12deg' }} />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-fredoka font-bold text-white mb-2 flex items-center">
                      <Package className="mr-3 h-8 w-8" />
                      Your Subscription Plan
                    </h2>
                    <p className="font-nunito text-white/80">Customize your delivery preferences and manage products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/75 text-sm font-nunito">Total Products</p>
                    <p className="text-3xl font-fredoka font-bold text-sunny-yellow">{confirmedProducts.length}</p>
                  </div>
                </div>
              </div>

              <div className="relative p-8">
                {/* Subscription Settings Section */}
                <motion.div 
                  className="mb-10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-fredoka font-bold text-charcoal mb-6 flex items-center">
                    <Calendar className="mr-2 h-6 w-6 text-vibrant-orange" />
                    Delivery Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Start Date Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-vibrant-orange transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-fredoka font-semibold text-charcoal">Start Date</label>
                        <Calendar className="h-5 w-5 text-vibrant-orange" />
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-vibrant-orange focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-medium-gray mt-2">When should we start delivering?</p>
                    </motion.div>
                    
                    {/* End Date Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-primary-blue transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-fredoka font-semibold text-charcoal">End Date</label>
                        <Calendar className="h-5 w-5 text-primary-blue" />
                      </div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-medium-gray mt-2">Optional end date for subscription</p>
                    </motion.div>
                    
                    {/* Frequency Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-mint-green transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-fredoka font-semibold text-charcoal">Frequency</label>
                        <Package className="h-5 w-5 text-mint-green" />
                      </div>
                      <select
                        value={deliveryFrequency}
                        onChange={(e) => setDeliveryFrequency(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-mint-green focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="daily">Daily Delivery</option>
                        <option value="weekly">Weekly Delivery</option>
                        <option value="monthly">Monthly Delivery</option>
                      </select>
                      <p className="text-xs text-medium-gray mt-2">How often should we deliver?</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Selected Products Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-fredoka font-bold text-charcoal mb-6 flex items-center">
                    <ShoppingCart className="mr-2 h-6 w-6 text-vibrant-orange" />
                    Selected Products
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                    {confirmedProducts.map((product, index) => (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-vibrant-orange transition-all"
                      >
                        <div className="relative">
                          <img
                            src={getProductImageSrc(product)}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = PRODUCT_PLACEHOLDER; }}
                          />
                          <div className="absolute top-2 right-2 bg-vibrant-orange text-white text-xs px-2 py-1 rounded-full">
                            Save 10%
                          </div>
                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveProduct(product.id);
                            }}
                            className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
                            title="Remove product"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-fredoka font-bold text-charcoal mb-1 line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-sm text-medium-gray mb-3">{product.brand}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              {(() => {
                                const discountPercent = product.subscription_discount_percentage || 0;
                                const discountMultiplier = 1 - (discountPercent / 100);
                                const subscriptionPrice = Math.floor(product.price * discountMultiplier);
                                return (
                                  <>
                                    <span className="text-lg font-fredoka font-bold text-vibrant-orange">
                                      {product?.currency} {subscriptionPrice}
                                    </span>
                                    <span className="text-sm text-light-gray line-through ml-2">
                                      {product?.currency} {product.price}
                                    </span>
                                  </>
                                );
                              })()}
                            </div>
                            <div className="text-xs text-green-600 font-fredoka font-medium">
                              -{product.subscription_discount_percentage || 0}%
                            </div>
                          </div>
                          
                          {/* Enhanced Quantity Selector */}
                          <div className="bg-soft-gray rounded-xl p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-fredoka font-medium text-charcoal">Quantity</span>
                              <div className="flex items-center gap-3 bg-white rounded-2xl px-3 py-1 shadow-sm">
                                <button
                                 onClick={() => handleQuantityChange(String(product.id), -1)}
                                  className="w-8 h-8 rounded-full bg-light-gray hover:bg-vibrant-orange hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-base font-fredoka font-bold w-8 text-center">
                                  {productQuantities[product.id] || 1}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(String(product.id), 1)}
                                  className="w-8 h-8 rounded-full bg-light-gray hover:bg-vibrant-orange hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Summary and Actions Section */}
                <motion.div 
                  className="bg-yellow-50 rounded-2xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Pricing Summary */}
                    <div>
                      <h4 className="text-lg font-semibold text-charcoal mb-4">Order Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-medium-gray">Products Total</span>
                          <span className="font-medium">
                            Rs. {confirmedProducts.reduce((total, product) => {
                              const qty = productQuantities[product.id] || 1
                              return total + (product.price * qty)
                            }, 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-green-600">
                          <span>Subscription Discount</span>
                          <span className="font-medium">
                            -Rs. {confirmedProducts.reduce((total, product) => {
                              const qty = productQuantities[product.id] || 1
                              const discountPercent = product.subscription_discount_percentage || 0
                              return total + (product.price * qty * (discountPercent / 100))
                            }, 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="pt-3 border-t-2 border-yellow-300">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-semibold text-charcoal">
                                {deliveryFrequency.charAt(0).toUpperCase() + deliveryFrequency.slice(1)} Total
                              </p>
                              <p className="text-sm text-medium-gray">
                                Delivered {deliveryFrequency === 'daily' ? 'every day' : deliveryFrequency === 'weekly' ? 'every week' : 'every month'}
                              </p>
                            </div>
                            <p className="text-3xl font-bold text-vibrant-orange">
                              Rs. {confirmedProducts.reduce((total, product) => {
                                const qty = productQuantities[product.id] || 1
                                const discountPercent = product.subscription_discount_percentage || 0
                                const discountMultiplier = 1 - (discountPercent / 100)
                                return total + (product.price * qty * discountMultiplier)
                              }, 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          if (startDate && endDate) {
                            // Map deliveryFrequency to intervalType expected by checkout
                            const intervalTypeMap: Record<string, string> = {
                              'daily': 'days',
                              'weekly': 'weekly',
                              'monthly': 'monthly'
                            };

                            handleConfirmSelection({
                              intervalType: intervalTypeMap[deliveryFrequency] || 'weekly',
                              intervalValue: 1,
                              startDate,
                              endDate,
                              deliveryPeriod: intervalTypeMap[deliveryFrequency] || 'weekly'
                            });
                          } else {
                            toast.error('Please select both start and end dates');
                          }
                        }}
                        disabled={!startDate || !endDate}
                        className={`w-full font-bold text-lg py-4 rounded-2xl transition-all duration-300 shadow-lg ${
                          startDate && endDate
                            ? 'bg-mint-green hover:bg-green-600 text-white transform hover:scale-105'
                            : 'bg-light-gray text-medium-gray cursor-not-allowed'
                        }`}
                      >
                        {startDate && endDate
                          ? 'Proceed to Checkout'
                          : 'Please select subscription dates'
                        }
                      </button>
                      
                      <button
                        onClick={handleOpenModal}
                        className="w-full bg-white hover:bg-soft-gray text-primary-blue font-medium py-3 rounded-2xl border-2 border-primary-blue transition-all"
                      >
                        Modify Product Selection
                      </button>
                      
                      <p className="text-center text-sm text-medium-gray">
                        <Plus className="inline h-4 w-4 rotate-45 text-green-500 mr-1" />
                        Free cancellation • Flexible scheduling • No hidden fees
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed inset-2 sm:inset-4 md:inset-6 z-50 flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white pointer-events-auto"
            >
              {/* Header */}
              <div className="relative overflow-hidden bg-primary-blue px-6 py-5 flex-shrink-0">
                <img src="/icons/illustrations/scribble-illustrations.png" alt="" aria-hidden className="absolute -top-3 -right-2 w-16 pointer-events-none select-none" style={{ opacity: 0.16, rotate: '22deg' }} />
                <img src="/icons/illustrations/small-hear-illustrations.png" alt="" aria-hidden className="absolute bottom-0 left-1/3 w-10 pointer-events-none select-none" style={{ opacity: 0.20, rotate: '-14deg' }} />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-2xl p-2">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-fredoka font-bold text-white leading-tight">
                        Build Your Subscription Box
                      </h2>
                      <p className="text-white/75 text-sm font-nunito">
                        Pick the products your pet loves — save on every delivery
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Selected count badge */}
                    {selectedProducts.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-sunny-yellow rounded-2xl px-4 py-2 flex items-center gap-2 shadow-md"
                      >
                        <Check className="h-4 w-4 text-charcoal" />
                        <span className="font-fredoka font-bold text-charcoal text-sm">
                          {selectedProducts.length} selected
                        </span>
                      </motion.div>
                    )}
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Filter Bar */}
              <div className="bg-white border-b border-light-gray px-6 py-3 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-fredoka font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                      selectedCategory === 'all'
                        ? 'bg-primary-blue text-white shadow-sm'
                        : 'bg-soft-gray text-medium-gray hover:bg-light-gray'
                    }`}
                  >
                    🐾 All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-fredoka font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                        selectedCategory === cat.slug
                          ? 'bg-primary-blue text-white shadow-sm'
                          : 'bg-soft-gray text-medium-gray hover:bg-light-gray'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Area */}
              <div className="flex-1 overflow-y-auto bg-off-white">
                {isLoadingProducts ? (
                  /* Skeleton grid */
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-100" />
                        <div className="p-3 space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                          <div className="h-4 bg-gray-100 rounded w-full" />
                          <div className="h-4 bg-gray-100 rounded w-3/4" />
                          <div className="h-8 bg-gray-100 rounded-xl mt-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="text-5xl">🐾</div>
                    <div className="text-center">
                      <p className="text-lg font-fredoka font-bold text-charcoal">No products found</p>
                      <p className="text-sm text-medium-gray mt-1">Try a different category</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {filteredProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isSelected={selectedProducts.some(p => p.id === product.id)}
                          quantity={productQuantities[product.id] || 1}
                          onToggle={handleProductToggle}
                          onViewDetails={handleViewProductDetails}
                          onQuantityChange={handleQuantityChange}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-xl transition-all ${
                            currentPage === 1
                              ? 'bg-light-gray text-medium-gray cursor-not-allowed'
                              : 'bg-white text-charcoal hover:bg-primary-blue hover:text-white shadow-sm'
                          }`}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-9 h-9 rounded-xl font-fredoka font-semibold text-sm transition-all ${
                                  currentPage === pageNum
                                    ? 'bg-primary-blue text-white shadow-sm'
                                    : 'bg-white text-charcoal hover:bg-soft-gray shadow-sm'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-xl transition-all ${
                            currentPage === totalPages
                              ? 'bg-light-gray text-medium-gray cursor-not-allowed'
                              : 'bg-white text-charcoal hover:bg-primary-blue hover:text-white shadow-sm'
                          }`}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        <span className="text-sm text-medium-gray font-fredoka ml-2">
                          {currentPage}/{totalPages}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-white border-t border-light-gray px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: summary */}
                  <div className="min-w-0">
                    {selectedProducts.length === 0 ? (
                      <p className="text-sm text-medium-gray font-fredoka">
                        Select at least one product to continue
                      </p>
                    ) : (
                      <div>
                        <p className="text-sm font-fredoka font-semibold text-charcoal">
                          {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} in your box
                        </p>
                        <p className="text-sm font-fredoka text-primary-blue font-semibold">
                          Subscription total: Rs.{' '}
                          {selectedProducts.reduce((total, product) => {
                            const qty = productQuantities[product.id] || 1;
                            const disc = product.subscription_discount_percentage || 0;
                            return total + product.price * qty * (1 - disc / 100);
                          }, 0).toFixed(2)}
                          {' '}<span className="text-xs text-medium-gray font-normal">/ delivery</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: actions */}
                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 bg-soft-gray hover:bg-light-gray text-charcoal font-fredoka font-medium rounded-xl transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={() => setIsScheduleModalOpen(true)}
                      disabled={selectedProducts.length === 0}
                      whileHover={selectedProducts.length > 0 ? { scale: 1.03 } : {}}
                      whileTap={selectedProducts.length > 0 ? { scale: 0.97 } : {}}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-fredoka font-bold text-sm transition-all ${
                        selectedProducts.length > 0
                          ? 'bg-sunny-yellow hover:brightness-95 text-charcoal shadow-md'
                          : 'bg-light-gray text-medium-gray cursor-not-allowed'
                      }`}
                    >
                      Next: Set Schedule
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsScheduleModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none"
            >
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
                {/* Header */}
                <div className="p-6" style={{ background: 'linear-gradient(135deg, #A4F7FF 0%, #78EEFF 100%)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-fredoka font-bold" style={{ color: '#004D6B' }}>Set Your Schedule</h2>
                      <p className="text-sm mt-0.5" style={{ color: '#004D6B', opacity: 0.7 }}>How often should we deliver?</p>
                    </div>
                    <button
                      onClick={() => setIsScheduleModalOpen(false)}
                      className="p-2 bg-white/40 hover:bg-white/60 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" style={{ color: '#004D6B' }} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Frequency Type - Visual Cards */}
                  <div>
                    <p className="text-sm font-fredoka font-semibold text-charcoal mb-3 uppercase tracking-wide">Frequency</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'weekly', label: 'Weekly', emoji: '📅', desc: 'Every week' },
                        { value: 'monthly', label: 'Monthly', emoji: '🗓️', desc: 'Every month' },
                        { value: 'custom', label: 'Custom', emoji: '⚙️', desc: 'Set your own' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setIntervalType(opt.value as 'weekly' | 'monthly' | 'custom');
                            setIntervalValue(opt.value === 'custom' ? 7 : 1);
                          }}
                          className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                            intervalType === opt.value
                              ? 'shadow-md'
                              : 'border-light-gray bg-white hover:border-gray-300'
                          }`}
                          style={intervalType === opt.value ? { borderColor: '#FF6B35', background: '#FFF4F0' } : {}}
                        >
                          <span className="text-2xl mb-1">{opt.emoji}</span>
                          <span className={`text-sm font-fredoka font-bold ${intervalType === opt.value ? '' : 'text-charcoal'}`}
                            style={intervalType === opt.value ? { color: '#FF6B35' } : {}}>
                            {opt.label}
                          </span>
                          <span className="text-xs text-medium-gray mt-0.5">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interval Value */}
                  <div>
                    <p className="text-sm font-fredoka font-semibold text-charcoal mb-3 uppercase tracking-wide">Interval</p>
                    <div className="grid grid-cols-2 gap-2">
                      {intervalType === 'weekly' && [
                        { v: 1, label: 'Every Week' },
                        { v: 2, label: 'Every 2 Weeks' },
                        { v: 3, label: 'Every 3 Weeks' },
                        { v: 4, label: 'Every 4 Weeks' },
                      ].map(opt => (
                        <button
                          key={opt.v}
                          onClick={() => setIntervalValue(opt.v)}
                          className={`py-2.5 px-4 rounded-xl text-sm font-fredoka font-medium transition-all border-2 ${
                            intervalValue === opt.v
                              ? 'text-white'
                              : 'bg-white border-light-gray text-charcoal hover:border-gray-300'
                          }`}
                          style={intervalValue === opt.v ? { background: '#FF6B35', borderColor: '#FF6B35' } : {}}
                        >
                          {opt.label}
                        </button>
                      ))}
                      {intervalType === 'monthly' && [
                        { v: 1, label: 'Every Month' },
                        { v: 2, label: 'Every 2 Months' },
                        { v: 3, label: 'Every 3 Months' },
                        { v: 6, label: 'Every 6 Months' },
                      ].map(opt => (
                        <button
                          key={opt.v}
                          onClick={() => setIntervalValue(opt.v)}
                          className={`py-2.5 px-4 rounded-xl text-sm font-fredoka font-medium transition-all border-2 ${
                            intervalValue === opt.v
                              ? 'text-white'
                              : 'bg-white border-light-gray text-charcoal hover:border-gray-300'
                          }`}
                          style={intervalValue === opt.v ? { background: '#FF6B35', borderColor: '#FF6B35' } : {}}
                        >
                          {opt.label}
                        </button>
                      ))}
                      {intervalType === 'custom' && [
                        { v: 7, label: 'Every 7 Days' },
                        { v: 14, label: 'Every 14 Days' },
                        { v: 21, label: 'Every 21 Days' },
                        { v: 30, label: 'Every 30 Days' },
                        { v: 45, label: 'Every 45 Days' },
                        { v: 60, label: 'Every 60 Days' },
                      ].map(opt => (
                        <button
                          key={opt.v}
                          onClick={() => setIntervalValue(opt.v)}
                          className={`py-2.5 px-4 rounded-xl text-sm font-fredoka font-medium transition-all border-2 ${
                            intervalValue === opt.v
                              ? 'text-white'
                              : 'bg-white border-light-gray text-charcoal hover:border-gray-300'
                          }`}
                          style={intervalValue === opt.v ? { background: '#FF6B35', borderColor: '#FF6B35' } : {}}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dates */}
                  {(() => {
                    // Minimum interval in days based on selected frequency
                    const intervalDays =
                      intervalType === 'weekly' ? intervalValue * 7 :
                      intervalType === 'monthly' ? intervalValue * 30 :
                      intervalValue;

                    // Minimum end date = start date + one full interval
                    const minEndDate = (() => {
                      if (!startDate) return new Date().toISOString().split('T')[0];
                      const d = new Date(startDate + 'T00:00:00');
                      d.setDate(d.getDate() + intervalDays);
                      return d.toISOString().split('T')[0];
                    })();

                    // Number of deliveries within the selected window
                    const deliveryCount = (() => {
                      if (!startDate || !endDate) return 0;
                      const diffDays = Math.floor(
                        (new Date(endDate + 'T00:00:00').getTime() - new Date(startDate + 'T00:00:00').getTime())
                        / 86400000
                      );
                      return diffDays < intervalDays ? 0 : Math.floor(diffDays / intervalDays) + 1;
                    })();

                    const endDateTooEarly = !!endDate && endDate < minEndDate;
                    const canConfirm = !!startDate && !!endDate && !endDateTooEarly;

                    return (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-fredoka font-semibold text-charcoal mb-1.5 block uppercase tracking-wide">
                              Start Date <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="date"
                              className="w-full border-2 border-light-gray rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': '#FF6B35' } as React.CSSProperties}
                              value={startDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={e => { setStartDate(e.target.value); setEndDate(''); }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-fredoka font-semibold text-charcoal mb-1.5 block uppercase tracking-wide">
                              End Date <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="date"
                              className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${endDateTooEarly ? 'border-red-400' : 'border-light-gray'}`}
                              style={{ '--tw-ring-color': '#FF6B35' } as React.CSSProperties}
                              min={minEndDate}
                              value={endDate}
                              disabled={!startDate}
                              onChange={e => setEndDate(e.target.value)}
                            />
                            {endDateTooEarly && (
                              <p className="text-xs text-red-400 mt-1 font-nunito">
                                Must be at least {intervalDays} days after start date to cover one delivery.
                              </p>
                            )}
                            {!startDate && (
                              <p className="text-xs text-medium-gray mt-1 font-nunito">Select a start date first.</p>
                            )}
                          </div>
                        </div>

                        {/* Summary pill */}
                        {startDate && endDate && !endDateTooEarly && (
                          <div className="rounded-2xl px-4 py-3 space-y-1" style={{ background: 'rgba(164,247,255,0.25)', border: '1px solid rgba(164,247,255,0.8)' }}>
                            <div className="flex items-center gap-3">
                              <Repeat className="h-4 w-4 flex-shrink-0" style={{ color: '#FF6B35' }} />
                              <p className="text-sm font-fredoka" style={{ color: '#004D6B' }}>
                                Delivering{' '}
                                <span className="font-bold" style={{ color: '#FF6B35' }}>
                                  {intervalType === 'weekly'
                                    ? `every ${intervalValue === 1 ? 'week' : `${intervalValue} weeks`}`
                                    : intervalType === 'monthly'
                                    ? `every ${intervalValue === 1 ? 'month' : `${intervalValue} months`}`
                                    : `every ${intervalValue} days`}
                                </span>
                                {' '}from{' '}
                                <span className="font-bold" style={{ color: '#FF6B35' }}>
                                  {new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                {' '}to{' '}
                                <span className="font-bold" style={{ color: '#FF6B35' }}>
                                  {new Date(endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </p>
                            </div>
                            <p className="text-xs font-fredoka pl-7" style={{ color: '#004D6B', opacity: 0.75 }}>
                              {deliveryCount} {deliveryCount === 1 ? 'delivery' : 'deliveries'} scheduled
                            </p>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => setIsScheduleModalOpen(false)}
                            className="flex-1 bg-soft-gray hover:bg-light-gray text-charcoal font-fredoka font-medium py-3 rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => {
                              setIsScheduleModalOpen(false);
                              handleConfirmSelection({
                                intervalType,
                                intervalValue,
                                startDate,
                                endDate,
                                deliveryPeriod: intervalType
                              });
                            }}
                            disabled={!canConfirm}
                            className={`flex-1 font-fredoka font-bold py-3 rounded-xl transition-all ${
                              canConfirm
                                ? 'text-white shadow-md hover:shadow-lg'
                                : 'bg-light-gray text-medium-gray cursor-not-allowed'
                            }`}
                            style={canConfirm ? { background: '#FF6B35' } : {}}
                          >
                            Confirm & Continue
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Subscription Details Modal */}
      <AnimatePresence>
        {showSubscriptionModal && selectedSubscription && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => {
                setShowSubscriptionModal(false);
                setShowConfirmCancel(false);
                setShowConfirmPause(false);
                setShowConfirmSkip(false);
                setShowRescheduleInput(false);
                setRescheduleDate('');
              }}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-primary-blue text-white p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedSubscription.name}</h2>
                      <p className="text-white/90 mt-1">Subscription ID: #{selectedSubscription.id}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowSubscriptionModal(false);
                        setShowConfirmCancel(false);
                        setShowConfirmPause(false);
                        setShowConfirmSkip(false);
                        setShowRescheduleInput(false);
                        setRescheduleDate('');
                      }}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {/* Subscription Status */}
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-medium-gray">Status</p>
                        <p className="font-semibold text-green-700">{selectedSubscription.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-medium-gray">Since</p>
                        <p className="font-medium">{new Date(selectedSubscription.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-charcoal mb-3">Delivery Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-soft-gray p-4 rounded-2xl">
                        <p className="text-sm text-medium-gray mb-1">Frequency</p>
                        <p className="font-medium">{selectedSubscription.frequency}</p>
                      </div>
                      <div className="bg-soft-gray p-4 rounded-2xl">
                        <p className="text-sm text-medium-gray mb-1">Next Delivery</p>
                        <p className="font-medium text-mint-green">
                          {selectedSubscription.nextDelivery ? new Date(selectedSubscription.nextDelivery).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="bg-soft-gray p-4 rounded-2xl md:col-span-2">
                        <p className="text-sm text-medium-gray mb-1">Delivery Address</p>
                        <p className="font-medium">{selectedSubscription.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Products in Subscription */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-charcoal mb-3">Products ({selectedSubscription.items.length})</h3>
                    <div className="space-y-3">
                      {selectedSubscription.items.map((item, index) => (
                        <div key={index} className="bg-soft-gray p-4 rounded-2xl flex justify-between items-center">
                          <div>
                            <p className="font-medium text-charcoal">{item.name}</p>
                            <p className="text-sm text-medium-gray">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-vibrant-orange">{item?.currency} {item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-300">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-medium-gray">Subtotal</span>
                        <span>
                          {typeof selectedProduct?.currency === 'object' ? (selectedProduct.currency as any)?.code || 'Rs.' : selectedProduct?.currency || 'Rs.'} {selectedSubscription.total + selectedSubscription.savedAmount}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Subscription Discount (10%)</span>
                        <span>
                          -{typeof selectedProduct?.currency === 'object' ? (selectedProduct.currency as any)?.code || 'Rs.' : selectedProduct?.currency || 'Rs.'} {selectedSubscription.savedAmount}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-yellow-400">
                        <span className="font-semibold">Total per {selectedSubscription.frequency}</span>
                        <span className="font-bold text-lg text-vibrant-orange">
                          {typeof selectedProduct?.currency === 'object' ? (selectedProduct.currency as any)?.code || 'Rs.' : selectedProduct?.currency || 'Rs.'}{selectedSubscription.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-soft-gray px-6 py-5 border-t border-light-gray space-y-4">

                  {/* Inline Reschedule */}
                  {showRescheduleInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-white rounded-2xl p-4 border-2 border-mint-green/40"
                    >
                      <p className="text-sm font-fredoka font-semibold text-charcoal mb-2">Pick a new delivery date</p>
                      <div className="flex gap-3 items-center">
                        <input
                          type="date"
                          value={rescheduleDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setRescheduleDate(e.target.value)}
                          className="flex-1 border-2 border-light-gray rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
                        />
                        <button
                          onClick={() => { if (rescheduleDate) handleReschedule(selectedSubscription.id, rescheduleDate); }}
                          disabled={!rescheduleDate}
                          className="bg-mint-green hover:bg-green-600 text-white font-fredoka font-medium px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => { setShowRescheduleInput(false); setRescheduleDate(''); }}
                          className="text-medium-gray hover:text-charcoal text-sm px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Inline Confirm Pause */}
                  {showConfirmPause && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-300"
                    >
                      <p className="text-sm font-fredoka font-semibold text-charcoal mb-3">⏸️ Pause this subscription?</p>
                      <p className="text-xs text-medium-gray mb-3">Your deliveries will stop until you resume. You can resume anytime.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePause(selectedSubscription.id)}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-fredoka font-medium py-2 rounded-xl text-sm transition-colors"
                        >
                          Yes, Pause
                        </button>
                        <button
                          onClick={() => setShowConfirmPause(false)}
                          className="flex-1 bg-white text-charcoal font-fredoka font-medium py-2 rounded-xl text-sm border border-light-gray transition-colors"
                        >
                          Keep Active
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Inline Confirm Skip */}
                  {showConfirmSkip && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200"
                    >
                      <p className="text-sm font-fredoka font-semibold text-charcoal mb-3">⏭️ Skip the next delivery?</p>
                      <p className="text-xs text-medium-gray mb-3">The following delivery will be scheduled automatically.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSkipDelivery(selectedSubscription.id)}
                          className="flex-1 bg-primary-blue hover:bg-blue-700 text-white font-fredoka font-medium py-2 rounded-xl text-sm transition-colors"
                        >
                          Yes, Skip
                        </button>
                        <button
                          onClick={() => setShowConfirmSkip(false)}
                          className="flex-1 bg-white text-charcoal font-fredoka font-medium py-2 rounded-xl text-sm border border-light-gray transition-colors"
                        >
                          Keep Delivery
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Inline Confirm Cancel */}
                  {showConfirmCancel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-red-50 rounded-2xl p-4 border-2 border-red-200"
                    >
                      <p className="text-sm font-fredoka font-semibold text-charcoal mb-3">🗑️ Cancel this subscription?</p>
                      <p className="text-xs text-medium-gray mb-3">This action is permanent and cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancel(selectedSubscription.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-fredoka font-medium py-2 rounded-xl text-sm transition-colors"
                        >
                          Yes, Cancel
                        </button>
                        <button
                          onClick={() => setShowConfirmCancel(false)}
                          className="flex-1 bg-white text-charcoal font-fredoka font-medium py-2 rounded-xl text-sm border border-light-gray transition-colors"
                        >
                          Keep Subscription
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Pills */}
                  {!showConfirmCancel && !showConfirmPause && !showConfirmSkip && !showRescheduleInput && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSubscription.status === 'Active' && (
                        <button
                          onClick={() => setShowConfirmPause(true)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-fredoka font-medium rounded-full text-sm transition-colors"
                        >
                          <PauseCircle className="h-4 w-4" />
                          Pause
                        </button>
                      )}
                      {selectedSubscription.status === 'Paused' && (
                        <button
                          onClick={() => handleResume(selectedSubscription.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-fredoka font-medium rounded-full text-sm transition-colors"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Resume
                        </button>
                      )}
                      {selectedSubscription.status === 'Active' && (
                        <button
                          onClick={() => setShowConfirmSkip(true)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-fredoka font-medium rounded-full text-sm transition-colors"
                        >
                          <SkipForward className="h-4 w-4" />
                          Skip Next
                        </button>
                      )}
                      {(selectedSubscription.status === 'Active' || selectedSubscription.status === 'Paused') && selectedSubscription.nextDelivery && (
                        <button
                          onClick={() => { setRescheduleDate(selectedSubscription.nextDelivery || ''); setShowRescheduleInput(true); }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 font-fredoka font-medium rounded-full text-sm transition-colors"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Reschedule
                        </button>
                      )}
                    </div>
                  )}

                  {/* Close / Cancel row */}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowSubscriptionModal(false);
                        setShowConfirmCancel(false);
                        setShowConfirmPause(false);
                        setShowConfirmSkip(false);
                        setShowRescheduleInput(false);
                        setRescheduleDate('');
                      }}
                      className="px-6 py-2 bg-white hover:bg-soft-gray text-charcoal font-fredoka font-medium rounded-full border border-light-gray transition-colors"
                    >
                      Close
                    </button>
                    {(selectedSubscription.status === 'Active' || selectedSubscription.status === 'Paused') && !showConfirmCancel && (
                      <button
                        onClick={() => setShowConfirmCancel(true)}
                        className="flex items-center gap-1.5 px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-fredoka font-medium rounded-full border border-red-200 text-sm transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Active Subscriptions Sidebar */}
      <ActiveSubscriptionsSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(!showSidebar)}
        subscriptions={activeSubscriptions}
        onSubscriptionClick={handleSubscriptionClick}
        onManageSubscription={handleManageSubscription}
      />

      {/* Product Details Modal */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (() => {
          const isOutOfStock = !selectedProduct.is_in_stock || selectedProduct.stock_quantity <= 0;
          const isAlreadyAdded = selectedProducts.some(p => p.id === selectedProduct.id);
          const currencyCode = typeof selectedProduct.currency === 'object'
            ? (selectedProduct.currency as any)?.code || 'Rs.'
            : selectedProduct.currency || 'Rs.';
          const subPrice = selectedProduct.subscription_discount_percentage && selectedProduct.subscription_discount_percentage > 0
            ? (selectedProduct.price * (1 - selectedProduct.subscription_discount_percentage / 100)).toFixed(2)
            : null;
          const minQty = selectedProduct.min_subscription_quantity || 1;
          const maxQty = Math.min(
            selectedProduct.stock_quantity || 99,
            selectedProduct.max_subscription_quantity || 99
          );
          const currentQty = Math.max(minQty, selectedProduct.quantity || minQty);
          const brandName = typeof selectedProduct.brand === 'object'
            ? (selectedProduct.brand as any)?.name
            : selectedProduct.brand;

          return (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setShowProductModal(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
              >
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

                  {/* ── Header ─────────────────────────────────────────── */}
                  <div className="relative flex-shrink-0 bg-primary-blue px-5 py-4 flex items-center gap-3">
                    <img
                      src="/icons/illustrations/scribble-illustrations.png"
                      alt="" aria-hidden="true"
                      className="absolute right-14 top-0 h-full w-auto opacity-10 pointer-events-none select-none"
                      style={{ rotate: '18deg' }}
                    />
                    <div className="bg-white/20 rounded-xl p-2 flex-shrink-0">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-fredoka font-bold text-base text-white leading-tight truncate">
                        {selectedProduct.name}
                      </h2>
                      <p className="text-white/60 text-xs font-nunito">Product Details</p>
                    </div>
                    <button
                      onClick={() => setShowProductModal(false)}
                      className="flex-shrink-0 p-2 bg-white/15 hover:bg-white/30 rounded-xl transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  {/* ── Body ───────────────────────────────────────────── */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-0">

                      {/* Image panel */}
                      <div className="bg-primary-blue/8 flex items-center justify-center p-8 md:min-h-[280px]" style={{ background: 'rgba(0,77,107,0.06)' }}>
                        <motion.img
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.12 }}
                          src={getProductImageSrc(selectedProduct)}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PRODUCT_PLACEHOLDER; }}
                          alt={selectedProduct.name}
                          className="max-h-52 max-w-full object-contain drop-shadow-lg"
                        />
                      </div>

                      {/* Info panel */}
                      <div className="p-6 flex flex-col gap-4">

                        {/* Name · Brand · Stock */}
                        <div>
                          <h3 className="text-2xl font-fredoka font-bold text-charcoal leading-tight">
                            {selectedProduct.name}
                          </h3>
                          {brandName && (
                            <p className="text-sm font-nunito text-medium-gray mt-0.5">
                              by{' '}
                              <span className="font-semibold text-primary-blue">{brandName}</span>
                            </p>
                          )}
                          <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-fredoka font-semibold ${
                            isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                          }`}>
                            {isOutOfStock ? '✗ Out of Stock' : '✓ In Stock'}
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="rounded-2xl border border-primary-blue/20 overflow-hidden" style={{ background: 'rgba(0,77,107,0.04)' }}>
                          <div className="px-4 py-3 flex items-baseline gap-1">
                            <span className="text-xs font-nunito text-medium-gray mr-1">Regular</span>
                            <span className="text-2xl font-fredoka font-bold text-charcoal">
                              {currencyCode} {selectedProduct.price?.toLocaleString()}
                            </span>
                          </div>
                          {subPrice && (
                            <div className="bg-primary-blue px-4 py-2.5 flex items-center justify-between">
                              <span className="text-xs font-fredoka font-semibold text-white/80">
                                Subscribe & Save {selectedProduct.subscription_discount_percentage}%
                              </span>
                              <span className="font-fredoka font-bold text-sunny-yellow text-base">
                                {currencyCode} {subPrice}
                                <span className="text-white/60 text-xs font-normal ml-1">/delivery</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Description — only if present */}
                        {selectedProduct.description && (
                          <div>
                            <p className="text-xs font-nunito font-semibold text-medium-gray uppercase tracking-wide mb-1">
                              Description
                            </p>
                            <p className="text-sm font-nunito text-medium-gray leading-relaxed line-clamp-4">
                              {selectedProduct.description}
                            </p>
                          </div>
                        )}

                        {/* Specs — only if data exists */}
                        {(selectedProduct.weight || selectedProduct.dimensions) && (
                          <div className="grid grid-cols-2 gap-2">
                            {selectedProduct.weight && (
                              <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-3 text-center">
                                <Package className="h-4 w-4 text-primary-blue mx-auto mb-1" />
                                <p className="text-xs font-nunito text-medium-gray">Weight</p>
                                <p className="font-fredoka font-bold text-primary-blue text-sm">{selectedProduct.weight} kg</p>
                              </div>
                            )}
                            {selectedProduct.dimensions && (
                              <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-3 text-center">
                                <Package className="h-4 w-4 text-primary-blue mx-auto mb-1" />
                                <p className="text-xs font-nunito text-medium-gray">Dimensions</p>
                                <p className="font-fredoka font-bold text-primary-blue text-xs">
                                  {selectedProduct.dimensions.length}×{selectedProduct.dimensions.width}×{selectedProduct.dimensions.height}
                                  <span className="text-medium-gray font-normal"> {selectedProduct.dimensions.unit || 'cm'}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    </div>
                  </div>

                  {/* ── Footer ─────────────────────────────────────────── */}
                  <div className="flex-shrink-0 border-t border-light-gray bg-white px-5 py-4">
                    <div className="flex items-center gap-3 flex-wrap">

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1 bg-soft-gray rounded-xl p-1">
                        <button
                          onClick={() => setSelectedProduct({ ...selectedProduct, quantity: Math.max(minQty, currentQty - 1) })}
                          disabled={isOutOfStock || currentQty <= minQty}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-primary-blue hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center font-fredoka font-bold text-charcoal text-sm select-none">
                          {currentQty}
                        </span>
                        <button
                          onClick={() => setSelectedProduct({ ...selectedProduct, quantity: Math.min(maxQty, currentQty + 1) })}
                          disabled={isOutOfStock || currentQty >= maxQty}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-primary-blue hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* CTA — three states */}
                      {isOutOfStock ? (
                        <button
                          disabled
                          className="flex-1 min-w-[140px] py-3 px-5 rounded-2xl font-fredoka font-bold text-sm bg-light-gray text-medium-gray cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      ) : isAlreadyAdded ? (
                        <>
                          {/* Update quantity for the product already in cart */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              setProductQuantities(prev => ({ ...prev, [selectedProduct.id]: currentQty }));
                              toast.success('Quantity updated');
                              setShowProductModal(false);
                            }}
                            className="flex-1 min-w-[140px] py-3 px-5 rounded-2xl font-fredoka font-bold text-sm bg-primary-blue text-white shadow-md hover:brightness-110 transition-all"
                          >
                            ✓ Update Quantity
                          </motion.button>
                          {/* Remove from subscription */}
                          <button
                            onClick={() => {
                              handleProductToggle(selectedProduct);
                              setShowProductModal(false);
                            }}
                            title="Remove from subscription"
                            className="py-3 px-4 bg-red-50 border-2 border-red-200 text-red-500 hover:bg-red-100 rounded-2xl transition-colors flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            handleProductToggle(selectedProduct);
                            setShowProductModal(false);
                          }}
                          className="flex-1 min-w-[140px] py-3 px-5 rounded-2xl font-fredoka font-bold text-sm bg-primary-blue text-white shadow-md hover:brightness-110 transition-all"
                        >
                          + Add to Subscription
                        </motion.button>
                      )}

                      {/* Close */}
                      <button
                        onClick={() => setShowProductModal(false)}
                        className="py-3 px-4 bg-soft-gray hover:bg-light-gray rounded-2xl font-fredoka font-medium text-charcoal text-sm transition-colors flex-shrink-0"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  )
}

// Inline SVG placeholder — no external dependency
const PRODUCT_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f5f5f5'/%3E%3Cpath d='M150 90a60 60 0 1 0 0 120 60 60 0 0 0 0-120zm0 108a48 48 0 1 1 0-96 48 48 0 0 1 0 96z' fill='%23d0d0d0'/%3E%3Ccircle cx='150' cy='135' r='18' fill='%23d0d0d0'/%3E%3Cpath d='M110 195c0-22 18-40 40-40s40 18 40 40' fill='%23d0d0d0'/%3E%3C/svg%3E";

const getProductImageSrc = (product: Product): string => {
  if (product.images && product.images.length > 0) {
    const url = product.images[0].url;
    return url.startsWith('http') ? url : PRODUCT_PLACEHOLDER;
  }
  if (!product.primary_image?.url) return PRODUCT_PLACEHOLDER;
  const url = product.primary_image.url;
  return url.startsWith('http') ? url : PRODUCT_PLACEHOLDER;
};

// Product Card Component for Modal
interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  quantity: number;
  onToggle: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onQuantityChange: (productId: string, change: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, quantity, onToggle, onViewDetails, onQuantityChange }) => {
  const isOutOfStock = !product.is_in_stock || product.stock_quantity <= 0;
  const brandName = typeof product.brand === 'string' ? product.brand : (product.brand as any)?.name || '';
  const subPrice = product.subscription_discount_percentage && product.subscription_discount_percentage > 0
    ? product.price * (1 - product.subscription_discount_percentage / 100)
    : null;

  return (
    <motion.div
      whileHover={!isOutOfStock ? { y: -3 } : {}}
      className={`relative bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-primary-blue shadow-lg shadow-blue-100'
          : 'shadow-sm hover:shadow-md'
      } ${isOutOfStock ? 'opacity-70' : ''}`}
    >
      {/* Image area */}
      <div
        className="relative aspect-square bg-soft-gray cursor-pointer overflow-hidden"
        onClick={() => !isOutOfStock && onToggle(product)}
      >
        <img
          src={getProductImageSrc(product)}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${!isOutOfStock ? 'group-hover:scale-105' : ''}`}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PRODUCT_PLACEHOLDER; }}
        />

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs font-fredoka font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Save badge */}
        {product.subscription_discount_percentage && product.subscription_discount_percentage > 0 && !isOutOfStock && (
          <div className="absolute top-2 left-2 bg-mint-green text-white text-[10px] font-fredoka font-bold px-2 py-0.5 rounded-full shadow">
            Save {product.subscription_discount_percentage}%
          </div>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 bg-primary-blue text-white rounded-full p-1 shadow-md"
          >
            <Check className="h-3.5 w-3.5" />
          </motion.div>
        )}

      </div>

      {/* Info area */}
      <div className="p-3 flex flex-col flex-1">
        {brandName && (
          <p className="text-[10px] font-fredoka font-semibold text-primary-blue uppercase tracking-wide truncate mb-0.5">
            {brandName}
          </p>
        )}
        <h3
          className="font-fredoka font-semibold text-charcoal text-sm leading-tight line-clamp-2 mb-2 flex-1 cursor-pointer hover:text-vibrant-orange transition-colors"
          onClick={() => !isOutOfStock && onToggle(product)}
        >
          {product.name}
        </h3>

        {/* Price block */}
        <div className="mb-2">
          {subPrice !== null ? (
            <>
              <p className="text-[11px] text-gray-400 line-through leading-none">
                LKR {product.price.toLocaleString()}
              </p>
              <p className="font-fredoka font-bold text-vibrant-orange text-base leading-tight">
                LKR {subPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </>
          ) : (
            <p className="font-fredoka font-bold text-vibrant-orange text-base">
              LKR {product.price.toLocaleString()}
            </p>
          )}
        </div>

        {/* View Details button */}
        <button
          onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 mb-2 rounded-xl text-xs font-fredoka font-semibold text-primary-blue bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </button>

        {/* Quantity controls — visible only when selected */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden mb-2"
            >
              <div className="flex items-center justify-between bg-soft-gray rounded-xl px-3 py-2">
                <span className="text-xs font-fredoka font-semibold text-charcoal">Qty</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onQuantityChange(String(product.id), -1); }}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-primary-blue hover:text-white text-charcoal flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center font-fredoka font-bold text-charcoal text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onQuantityChange(String(product.id), 1); }}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-primary-blue hover:text-white text-charcoal flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <button
          onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) onToggle(product); }}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded-xl text-sm font-fredoka font-bold transition-all ${
            isOutOfStock
              ? 'bg-soft-gray text-medium-gray cursor-not-allowed'
              : isSelected
                ? 'bg-red-50 hover:bg-red-100 text-red-500 border border-red-200'
                : 'bg-sunny-yellow hover:brightness-95 text-charcoal shadow-sm'
          }`}
        >
          {isOutOfStock ? 'Unavailable' : isSelected ? '✓ Added — Remove' : '+ Add to Box'}
        </button>
      </div>
    </motion.div>
  );
}

export default Subscriptions