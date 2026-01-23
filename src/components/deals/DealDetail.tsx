import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Tag, Star, Heart, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Deal } from "../../types/deals";
import { Product } from "../../types";
import { api, host } from "../../services/api";
import { toast } from 'react-toastify';
import { useCart } from "../../hooks/useCart";

interface LocalProduct {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  salePrice?: number;
  primary_image: Image;
  price: number;
  description: string;
  brand?: string;
  rating?: number;
  reviews?: number;
  category?: string;
  subcategory?: string;
  inStock?: boolean;
}

interface Image {
  url: string;
}


const DealDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => setShowMore(!showMore);

  const canClaim = deal?.user_data?.can_claim ?? true;
  const hasClaimed = deal?.user_data?.has_claimed ?? false;
  const [products, setProducts] = useState<LocalProduct[]>([]);

  useEffect(() => {
    if (!slug) return;

    const fetchDeal = async () => {
      try {
        const res = await api.get(`/deals/${slug}`);
        const dealData = (res.data as any).data;
        setDeal(dealData);
      } catch (err) {
        console.error(err);
        setError("Failed to load deal");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [slug]);

  console.log(deal, 'llllll');
  

  useEffect(() => {
    if (!deal?.applies_to) return;

    const fetchProducts = async () => {
      try {
        const requests = [];

        if (deal.applies_to.products?.length) {
          const ids = deal.applies_to.products.join(",");
          requests.push(api.get(`/products?ids=${ids}`));
        }

        if (deal.applies_to.categories?.length) {
          deal.applies_to.categories.forEach((categoryId: string) => {
            requests.push(api.get(`/products?category_id=${categoryId}`));
          });
        }

        if (deal.applies_to.brands?.length) {
          deal.applies_to.brands.forEach((brandId: string) => {
            requests.push(api.get(`/products?brand_id=${brandId}`));
          });
        }

        const responses = await Promise.all(requests);

        // 🔥 Merge & de-duplicate products
        const mergedProducts = responses
          .flatMap((res) => (res.data as any).data)
          .reduce((acc: any[], product: any) => {
            if (!acc.find((p) => p.id === product.id)) {
              acc.push(product);
            }
            return acc;
          }, []);

        setProducts(mergedProducts);
      } catch (err) {
        console.error("Failed to fetch deal products", err);
      }
    };

    fetchProducts();
  }, [deal]);

  const handleClaim = async () => {
    if (!deal || deal.user_data?.has_claimed) return;

    try {
      const res = await api.post(`/deals/${deal.slug}/claim`);
      if ((res.data as any).status === "success") {
        setDeal(prev => prev ? {
          ...prev,
          user_data: {
            ...prev.user_data,
            has_claimed: true,
            can_claim: false,
            claimed_at: (res.data as any).data.claim.claimed_at,
          },
          usage_count: prev.usage_count + 1,
          usage_statistics: {
            ...prev.usage_statistics,
            total_claims: prev.usage_statistics.total_claims + 1,
            remaining_uses: prev.usage_statistics.remaining_uses - 1,
            usage_percentage: prev.usage_statistics.usage_percentage + 1,
          }
        } : prev);

        toast.success((res.data as any).message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to claim the deal");
    }
  };

  const { addItem } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 font-fredoka">Loading deal details...</p>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-fredoka font-bold text-charcoal mb-4">Deal Not Found</h1>
          <button 
            onClick={() => navigate('/deals')}
            className="bg-vibrant-orange text-white px-6 py-3 rounded-lg font-fredoka hover:bg-vibrant-orange/90 transition-colors"
          >
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/deals')}
            className="flex items-center text-charcoal hover:text-vibrant-orange transition-colors font-fredoka"
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
          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative bg-vibrant-orange rounded-2xl overflow-hidden h-96"
            >
              <img 
                src={deal.image || '/api/placeholder/400/400'} 
                alt={deal.title}
                className="absolute right-0 top-0 h-full w-1/2 object-cover"
              />
              <div className="absolute inset-0 bg-vibrant-orange/70"></div>
              <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                <h1 className="text-white font-fredoka font-bold text-3xl leading-tight mb-4">{deal.title}</h1>
                <p className="text-white text-lg opacity-90 font-fredoka">{deal.subtitle}</p>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center bg-vibrant-orange/10 text-vibrant-orange px-4 py-2 rounded-full font-fredoka font-medium">
                <Tag className="w-4 h-4 mr-2" /> {deal.display_description}
              </div>

              <div>
                <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-4">About This Deal</h2>
                <p className="text-charcoal text-lg leading-relaxed font-fredoka">{deal.description}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-fredoka font-semibold text-charcoal mb-4">Deal Details</h3>
                <div className="space-y-3">
                  {deal.end_date && (
                    <div className="flex items-center text-charcoal">
                      <Clock className="w-5 h-5 mr-3 text-vibrant-orange" />
                      <span className="font-fredoka"> Valid until {new Date(deal.end_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Star className="w-5 h-5 mr-3 text-vibrant-orange" />
                    <span className="font-fredoka">Premium quality products included</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Heart className="w-5 h-5 mr-3 text-vibrant-orange" />
                    <span className="font-fredoka">Perfect for all dog breeds and sizes</span>
                  </div>
                  {deal.deal_type == 'bogo' && (
                    <div className="flex items-center text-charcoal">
                      <Info className="w-5 h-5 mr-3 text-vibrant-orange" />
                      <span className="font-fredoka"> Buy {(deal as any).buy_qty || 1} Get {(deal as any).get_qty || 1}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <button
                  onClick={handleClaim}
                  disabled={hasClaimed || !canClaim}
                  className={`flex-1 px-8 py-4 rounded-lg font-fredoka font-semibold transition-colors
                    ${(hasClaimed || !canClaim)
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-vibrant-orange text-white hover:bg-vibrant-orange/90'}`}
                >
                  {hasClaimed ? "Claimed" : "Claim This Deal"}
                </button> */}

                <button
                  onClick={toggleShowMore}
                  className="flex-1 border-2 border-vibrant-orange text-vibrant-orange px-8 py-4 rounded-lg font-fredoka font-semibold hover:bg-vibrant-orange hover:text-white transition-all flex justify-center items-center gap-2"
                >
                  Learn More
                  {showMore ? <ChevronUp className="w-5 h-5 transition-transform" /> : <ChevronDown className="w-5 h-5 transition-transform" />}
                </button>

                <AnimatePresence>
                  {showMore && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden bg-white rounded-xl p-6 shadow-sm border border-light-gray"
                    >
                      <h3 className="text-xl font-fredoka font-semibold text-charcoal mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-vibrant-orange" />
                        Additional Deal Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 font-fredoka text-charcoal">
                        <p><span className="font-semibold">Start Date:</span> {new Date(deal.start_date).toLocaleDateString("en-GB")}</p>
                        <p><span className="font-semibold">End Date:</span> {new Date(deal.end_date).toLocaleDateString("en-GB")}</p>
                        <p><span className="font-semibold">Discount Value:</span> {deal.sri_lankan_formatting?.discount_display}</p>
                        <p><span className="font-semibold">Minimum Purchase:</span> {deal.sri_lankan_formatting?.minimum_purchase_display}</p>
                        <p><span className="font-semibold">Maximum Discount:</span> {deal.sri_lankan_formatting?.maximum_discount_display}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              <h3 className="text-2xl font-fredoka font-bold text-charcoal mb-6">
                Products Included in This Deal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                    const discountedPrice =
                      deal.discountType === "percentage"
                        ? product.price - (product.price * parseFloat(deal.discount_value)) / 100
                        : product.price - parseFloat(deal.discount_value);

                    const handleAddToCart = () => {
                        const quantity = 1; // default to 1 for now
                        const cartProduct: Product = {
                          id: product.id.toString(),
                          name: product.name,
                          image: product.image,
                          price: discountedPrice,
                          brand: product.brand || 'Unknown',
                          rating: product.rating || 0,
                          reviews: product.reviews || 0,
                          category: product.category || 'General',
                          subcategory: product.subcategory || 'General',
                          inStock: product.inStock ?? true
                        };
                        addItem(cartProduct, quantity);
                        toast.success(`Added ${product.name} to cart!`);
                      };

                    return (
                      <div
                        key={product.id}
                        className="border border-light-gray rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={
                            product.primary_image
                              ? `${host}${product.primary_image.url}`
                              : "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          alt={product.name}
                          className="rounded-lg h-32 w-full object-cover mb-4"
                        />
                        <h4 className="font-fredoka font-semibold text-charcoal mb-2">
                          {product.name}
                        </h4>
                        <p className="text-charcoal text-sm mb-3 font-fredoka">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-fredoka font-bold text-vibrant-orange">
                              Rs.{discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-sm line-through text-gray-400 font-fredoka">
                              Rs.{product.price}
                            </span>
                          </div>

                          <button onClick={handleAddToCart} className="bg-vibrant-orange text-white px-4 py-2 rounded-lg text-sm font-fredoka hover:bg-vibrant-orange/90 transition-colors">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
           </motion.div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default DealDetail;
