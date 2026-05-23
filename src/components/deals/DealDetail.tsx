import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, Tag, Star, Heart,
  ChevronDown, ChevronUp, Info, ShoppingCart, Loader2, CheckCircle,
} from "lucide-react";
import { Deal } from "../../types/deals";
import { Product } from "../../types";
import { api, host } from "../../services/api";
import { toast } from "react-toastify";
import { useCart } from "../../hooks/useCart";

interface LocalProduct {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  salePrice?: number;
  primary_image: { url: string };
  price: number;
  description: string;
  brand?: string;
  rating?: number;
  reviews?: number;
  category?: string;
  subcategory?: string;
  inStock?: boolean;
}

// ── Small floating illustrations for the hero panel ────────────────
const HERO_ILLUSTS = [
  { src: 'heart-illustrations.png',      style: { top: '8%',  right: '12%', width: 70,  opacity: 0.55 }, dur: 4,  rot: [0, 10, 0]  },
  { src: 'small-hear-illustrations.png', style: { top: '18%', left: '8%',   width: 50,  opacity: 0.50 }, dur: 3.4,rot: [-8, 6, -8] },
  { src: 'scribble-illustrations.png',   style: { bottom: '14%', left: '6%',width: 80,  opacity: 0.18 }, dur: 7,  rot: [20, 28, 20] },
  { src: 'hypnotize-illustrations.png',  style: { bottom: '20%', right: '8%',width: 60, opacity: 0.22 }, dur: 12, rot: [0, 360]    },
];

