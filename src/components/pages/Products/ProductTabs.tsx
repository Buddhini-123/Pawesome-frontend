import { useState } from "react";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Tabs List */}
      <div className="grid w-full grid-cols-2 bg-gray-100 rounded-md p-1 h-8">
        <button
          onClick={() => setActiveTab("description")}
          className={`rounded text-xs transition-colors duration-200 ${
            activeTab === "description"
              ? "bg-orange-500 text-white"
              : "text-gray-700"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`rounded text-xs transition-colors duration-200 ${
            activeTab === "review"
              ? "bg-orange-500 text-white"
              : "text-gray-700"
          }`}
        >
          Review
        </button>
      </div>

      {/* Tabs Content */}
      {activeTab === "description" && (
        <div className="mt-4 space-y-3">
          <p className="text-gray-700 text-sm leading-relaxed">
            Pawsome Premium Chicken & Rice Dog Food is specially formulated to provide balanced nutrition for adult dogs of
            all breeds. Made with high-quality chicken as the first ingredient and wholesome rice for easy digestion, this
            formula supports strong muscles, healthy skin, and a shiny coat.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Enriched with essential vitamins, minerals, and omega fatty acids, it ensures your furry friend gets the nutrients
            they need for an active, happy life. Free from artificial colors, flavors, and preservatives.
          </p>
        </div>
      )}

      {activeTab === "review" && (
        <div className="mt-4 text-center text-gray-500 py-4">
          <p className="text-sm">Customer reviews will be displayed here.</p>
          <p className="mt-1 text-xs">Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};
export default ProductTabs;