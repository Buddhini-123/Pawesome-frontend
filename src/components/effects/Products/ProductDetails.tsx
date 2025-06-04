import { Calendar } from "lucide-react";
import StarRating from "../StarRating/StarRating.tsx";
import { QuantitySelector } from "../../pages/Products/QuantitySelector.tsx";

interface ProductDetailsProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductDetails = ({ quantity, onQuantityChange }: ProductDetailsProps) => {
  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl font-figtree font-bold text-gray-900 mb-1">
          Rocco Naturals Natural Ox Ear Snacks for Dogs
        </h1>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">1 Pcs</p>
        <div className="flex items-center space-x-2">
          <StarRating rating={4.7} size="sm" />
          <span className="text-orange-500 font-figtree text-sm">4.7</span>
        </div>
      </div>
      

      {/* Delivery Period */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900 flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Delivery Period
        </h3>
        <select className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-400">
          <option>Every Week</option>
          <option>Every 2 Weeks</option>
          <option>Every Month</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-start">
          <label className="text-xs font-medium text-gray-900 mb-1">From</label>
          <input
            type="date"
            defaultValue="2025-06-03"
            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-xs font-medium text-gray-900 mb-1">To</label>
          <input
            type="date"
            defaultValue="2025-06-10"
            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Price and Add to Cart */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-energetic-orange">Rs. 2000</span>
          <QuantitySelector quantity={quantity} onQuantityChange={onQuantityChange} />
        </div>
        
        <button className="w-full bg-energetic-orange hover:bg-orange-600 text-white font-medium py-2 rounded">
          Add to Cart
        </button>
      </div>
    </div>
  );
};
export default ProductDetails;