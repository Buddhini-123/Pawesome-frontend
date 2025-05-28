import { StarRating } from "./StarRating";

interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-8 h-8 object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 text-xs truncate">{product.name}</h3>
        <StarRating rating={product.rating} size="sm" />
        <p className="font-medium text-orange-600 text-xs mt-1">{product.price}</p>
      </div>
    </div>
  );
};
