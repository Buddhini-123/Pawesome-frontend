import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api, host } from "../../../services/api";
import ProductGallery from "../../effects/Products/ProductGallery";
import ProductDetails from "../../effects/Products/ProductDetails";
import ProductSidebar from "../../effects/Products/ProductSidebar";
import ProductTabs from "./ProductTabs";

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        const p = res.data.data.product;

        const images = [];
        if (p.images && p.images.length > 0) {
          p.images.forEach((img) => {
            images.push(`${host}${img.url}`);
          });
        } else if (p.primary_image?.url) {
          images.push(`${host}${p.primary_image.url}`);
        } else {
          images.push("/placeholder.png");
        }

        setProduct({
          id: p.id.toString(),
          name: p.name,
          brand: p.brand?.name || "",
          price: parseFloat(p.price),
          image: images[0],
          gallery: images, // <-- add gallery
          rating: parseFloat(p.rating_avg) || 0,
          reviews: p.review_count || 0,
          category: p.category?.name || "",
          subcategory: "",
          inStock: p.is_in_stock,
          description: p.description || "",
          currency: p.currency,
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
          <div className="lg:col-span-10 space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* ✅ Product Gallery */}
              <div className="lg:col-span-5">
                <ProductGallery
                  images={product?.gallery || ["/placeholder.png"]}
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                />
              </div>

              {/* ✅ Product Details */}
              <div className="lg:col-span-7">
                <ProductDetails
                  product={product}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>
            </div>

            <ProductTabs product={product}/>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <ProductSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
