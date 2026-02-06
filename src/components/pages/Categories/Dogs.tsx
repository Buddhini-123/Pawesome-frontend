import React from 'react';
import StandardCategoryPage from '../../common/StandardCategoryPage';
import { dogProducts, getDogFilters } from '../../../data/mockProducts';

const Dogs: React.FC = () => {
  return (
    <StandardCategoryPage
      title="Dog Products"
      description="Everything your canine companion needs for a happy and healthy life"
      products={dogProducts}
      filters={getDogFilters()}
      emptyStateIcon="🐕"
    />
  );
};

export default Dogs;