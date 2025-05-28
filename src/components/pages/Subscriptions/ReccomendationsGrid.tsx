import FeaturedDeals from '../../effects/FeaturedDeals.tsx';
import ProductGrid from '../../effects/ProductGrid.tsx';

const ReccomendationsGrid = () => {
  const topRecommendations = [
    {
      id: 1,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/pedigree.png"
    },
    {
      id: 2,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/pedigree.png"
    },
    {
      id: 3,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/pedigree.png"
    },
    {
      id: 4,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/pedigree.png"
    },
    {
      id: 5,
      name: "Pedigree Dog biscuit",
      price: "Rs. 2000.00",
      rating: 5,
      image: "/pedigree.png"
    },
  ];

  const regularProducts = Array.from({ length: 10 }, (_, index) => ({
    id: index + 7,
    name: "Pedigree Dog biscuit",
    price: "Rs. 2000.00",
    rating: 5,
    image: "/pedigree.png"
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Recommendations Section */}
        <div className="bg-warmorrange rounded-2xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-white text-xl font-semibold font-figtree">Top Recommendations</h2>
            <span className="ml-2 text-white text-lg">🔥</span>
          </div>
          <ProductGrid products={topRecommendations} />
        </div>

        {/* Regular Products Section */}
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-figtree">
            Products your furry friend will love
          </h2>
        </div>
        <ProductGrid products={regularProducts} />
         {/* Featured Deals Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 mt-6 font-figtree">
            Featured Deals of the week
          </h2>
          <a href="#" className="text-black underline font-figtree hover:text-blue-800">
            View all Deals
          </a>
        </div>
        <FeaturedDeals />
      </div>
    </div>
  );
};
export default ReccomendationsGrid;