import React, { useEffect, useState } from 'react';
import FeaturedDeals from '../../effects/FeaturedDeals';
import ProductGrid from '../../effects/ProductGrid';
import {api, host} from "../../../services/api"

const ReccomendationsGrid = () => {
  const [regularProducts, setRegularProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const products = res.data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: `Rs. ${parseFloat(p.price).toLocaleString()}`,
          rating: parseFloat(p.rating_avg) || 0,
          image: p.primary_image?.url 
            ? `${host}${p.primary_image.url}`
            : '/placeholder.png'  ,
          slug: p.slug           
        }));
        setRegularProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  return (
    <div className="min-h-screen">
      <div className="max-w-8xl mx-auto">
        {/* Top Recommendations Section */}
        <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-charcoal-gray mt-20">
            Trending Hot Picks For Your Pet!
          </h2>
        <div className="mt-10 bg-vibrant-orange rounded-2xl p-8 md:p-12 text-center mb-10">
          <ProductGrid products={topRecommendations} />
        </div>

        {/* Regular Products Section */}
          <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-charcoal-gray mb-4">
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