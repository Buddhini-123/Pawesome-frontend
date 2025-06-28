import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { formatters } from '../../../utils/formatters';
import { orderService } from '../../../services/order.service';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface CheckoutForm {
  // Shipping Information
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  // Payment Information
  paymentMethod: 'card' | 'upi' | 'cod';
  cardDetails?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
  upiId?: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CheckoutForm>({
    shippingAddress: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    paymentMethod: 'card'
  });

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login', { state: { from: { pathname: '/checkout' } } });
    return null;
  }

  // Redirect to cart if empty
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const shippingCost = totalPrice >= 20000 ? 0 : 150;
  const finalTotal = totalPrice + shippingCost;

  const handleShippingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };

  const handlePaymentMethodChange = (method: 'card' | 'upi' | 'cod') => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method,
      cardDetails: undefined,
      upiId: undefined
    }));
  };

  const validateShipping = () => {
    const { fullName, phone, address, city, state, pincode } = formData.shippingAddress;
    if (!fullName || !phone || !address || !city || !state || !pincode) {
      setError('Please fill all shipping details');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (formData.paymentMethod === 'card' && formData.cardDetails) {
      const { number, name, expiry, cvv } = formData.cardDetails;
      if (!number || !name || !expiry || !cvv) {
        setError('Please fill all card details');
        return false;
      }
      if (!/^\d{16}$/.test(number.replace(/\s/g, ''))) {
        setError('Please enter a valid 16-digit card number');
        return false;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError('Please enter a valid CVV');
        return false;
      }
    } else if (formData.paymentMethod === 'upi' && !formData.upiId) {
      setError('Please enter your UPI ID');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1 && validateShipping()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setError('');
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setError('');
    if (!validatePayment()) return;

    setIsProcessing(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        subtotal: totalPrice,
        shippingCost,
        totalAmount: finalTotal
      };

      const order = await orderService.createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${step >= 1 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            <div className={`mx-8 w-24 h-1 ${step >= 2 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center max-w-2xl mx-auto">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 ? (
              /* Shipping Information */
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.fullName}
                        onChange={(e) => handleShippingChange('fullName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.shippingAddress.phone}
                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={formData.shippingAddress.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      rows={3}
                      placeholder="House no., Building, Street, Area"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.pincode}
                        onChange={(e) => handleShippingChange('pincode', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="6-digit pincode"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => navigate('/cart')}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back to Cart
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Information */
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                
                {/* Payment Method Selection */}
                <div className="space-y-4 mb-6">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => handlePaymentMethodChange('card')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-gray-500">Pay securely with your card</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={() => handlePaymentMethodChange('upi')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">UPI</div>
                      <div className="text-sm text-gray-500">Pay with Google Pay, PhonePe, etc.</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when you receive your order</div>
                    </div>
                  </label>
                </div>

                {/* Payment Details based on method */}
                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <p className="text-sm text-amber-700">
                        Demo Mode: Use any test card number (e.g., 4111 1111 1111 1111)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardDetails?.number || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          cardDetails: {
                            ...prev.cardDetails!,
                            number: e.target.value
                          }
                        }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.cardDetails?.name || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          cardDetails: {
                            ...prev.cardDetails!,
                            name: e.target.value
                          }
                        }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={formData.cardDetails?.expiry || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            cardDetails: {
                              ...prev.cardDetails!,
                              expiry: e.target.value
                            }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={formData.cardDetails?.cvv || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            cardDetails: {
                              ...prev.cardDetails!,
                              cvv: e.target.value
                            }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'upi' && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="yourname@paytm"
                      value={formData.upiId || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        upiId: e.target.value
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                {formData.paymentMethod === 'cod' && (
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-700">
                      ₹50 additional charges apply for Cash on Delivery
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handlePreviousStep}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium">
                      {formatters.currency(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatters.currency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatters.currency(shippingCost)
                    )}
                  </span>
                </div>
                {formData.paymentMethod === 'cod' && (
                  <div className="flex justify-between">
                    <span>COD Charges</span>
                    <span>{formatters.currency(50)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatters.currency(finalTotal + (formData.paymentMethod === 'cod' ? 50 : 0))}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm">Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;