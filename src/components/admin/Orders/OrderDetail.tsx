import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone,
  Mail,
  Calendar,
  Edit2,
  Save,
  XCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { formatters } from '../../../utils/formatters';
import { adminOrderService } from '../../../services/adminOrder.service';
import { Badge } from '../ui/Badge';

interface OrderDetailProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, isOpen, onClose, onStatusUpdate }) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    try {
      setIsUpdating(true);
      await onStatusUpdate(order.id, newStatus);
      setIsEditingStatus(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
      case 'processing':
        return <Package className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: OrderStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'processing':
        return 'info';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const timeline = adminOrderService.getOrderTimeline(order);

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'processing';
      case 'processing':
        return 'shipped';
      case 'shipped':
        return 'delivered';
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-2">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatters.date(order.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatters.time(order.createdAt)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="bg-soft-gray rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-fredoka font-semibold">Order Status</h3>
              {!isEditingStatus && order.status !== 'delivered' && order.status !== 'cancelled' && (
                <button
                  onClick={() => setIsEditingStatus(true)}
                  className="text-primary-blue hover:text-blue-700 flex items-center gap-1 text-sm font-fredoka"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Status
                </button>
              )}
            </div>

            {isEditingStatus ? (
              <div className="space-y-4">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isUpdating ? 'Updating...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingStatus(false);
                      setNewStatus(order.status);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Badge 
                  variant={getStatusVariant(order.status)} 
                  icon={getStatusIcon(order.status)}
                  size="large"
                >
                  {order.status}
                </Badge>
                {order.trackingNumber && (
                  <span className="text-sm text-gray-600 font-fredoka">
                    Tracking: {order.trackingNumber}
                  </span>
                )}
              </div>
            )}

            {/* Quick Action - Move to Next Status */}
            {!isEditingStatus && getNextStatus(order.status) && (
              <button
                onClick={() => onStatusUpdate(order.id, getNextStatus(order.status)!)}
                className="mt-4 px-4 py-2 bg-mint-green text-white rounded-lg font-fredoka hover:bg-green-600 flex items-center gap-2"
              >
                Move to {getNextStatus(order.status)}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Order Timeline */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-fredoka font-semibold mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === timeline.length - 1 ? 'bg-primary-blue text-white' : 'bg-gray-100'
                    }`}>
                      {event.icon === 'ShoppingCart' && <Package className="w-5 h-5" />}
                      {event.icon === 'CheckCircle' && <CheckCircle className="w-5 h-5" />}
                      {event.icon === 'Package' && <Package className="w-5 h-5" />}
                      {event.icon === 'Truck' && <Truck className="w-5 h-5" />}
                      {event.icon === 'CheckCircle2' && <CheckCircle className="w-5 h-5" />}
                      {event.icon === 'XCircle' && <XCircle className="w-5 h-5" />}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="absolute top-10 left-5 w-0.5 h-12 bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <p className="font-fredoka font-semibold">{event.status}</p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatters.date(event.timestamp)} at {formatters.time(event.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-fredoka font-semibold mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="font-fredoka">{order.userEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="font-fredoka">{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-fredoka font-semibold mb-4">Shipping Address</h3>
              <div className="space-y-2">
                <p className="font-fredoka font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600 font-fredoka">
                  {order.shippingAddress.address}
                  {order.shippingAddress.street && `, ${order.shippingAddress.street}`}
                </p>
                <p className="text-gray-600 font-fredoka">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-gray-600 font-fredoka">{order.shippingAddress.country}</p>
                <div className="flex items-center gap-2 mt-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <Badge variant="info">{order.shippingAddress.type}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-fredoka font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {item.productImage && (
                    <img 
                      src={item.productImage} 
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-fredoka font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600 font-fredoka">
                      Quantity: {item.quantity} × {formatters.currency(item.price)}
                    </p>
                  </div>
                  <p className="font-fredoka font-semibold">
                    {formatters.currency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-fredoka font-semibold mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-fredoka">Method</span>
                  <span className="font-fredoka font-medium uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-fredoka">Status</span>
                  <Badge variant={order.paymentStatus === 'completed' ? 'success' : 'warning'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-fredoka font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-fredoka">Subtotal</span>
                  <span className="font-fredoka">{formatters.currency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-fredoka">Shipping</span>
                  <span className="font-fredoka">{formatters.currency(order.shippingCost)}</span>
                </div>
                {order.tax && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-fredoka">Tax</span>
                    <span className="font-fredoka">{formatters.currency(order.tax)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-fredoka font-semibold">Total</span>
                    <span className="font-fredoka font-bold text-lg">
                      {formatters.currency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka hover:bg-gray-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-fredoka hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;