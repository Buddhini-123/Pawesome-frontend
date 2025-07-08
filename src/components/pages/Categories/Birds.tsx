import React from 'react';
import StandardCategoryPage from '../../common/StandardCategoryPage';
import { birdProducts, getBirdFilters } from '../../../data/mockProducts';

const Birds: React.FC = () => {
  return (
    <StandardCategoryPage
      title="Bird Products"
      description="Special care products for your feathered companions"
      products={birdProducts}
      filters={getBirdFilters()}
      emptyStateIcon="🦜"
    />
  );
};

export default Birds;