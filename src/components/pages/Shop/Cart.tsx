import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { formatters } from '../../../utils/formatters';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const getShippingCost = (): number => {
    return totalPrice >= 20000 ? 0 : 150;
  };

  const getFinalTotal = (): number => {
    return totalPrice + getShippingCost();
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">My Cart</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-12 text-center max-w-2xl mx-auto">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <button 
              onClick={handleContinueShopping}
              className="bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium px-8 py-3 rounded-full transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">My Cart</h1>
          <p className="text-lg text-gray-600">
            {formatters.pluralize(totalItems, 'item')} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex items-center space-x-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{item.product.brand}</p>
                      <p className="text-lg font-bold text-green-600 mt-1">
                        {formatters.currency(item.product.price)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full transition-colors"
                        disabled={item.quantity >= 99}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {formatters.currency(item.product.price * item.quantity)}
                      </p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatters.currency(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {getShippingCost() === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatters.currency(getShippingCost())
                    )}
                  </span>
                </div>
                
                {totalPrice < 20000 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-700">
                      Add {formatters.currency(20000 - totalPrice)} more for FREE shipping!
                    </p>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatters.currency(getFinalTotal())}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-800 font-semibold py-3 rounded-lg transition-colors mb-4"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={handleContinueShopping}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Secure checkout powered by industry-standard encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;