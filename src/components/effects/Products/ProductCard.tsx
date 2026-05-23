interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  currency: string;
  image: string;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formattedPrice = parseFloat(product.price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex gap-3 items-center group">
      {/* Image */}
      <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-soft-gray">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <span className="absolute top-1 left-1 bg-crimson text-white text-[9px] font-fredoka font-bold px-1 rounded-full leading-4">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {product.brand && (
          <p className="text-[10px] font-fredoka font-semibold text-primary-blue uppercase tracking-wide truncate mb-0.5">
            {product.brand}
          </p>
        )}
        <h3 className="font-fredoka font-semibold text-charcoal text-sm leading-tight line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="font-fredoka font-bold text-vibrant-orange text-sm">
          {product.currency} {formattedPrice}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
