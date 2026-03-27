import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../services/api";
import ProductGallery from "../../effects/Products/ProductGallery";
import ProductDetails from "../../effects/Products/ProductDetails";
import ProductSidebar from "../../effects/Products/ProductSidebar";
import ProductTabs from "./ProductTabs";

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  category: string;
  subcategory: string;
  inStock: boolean;
  description: string;
  currency: string;
  subscription_enabled: boolean;
}

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        const p = (res.data as any).data.product;

        const images: string[] = [];
        if (p.images && p.images.length > 0) {
          p.images.forEach((img: { url: string }) => {
            images.push(img.url);
          });
        } else if (p.primary_image?.url) {
          images.push(p.primary_image.url);
        } else {
          images.push("/placeholder.png");
        }

        setCategoryId(p.category?.id || null);

        setProduct({
          id: p.id.toString(),
          slug: p.slug,
          name: p.name,
          brand: p.brand?.name || "",
          price: parseFloat(p.price),
          originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
          discount: p.discount_percentage || undefined,
          image: images[0],
          gallery: images,
          rating: parseFloat(p.rating_avg) || 0,
          reviews: p.review_count || 0,
          category: p.category?.name || "",
          subcategory: "",
          inStock: p.is_in_stock ?? p.stock_quantity > 0,
          description: p.description || "",
          currency: p.currency,
          subscription_enabled: p.subscription_enabled || false,
        });
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-9 space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-6">
              {/* Product Gallery */}
              <div className="lg:col-span-5">
                <ProductGallery
                  images={product.gallery}
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                />
              </div>

              {/* Product Details */}
              <div className="lg:col-span-7">
                <ProductDetails
                  product={product}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>
            </div>

            <ProductTabs product={product} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <ProductSidebar categoryId={categoryId} currentProductId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
