import { Minus, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChange }: QuantitySelectorProps) => {
  const decreaseQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={decreaseQuantity}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-blue text-white hover:bg-primary-blue/90 transition-colors shadow-sm"
      >
        <Minus className="w-3 h-3" />
      </button>
      
      <span className="w-10 text-center font-fredoka font-medium text-vibrant-orange text-sm">
        {quantity}
      </span>
      
      <button
        onClick={increaseQuantity}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-blue text-white hover:bg-primary-blue/90 transition-colors shadow-sm"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
