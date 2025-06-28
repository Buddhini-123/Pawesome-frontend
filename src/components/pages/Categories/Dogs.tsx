import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CategoryCard {
  emoji: string;
  title: string;
  description: string;
  category: string;
}

const Dogs: React.FC = () => {
  const navigate = useNavigate();

  const dogCategories: CategoryCard[] = [
    {
      emoji: '🦴',
      title: 'Dog Food',
      description: 'Premium nutrition for all dog breeds and ages',
      category: 'food'
    },
    {
      emoji: '🎾',
      title: 'Toys & Accessories',
      description: 'Fun toys and essential accessories for your dog',
      category: 'toys'
    },
    {
      emoji: '🏥',
      title: 'Health & Care',
      description: 'Supplements and healthcare products',
      category: 'health'
    }
  ];

  const handleCategoryClick = (category: string) => {
    // Navigate to shop with dog category filter
    navigate(`/shop?animal=dog&category=${category}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dogs</h1>
          <p className="text-lg text-gray-600">
            Everything your canine companion needs for a happy and healthy life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">{category.emoji}</div>
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <button 
                onClick={() => handleCategoryClick(category.category)}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Shop Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dogs;