import React from 'react';
import { AlertCircle } from 'lucide-react';
import StandardCategoryPage from '../../common/StandardCategoryPage';
import { vetDietProducts, getVetDietFilters } from '../../../data/mockProducts';

const VetDiet: React.FC = () => {
  // Important Notice component
  const ImportantNotice = () => (
    <div className="bg-sunny-yellow/20 border-l-4 border-sunny-yellow p-6 mb-8 rounded-lg">
      <div className="flex items-center mb-2">
        <AlertCircle className="w-6 h-6 text-vibrant-orange mr-3" />
        <h3 className="text-lg font-fredoka font-semibold text-charcoal">Important Notice</h3>
      </div>
      <p className="text-charcoal/80">
        Veterinary diets should only be used under the supervision of a qualified veterinarian. 
        Please consult your vet before switching to any specialized diet.
      </p>
    </div>
  );

  return (
    <StandardCategoryPage
      title="Veterinary Diet Products"
      description="Specialized therapeutic diets for pets with specific health needs"
      products={vetDietProducts}
      filters={getVetDietFilters()}
      headerIcon={<ImportantNotice />}
      emptyStateIcon="⚕️"
    />
  );
};

export default VetDiet;