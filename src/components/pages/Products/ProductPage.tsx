import { useState } from "react";
import ProductGallery  from "../../effects/Products/ProductGallery.tsx";
import ProductDetails from "../../effects/Products/ProductDetails.tsx";
import ProductSidebar from "../../effects/Products/ProductSidebar.tsx";

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
          {/* Left Column - Product Gallery */}
          <div className="lg:col-span-4">
            <ProductGallery 
              images={productImages}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />
          </div>

          {/* Middle Column - Product Details */}
          <div className="lg:col-span-6">
            <ProductDetails quantity={quantity} onQuantityChange={setQuantity} />
            <div className="mt-6">
              {/* <ProductTabs /> */}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-2">
            <ProductSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
