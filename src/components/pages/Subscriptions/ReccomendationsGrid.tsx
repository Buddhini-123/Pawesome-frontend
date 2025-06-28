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
    <div className="min-h-screen">
      <div className="max-w-8xl mx-auto">
        {/* Top Recommendations Section */}
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal-gray mt-20">
            Trending Hot Picks For Your Pet!
          </h2>
        <div className="mt-10 bg-gradient-to-r from-energetic-orange to-calm-blue rounded-2xl p-8 md:p-12 text-center mb-10">
          <ProductGrid products={topRecommendations} />
        </div>

        {/* Regular Products Section */}
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-gray mb-4">
            Products Your Furry Friend Will Love
          </h2>
        <ProductGrid products={regularProducts} />
         {/* Featured Deals Section */}
        {/* <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 mt-6 font-figtree">
            Featured Deals of the week
          </h2>
          <a href="#" className="text-black underline font-figtree hover:text-blue-800">
            View all Deals
          </a>
        </div>
        <FeaturedDeals /> */}
      </div>
    </div>
  );
};
export default ReccomendationsGrid;