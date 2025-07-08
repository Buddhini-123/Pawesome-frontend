import { useState } from "react";
import ProductGallery  from "../../effects/Products/ProductGallery";
import ProductDetails from "../../effects/Products/ProductDetails";
import ProductSidebar from "../../effects/Products/ProductSidebar";
import ProductTabs from "./ProductTabs"
const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productImages = [
    "/pedigree.png",
    "/pedigree.png",
    "/pedigree.png",
    "/pedigree.png",
  ];

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content (10/12 columns) */}
          <div className="lg:col-span-10 space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Product Gallery */}
              <div className="lg:col-span-5">
                <ProductGallery
                  images={productImages}
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                />
              </div>

              {/* Product Details */}
              <div className="lg:col-span-7">
                <ProductDetails
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>
            </div>

            {/* Product Tabs (below gallery/details) */}
            <ProductTabs />
          </div>

          {/* Right Column - Sidebar (2/12 columns) */}
          <div className="lg:col-span-2">
            <ProductSidebar />
          </div>
        </div>
      </div>
    </div>


  );
};
export default ProductPage;
