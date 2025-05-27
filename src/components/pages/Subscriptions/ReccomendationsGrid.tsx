// import { ProductGrid } from "../components/ProductGrid";

const ReccomendationsGrid = () => {
  const topRecommendations = [
    {
      id: 1,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
    },
    {
      id: 2,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
    },
    {
      id: 3,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
    },
    {
      id: 4,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
    },
    {
      id: 5,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
    },
    {
      id: 6,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
    }
  ];

  const regularProducts = Array.from({ length: 20 }, (_, index) => ({
    id: index + 7,
    name: "Pedigree Dog biscuit",
    price: "Rs. 2000.00",
    rating: 5,
    image: "/lovable-uploads/29c58067-632b-45b5-8762-bc1b33610457.png"
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Recommendations Section */}
        <div className="bg-warmorrange rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-white text-xl font-semibold">Top Recommendations</h2>
            <span className="ml-2 text-white text-lg">🔥</span>
          </div>
          {/* <ProductGrid products={topRecommendations} /> */}
        </div>

        {/* Regular Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Products your furry friend will love
          </h2>
          {/* <ProductGrid products={regularProducts} /> */}
        </div>
      </div>
    </div>
  );
};
export default ReccomendationsGrid;