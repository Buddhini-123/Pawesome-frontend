import { ProductCard } from "./ProductCard";

export const ProductSidebar = () => {
  const relatedProducts = [
    {
      id: 1,
      name: "Pedigree Dog Biscuit",
      price: "Rs. 2000.00",
      rating: 4.5,
      image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
    },
    {
      id: 2,
      name: "Pedigree Dog Biscuit",
      price: "Rs. 2000.00",
      rating: 4.5,
      image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
    },
    {
      id: 3,
      name: "Pedigree Dog Biscuit",
      price: "Rs. 2000.00",
      rating: 4.5,
      image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
    },
    {
      id: 4,
      name: "Pedigree Dog Biscuit",
      price: "Rs. 2000.00",
      rating: 4.5,
      image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
    }
  ];

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Things you might like</h2>
      <div className="space-y-3">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};