import { useState } from "react";
import ProductGallery  from "../../effects/Products/ProductGallery.tsx";
import ProductDetails from "../../effects/Products/ProductDetails.tsx";
import ProductSidebar from "../../effects/Products/ProductSidebar.tsx";
import ProductTabs from "./ProductTabs.tsx"
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
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
