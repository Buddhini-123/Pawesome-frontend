import React from 'react';
import StandardCategoryPage from '../../common/StandardCategoryPage';
import { otherAnimalsProducts, getOtherAnimalsFilters } from '../../../data/mockProducts';

const OtherAnimals: React.FC = () => {
  // Pet Types Grid component
  const PetTypesGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
        <div className="text-3xl mb-2">🐰</div>
        <h3 className="text-sm font-fredoka font-semibold text-charcoal">Rabbits</h3>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
        <div className="text-3xl mb-2">🐹</div>
        <h3 className="text-sm font-fredoka font-semibold text-charcoal">Hamsters</h3>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
        <div className="text-3xl mb-2">🐠</div>
        <h3 className="text-sm font-fredoka font-semibold text-charcoal">Fish</h3>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
        <div className="text-3xl mb-2">🦎</div>
        <h3 className="text-sm font-fredoka font-semibold text-charcoal">Reptiles</h3>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
        <div className="text-3xl mb-2">🐾</div>
        <h3 className="text-sm font-fredoka font-semibold text-charcoal">Guinea Pigs</h3>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
        <div className="text-3xl mb-2">🦘</div>
        <h3 className="text-sm font-fredoka font-semibold text-charcoal">Ferrets</h3>
      </div>
    </div>
  );

  return (
    <StandardCategoryPage
      title="Other Animals"
      description="Products for rabbits, hamsters, fish, reptiles, and other beloved pets"
      products={otherAnimalsProducts}
      filters={getOtherAnimalsFilters()}
      headerIcon={<PetTypesGrid />}
      emptyStateIcon="🐾"
    />
  );
};

export default OtherAnimals;