const DealDetail: React.FC = () => {
  const { slug }    = useParams<{ slug: string }>();
  const navigate    = useNavigate();
  const [deal, setDeal]               = useState<Deal | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [showMore, setShowMore]       = useState(false);
  const [products, setProducts]       = useState<LocalProduct[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);

  const canClaim  = deal?.user_data?.can_claim  ?? true;
  const hasClaimed = deal?.user_data?.has_claimed ?? false;

  // ── Fetch deal ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    const fetchDeal = async () => {
      try {
        const res      = await api.get(`/deals/${slug}`);
        const dealData = (res.data as any).data;
        const now      = new Date();
        const start    = dealData.start_date ? new Date(dealData.start_date) : null;
        const end      = dealData.end_date   ? new Date(dealData.end_date)   : null;
        if (start && start > now) setError(`This deal hasn't started yet. It will begin on ${start.toLocaleDateString()}`);
        else if (end && end < now) setError(`This deal has expired. It ended on ${end.toLocaleDateString()}`);
        setDeal(dealData);
      } catch {
        setError("Failed to load deal");
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [slug]);

  // ── Fetch deal products ────────────────────────────────────────────
  useEffect(() => {
    if (!deal?.applies_to) return;
    const fetchProducts = async () => {
      try {
        const requests: Promise<any>[] = [];
        if (deal.applies_to.is_universal) {
          requests.push(api.get(`/products?page=1&per_page=12`));
        } else {
          if (deal.applies_to.products?.length)
            requests.push(api.get(`/products?ids=${deal.applies_to.products.join(",")}`));
          deal.applies_to.categories?.forEach((id: string | number) =>
            requests.push(api.get(`/products?category_id=${id}&per_page=100`)));
          deal.applies_to.brands?.forEach((id: string | number) =>
            requests.push(api.get(`/products?brand_id=${id}&per_page=100`)));
        }
        if (!requests.length) requests.push(api.get(`/products?page=1&per_page=12`));

        const responses = await Promise.all(requests);
        const merged    = responses
          .flatMap(r => (r.data as any).data || [])
          .reduce((acc: any[], p: any) => {
            if (!acc.find(x => x.id === p.id)) acc.push(p);
            return acc;
          }, []);
        setProducts(merged);
      } catch {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [deal]);

  // ── Handlers ───────────────────────────────────────────────────────
  const handleClaim = async () => {
    if (!deal || deal.user_data?.has_claimed) return;
    try {
      const res = await api.post(`/deals/${deal.slug}/claim`);
      if ((res.data as any).status === "success") {
        setDeal(prev => prev ? {
          ...prev,
          user_data: {
            ...prev.user_data,
            has_claimed: true, can_claim: false,
            claimed_at: (res.data as any).data.claim.claimed_at,
          },
          usage_count: prev.usage_count + 1,
          usage_statistics: {
            ...prev.usage_statistics,
            total_claims:    prev.usage_statistics.total_claims + 1,
            remaining_uses:  prev.usage_statistics.remaining_uses - 1,
            usage_percentage: prev.usage_statistics.usage_percentage + 1,
          },
        } : prev);
        toast.success((res.data as any).message);
      }
    } catch {
      toast.error("Failed to claim the deal");
    }
  };

  const { addItem, addDeal } = useCart();

  const handleAddDealToCart = async () => {
    if (!deal) return;
    setAddingToCart(true);
    try {
      await addDeal(deal.slug);
      toast.success("Deal added to cart! Discount will be applied at checkout.");
    } catch (err: any) {
      const msg: string = err?.message ?? '';
      if (msg.toLowerCase().includes('already in your cart') || err?.response?.status === 400) {
        toast.info("This deal is already in your cart.");
      } else {
        toast.error("Failed to add deal to cart. Please try again.");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-primary-blue flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 border-4 border-sunny-yellow border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────
  if (!deal) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-6 bg-primary-blue/10 rounded-3xl mb-5">
            <Tag className="w-14 h-14 text-primary-blue" />
          </div>
          <h1 className="text-2xl font-fredoka font-bold text-charcoal mb-3">Deal Not Found</h1>
          <button
            onClick={() => navigate('/deals')}
            className="bg-primary-blue text-white px-6 py-3 rounded-2xl font-fredoka font-bold hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  const discountRaw  = (deal as any).discount_value ?? deal.discount;
  const discountNum  = discountRaw ? Number(discountRaw) : null;
  const isPercentage = ((deal as any).discount_type ?? deal.discountType) === 'percentage';
  const discountBadge = discountNum
    ? `${discountNum}${isPercentage ? '%' : ' Rs'} OFF`
    : 'Special Deal';

  return (
    <div className="min-h-screen bg-warm-white">

      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <div className="bg-primary-blue">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/deals')}
            className="flex items-center gap-2 text-white/80 hover:text-white font-fredoka font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Deals
          </button>
        </div>
      </div>

      {/* ── Hero panel (primary-blue, matching Gifts hero) ────────────── */}
      <section className="relative overflow-hidden bg-primary-blue pb-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Left — deal showcase card */}
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
                border: '1.5px solid rgba(255,255,255,0.20)',
                minHeight: 380,
                boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              }}
            >
              {/* Floating illustrations */}
              {HERO_ILLUSTS.map((il, i) => (
                <motion.img
                  key={i}
                  src={`/icons/illustrations/${il.src}`}
                  alt="" aria-hidden
                  className="absolute pointer-events-none select-none"
                  style={il.style as React.CSSProperties}
                  animate={{ y: [0, -10, 0], rotate: il.rot as any }}
                  transition={{ duration: il.dur, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}

              {/* Dog illustration */}
              <motion.img
                src="/icons/illustrations/dog-illustrations.png"
                alt="" aria-hidden
                className="absolute bottom-0 right-0 pointer-events-none select-none hidden md:block"
                style={{ width: '52%', opacity: 0.55 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 pt-10 flex flex-col h-full" style={{ minHeight: 380 }}>
                {/* Discount badge */}
                {discountNum && (
                  <motion.div
                    className="inline-flex items-center gap-2 bg-sunny-yellow text-charcoal font-fredoka font-bold px-5 py-2 rounded-2xl self-start mb-6 shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 14 }}
                  >
                    <span className="text-xl">{discountBadge}</span>
                  </motion.div>
                )}

                <h1 className="font-fredoka font-bold text-white leading-tight mb-3" style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)' }}>
                  {deal.title}
                </h1>
                <p className="font-nunito text-white/70 text-base leading-relaxed mb-6" style={{ maxWidth: 280 }}>
                  {deal.subtitle}
                </p>

                {/* Checklist */}
                <div className="flex flex-col gap-2.5">
                  {[
                    deal.end_date && `Valid until ${new Date(deal.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
                    'Premium quality products',
                    deal.deal_type === 'bogo' && `Buy ${(deal as any).buy_qty || 1} Get ${(deal as any).get_qty || 1} Free`,
                    products.length > 0 && `${products.length} product${products.length !== 1 ? 's' : ''} available`,
                  ].filter(Boolean).map((text, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-sunny-yellow flex-shrink-0" />
                      <span className="font-nunito text-white/80 text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — info + actions */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
              className="py-6 lg:py-10 flex flex-col gap-6"
            >
              {/* Deal type badge */}
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white px-4 py-2 rounded-full font-fredoka font-semibold self-start">
                <Tag className="w-4 h-4 text-sunny-yellow" />
                {deal.display_description}
              </div>

              <div>
                <h2 className="text-2xl font-fredoka font-bold text-white mb-3">About This Deal</h2>
                <p className="font-nunito text-white/75 text-base leading-relaxed">{deal.description}</p>
              </div>

              {/* Deal details card */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.20)' }}
              >
                <h3 className="font-fredoka font-semibold text-white text-lg mb-1">Deal Details</h3>
                {deal.end_date && (
                  <div className="flex items-center gap-3 text-white/80">
                    <Clock className="w-5 h-5 text-sunny-yellow flex-shrink-0" />
                    <span className="font-nunito text-sm">
                      Valid until {new Date(deal.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-white/80">
                  <Star className="w-5 h-5 text-sunny-yellow flex-shrink-0" />
                  <span className="font-nunito text-sm">Premium quality products included</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Heart className="w-5 h-5 text-sunny-yellow flex-shrink-0" />
                  <span className="font-nunito text-sm">Perfect for all dog breeds and sizes</span>
                </div>
                {deal.deal_type === 'bogo' && (
                  <div className="flex items-center gap-3 text-white/80">
                    <Info className="w-5 h-5 text-sunny-yellow flex-shrink-0" />
                    <span className="font-nunito text-sm">Buy {(deal as any).buy_qty || 1} Get {(deal as any).get_qty || 1}</span>
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={handleAddDealToCart}
                  disabled={addingToCart}
                  whileHover={!addingToCart ? { scale: 1.03 } : {}}
                  whileTap={!addingToCart ? { scale: 0.97 } : {}}
                  className={`w-full px-8 py-4 rounded-2xl font-fredoka font-bold text-lg transition-all flex justify-center items-center gap-2 shadow-lg
                    ${addingToCart
                      ? 'bg-white/30 text-white/60 cursor-not-allowed'
                      : 'bg-sunny-yellow text-charcoal hover:shadow-xl'}`}
                >
                  {addingToCart ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Adding...</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5" />Add Deal to Cart</>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setShowMore(v => !v)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-fredoka font-semibold hover:bg-white/15 transition-all flex justify-center items-center gap-2"
                >
                  {showMore ? 'Show Less' : 'Learn More'}
                  {showMore ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </motion.button>
              </div>

              {/* Error state */}
              {error && (
                <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-white/80 font-nunito text-sm">{error}</p>
                </div>
              )}

              {/* Expandable additional info */}
              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="rounded-2xl p-5"
                      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.20)' }}
                    >
                      <h3 className="font-fredoka font-semibold text-white text-lg mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-sunny-yellow" />
                        Additional Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-nunito text-white/75 text-sm">
                        {deal.start_date && <p><span className="font-semibold text-white">Start:</span> {new Date(deal.start_date).toLocaleDateString("en-GB")}</p>}
                        {deal.end_date   && <p><span className="font-semibold text-white">End:</span> {new Date(deal.end_date).toLocaleDateString("en-GB")}</p>}
                        {deal.sri_lankan_formatting?.discount_display        && <p><span className="font-semibold text-white">Discount:</span> {deal.sri_lankan_formatting.discount_display}</p>}
                        {deal.sri_lankan_formatting?.minimum_purchase_display && <p><span className="font-semibold text-white">Min Purchase:</span> {deal.sri_lankan_formatting.minimum_purchase_display}</p>}
                        {deal.sri_lankan_formatting?.maximum_discount_display && <p><span className="font-semibold text-white">Max Discount:</span> {deal.sri_lankan_formatting.maximum_discount_display}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Products section ──────────────────────────────────────────── */}
      {products.length > 0 && (
        <section className="bg-sky-light py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h2 className="font-fredoka font-bold text-3xl md:text-4xl mb-2" style={{ color: '#004D6B' }}>
                Products in This Deal
              </h2>
              <p className="font-nunito text-lg" style={{ color: '#004D6B', opacity: 0.70 }}>
                {products.length} product{products.length !== 1 ? 's' : ''} with special discount pricing
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, i) => {
                const price          = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
                const discountedPrice = isPercentage
                  ? price - (price * (discountNum ?? 0)) / 100
                  : price - (discountNum ?? 0);
                const savings         = price - discountedPrice;
                const savingsPct      = price > 0 ? ((savings / price) * 100).toFixed(0) : '0';

                const handleAddToCart = () => {
                  const cartProduct: Product = {
                    id:          product.id.toString(),
                    name:        product.name,
                    image:       product.image,
                    price,
                    brand:       product.brand || 'Unknown',
                    rating:      product.rating || 0,
                    reviews:     product.reviews || 0,
                    category:    product.category || 'General',
                    subcategory: product.subcategory || 'General',
                    inStock:     product.inStock ?? true,
                  };
                  addItem(cartProduct, 1);
                  toast.success(`Added ${product.name} to cart!`);
                };

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30, scale: 0.93 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-20px' }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.4, delay: (i % 4) * 0.07, ease: 'easeOut' }}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={product.primary_image ? `${host}${product.primary_image.url}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={product.name}
                        className="w-full h-44 object-cover"
                      />
                      {savings > 0 && (
                        <div className="absolute top-3 right-3 bg-primary-blue text-white px-3 py-1 rounded-full text-xs font-fredoka font-bold shadow">
                          -{savingsPct}%
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-fredoka font-semibold text-charcoal mb-1 line-clamp-2 flex-1">
                        {product.name}
                      </h4>
                      {product.brand && (
                        <p className="text-xs text-medium-gray font-nunito mb-2">
                          {typeof product.brand === 'object' ? (product.brand as any)?.name : product.brand}
                        </p>
                      )}
                      <div className="mb-4">
                        <span className="font-fredoka font-bold text-xl" style={{ color: '#004D6B' }}>
                          Rs. {discountedPrice.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm line-through text-gray-400 font-nunito">Rs. {price.toFixed(2)}</span>
                          {savings > 0 && (
                            <span className="text-xs font-fredoka font-bold text-[#48FFF2]" style={{ color: '#00897B' }}>
                              Save Rs. {savings.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <motion.button
                        onClick={handleAddToCart}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-primary-blue hover:bg-primary-blue/90 text-white px-4 py-2.5 rounded-2xl text-sm font-fredoka font-bold transition-colors flex items-center justify-center gap-2 shadow"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DealDetail;
