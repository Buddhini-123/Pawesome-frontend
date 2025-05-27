import StarRating from "./StarRating/StarRating.tsx";

interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-contain"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1 text-center">
            {product.name}
          </h3>
          <div className="flex justify-center mb-2">
            <StarRating rating={product.rating} size="sm" />
          </div>
          <p className="text-orange-600 font-medium text-center">{product.price}</p>
        </div>
      ))}
    </div>
  );
};
export default ProductGrid;
