import { useState } from "react";

interface ProductTabsProps {
  product: {
    description?: string;
    reviews?: number;
    rating?: number;
    name?: string;
  };
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Tabs List */}
      <div className="grid w-full gap-x-3 grid-cols-2 rounded-xl bg-gray-100 p-1 h-10">
        <button
          onClick={() => setActiveTab("description")}
          className={`rounded-lg py-2 text-sm font-fredoka transition-colors duration-200 ${
            activeTab === "description"
              ? "bg-vibrant-orange text-white shadow-sm"
              : "text-black hover:bg-gray-200"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`rounded-lg py-2 text-sm font-fredoka transition-colors duration-200 ${
            activeTab === "review"
              ? "bg-vibrant-orange text-white shadow-sm"
              : "text-black hover:bg-gray-200"
          }`}
        >
          Review
        </button>
      </div>

      {/* Tabs Content */}
      {activeTab === "description" && (
        <div className="mt-4 space-y-3">
          {product.description ? (
            <p className="text-charcoal text-sm font-fredoka leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          ) : (
            <p className="text-gray-500 text-sm font-fredoka italic">
              No description available for this product.
            </p>
          )}
        </div>
      )}

      {activeTab === "review" && (
        <div className="mt-4 text-center text-charcoal py-4">
          {product.reviews && product.reviews > 0 ? (
            <>
              <p className="text-sm font-fredoka">
                This product has {product.reviews} review
                {product.reviews > 1 ? "s" : ""}.
              </p>
              <p className="text-xs text-gray-500">
                Average rating: ⭐ {product.rating?.toFixed(1) || 0}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-fredoka">
                No customer reviews yet.
              </p>
              <p className="mt-1 text-xs font-fredoka text-gray-500">
                Be the first to review {product.name}!
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
