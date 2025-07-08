import React from 'react';
import StandardCategoryPage from '../../common/StandardCategoryPage';
import { catProducts, getCatFilters } from '../../../data/mockProducts';

const Cats: React.FC = () => {
  return (
    <StandardCategoryPage
      title="Cat Products"
      description="Premium products for your feline friends"
      products={catProducts}
      filters={getCatFilters()}
      emptyStateIcon="🐱"
    />
  );
};

export default Cats;