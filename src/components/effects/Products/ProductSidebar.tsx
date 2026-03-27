import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { api } from "../../../services/api";
import ProductCard from "./ProductCard";

interface RelatedProduct {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  image: string;
  discount?: number;
}

interface ProductSidebarProps {
  categoryId: number | null;
  currentProductId: string;
}

const ProductSidebar = ({ categoryId, currentProductId }: ProductSidebarProps) => {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);

    api.get(`/products?category_id=${categoryId}&per_page=6&active=true`)
      .then((res) => {
        const items = (res.data as any)?.data ?? [];
        const filtered: RelatedProduct[] = items
          .filter((p: any) => p.id.toString() !== currentProductId)
          .slice(0, 4)
          .map((p: any) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            brand: p.brand?.name || "",
            price: p.price,
            currency: p.currency || "Rs.",
            image: p.primary_image?.url || "/placeholder.png",
            discount: p.discount_percentage || undefined,
          }));
        setRelatedProducts(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryId, currentProductId]);

  if (!loading && relatedProducts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-blue to-blue-500 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white/90" />
          <h2 className="text-sm font-fredoka font-bold text-white uppercase tracking-wide">
            You Might Like
          </h2>
        </div>
      </div>

      {/* Cards */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-3">
        {loading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 items-center animate-pulse">
                <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))
          : relatedProducts.map((product, index) => (
              <div key={product.id}>
                <Link
                  to={`/product/${product.slug}`}
                  className="block rounded-xl p-2.5 hover:bg-soft-gray transition-colors duration-200"
                >
                  <ProductCard product={product} />
                </Link>
                {index < relatedProducts.length - 1 && (
                  <div className="hidden lg:block border-b border-light-gray mx-2 mt-1" />
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default ProductSidebar;
