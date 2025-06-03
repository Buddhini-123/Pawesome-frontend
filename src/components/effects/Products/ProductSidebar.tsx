import ProductCard from "./ProductCard.tsx";
import { Link } from 'react-router-dom';

const ProductSidebar = () => {
  const relatedProducts = [
    {
      id: 1,
      name: "Pedigree Dog Biscuit",
      price: "2000.00",
      rating: 4.5,
      image: "/pedigree.png"
    },
    {
      id: 2,
      name: "Pedigree Dog Biscuit",
      price: "2000.00",
      rating: 4.5,
      image: "/pedigree.png"
    },
    {
      id: 3,
      name: "Pedigree Dog Biscuit",
      price: "2000.00",
      rating: 4.5,
      image: "/pedigree.png"
    }
  ];

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Things you might like</h2>
      <div className="space-y-3">
        {relatedProducts.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow block">
            <ProductCard key={product.id} product={product} />
          </Link>
        ))}
      </div>
    </div>

  );
};
export default ProductSidebar;