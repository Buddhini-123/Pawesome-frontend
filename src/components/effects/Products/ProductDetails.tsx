import React from "react";
import { Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { QuantitySelector } from "../../pages/Products/QuantitySelector";
import { useCart } from "../../../hooks/useCart";

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

interface ProductDetailsProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  quantity,
  onQuantityChange,
}) => {
  const { addItem } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product as any, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
      {/* Brand */}
      {product.brand && (
        <p className="text-sm font-fredoka font-semibold text-primary-blue">
          {product.brand}
        </p>
      )}

      {/* Product Title */}
      <h1 className="text-2xl font-fredoka font-bold text-gray-900">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-2xl font-fredoka font-bold text-vibrant-orange">
          {product.currency} {product.price.toFixed(2)}
        </span>
        {product.originalPrice && (
          <span className="text-sm text-gray-400 line-through font-fredoka mb-1">
            {product.currency} {product.originalPrice.toFixed(2)}
          </span>
        )}
        {product.discount && (
          <span className="text-sm font-fredoka font-bold text-white bg-crimson px-2 py-0.5 rounded-full mb-1">
            -{product.discount}% OFF
          </span>
        )}
      </div>

      {/* Subscription / Delivery Period — only shown for subscription-enabled products */}
      {product.subscription_enabled && (
        <div className="space-y-3 border border-mint-green/30 bg-teal-50 rounded-xl p-4">
          <h3 className="font-fredoka font-medium text-gray-900 flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-mint-green" />
            Subscribe & Save
          </h3>
          <select className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-mint-green">
            <option>Every Week</option>
            <option>Every 2 Weeks</option>
            <option>Every Month</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-fredoka font-medium text-gray-700 mb-1 block">
                From
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-fredoka font-medium text-gray-700 mb-1 block">
                To
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={onQuantityChange}
          />
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full font-fredoka font-medium py-3 rounded-xl transition-colors ${
            product.inStock
              ? "bg-vibrant-orange hover:bg-sunny-yellow hover:text-charcoal text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
