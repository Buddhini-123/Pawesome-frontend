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
        className="w-7 h-7 flex items-center justify-center rounded bg-calm-blue text-white"
      >
        <Minus className="w-3 h-3" />
      </button>
      
      <span className="w-8 text-center font-medium text-energetic-orange text-sm">
        {quantity}
      </span>
      
      <button
        onClick={increaseQuantity}
        className="w-7 h-7 flex items-center justify-center rounded bg-calm-blue text-white"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
