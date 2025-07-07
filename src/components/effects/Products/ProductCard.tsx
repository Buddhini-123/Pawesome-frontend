import StarRating from "../StarRating/StarRating";

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

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex flex-col items-center text-center hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
      <div className="w-24 h-24 flex items-center justify-center mb-2">
        <img src={product.image} alt={product.name}
          className="object-contain w-full h-16" />
      </div>

      <h3 className="font-fredoka font-medium text-mint-green text-sm mb-1 truncate">
        {product.name}
      </h3>

      <div className="mb-1">
        <StarRating rating={product.rating} size="sm" />
      </div>

      <p className="font-fredoka font-medium text-vibrant-orange text-sm">
        Rs. {product.price}
      </p>
    </div>

  );
};
export default ProductCard;