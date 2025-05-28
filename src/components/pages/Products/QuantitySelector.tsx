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
        // variant="outline"
        // size="sm"
        onClick={decreaseQuantity}
        className="w-7 h-7 p-0 rounded border-gray-300"
      >
        <Minus className="w-3 h-3" />
      </button>
      
      <span className="w-8 text-center font-medium text-sm">
        {quantity}
      </span>
      
      <button
        // variant="outline"
        // size="sm"
        onClick={increaseQuantity}
        className="w-7 h-7 p-0 rounded border-gray-300"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
