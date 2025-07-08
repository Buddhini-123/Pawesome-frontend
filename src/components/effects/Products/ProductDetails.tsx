import { Calendar } from "lucide-react";
import StarRating from "../StarRating/StarRating";
import { QuantitySelector } from "../../pages/Products/QuantitySelector";
import { useCart } from "../../../hooks/useCart";
import { Product } from "../../../types";

interface ProductDetailsProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  product?: Product;
}

const ProductDetails = ({ quantity, onQuantityChange, product }: ProductDetailsProps) => {
  const { addItem } = useCart();
  
  // Default product data for demo purposes
  const defaultProduct: Product = {
    id: '1',
    name: 'Rocco Naturals Natural Ox Ear Snacks for Dogs',
    brand: 'Rocco Naturals',
    price: 2000,
    image: '/pedigree.png',
    rating: 4.7,
    reviews: 150,
    category: 'Dogs',
    subcategory: 'Treats',
    inStock: true,
    description: 'Natural ox ear snacks for dogs'
  };
  
  const currentProduct = product || defaultProduct;
  
  const handleAddToCart = () => {
    addItem(currentProduct, quantity);
    
    // Optional: Show success message or notification
    alert(`Added ${quantity} ${currentProduct.name} to cart!`);
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl font-fredoka font-bold text-gray-900 mb-1">
          {currentProduct.name}
        </h1>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">1 Pcs</p>
        <div className="flex items-center space-x-2">
          <StarRating rating={currentProduct.rating} size="sm" />
          <span className="text-vibrant-orange font-fredoka text-sm">{currentProduct.rating}</span>
        </div>
      </div>
      

      {/* Delivery Period */}
      <div className="space-y-3">
        <h3 className="font-fredoka font-medium text-gray-900 flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Delivery Period
        </h3>
        <select className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-vibrant-orange">
          <option>Every Week</option>
          <option>Every 2 Weeks</option>
          <option>Every Month</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-start">
          <label className="text-xs font-fredoka font-medium text-gray-900 mb-1">From</label>
          <input
            type="date"
            defaultValue="2025-06-03"
            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-vibrant-orange"
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-xs font-fredoka font-medium text-gray-900 mb-1">To</label>
          <input
            type="date"
            defaultValue="2025-06-10"
            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-vibrant-orange"
          />
        </div>
      </div>

      {/* Price and Add to Cart */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-fredoka font-bold text-vibrant-orange">Rs. {currentProduct.price}</span>
          <QuantitySelector quantity={quantity} onQuantityChange={onQuantityChange} />
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full bg-vibrant-orange hover:bg-sunny-yellow hover:text-charcoal text-white font-fredoka font-medium py-3 rounded-xl transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
export default ProductDetails;