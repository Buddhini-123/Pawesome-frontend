import { useState } from "react";

const ProductTabs = () => {
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
          className={`rounded py-2 px-4 text-sm border transition-colors duration-200 ${
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
          <p className="text-charcoal text-sm font-fredoka leading-relaxed">
            Pawsome Premium Chicken & Rice Dog Food is specially formulated to provide balanced nutrition 
            for adult dogs of all breeds. Made with high-quality chicken as the first ingredient and wholesome 
            rice for easy digestion, this formula supports strong muscles, healthy skin, and a shiny coat. 
            Enriched with essential vitamins, minerals, and omega fatty acids, it ensures your furry friend gets 
            the nutrients they need for an active, happy life. Free from artificial colors, flavors, and preservatives, 
            Pawsome is a delicious and nourishing choice your dog will love at every meal.

            Pawsome Premium Chicken & Rice Dog Food is specially formulated to provide balanced nutrition for adult dogs 
            of all breeds. Made with high-quality chicken as the first ingredient and wholesome rice for easy digestion, 
            this formula supports strong muscles, healthy skin, and a shiny coat.
            </p>
            
        </div>
      )}

      {activeTab === "review" && (
        <div className="mt-4 text-center text-charcoal py-4">
          <p className="text-sm font-fredoka">Customer reviews will be displayed here.</p>
          <p className="mt-1 text-xs font-fredoka">Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};
export default ProductTabs;