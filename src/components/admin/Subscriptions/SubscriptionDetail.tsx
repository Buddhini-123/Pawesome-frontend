import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Package, 
  MapPin, 
  User,
  Edit2,
  Save,
  Play,
  Pause,
  XCircle,
  Clock,
  Repeat,
  DollarSign,
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Subscription } from '../../../types';
import { formatters } from '../../../utils/formatters';
import { adminSubscriptionService } from '../../../services/adminSubscription.service';
import { Badge } from '../ui/Badge';

interface SubscriptionDetailProps {
  subscription: Subscription;
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionUpdate: () => void;
}

const SubscriptionDetail: React.FC<SubscriptionDetailProps> = ({ 
  subscription, 
  isOpen, 
  onClose, 
  onSubscriptionUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubscription, setEditedSubscription] = useState<Subscription>(subscription);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await adminSubscriptionService.updateSubscription(subscription.id, editedSubscription);
      setIsEditing(false);
      onSubscriptionUpdate();
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'active' | 'paused' | 'cancelled') => {
    try {
      await adminSubscriptionService.updateSubscriptionStatus(subscription.id, newStatus);
      onSubscriptionUpdate();
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getNextDeliveryStatus = () => {
    const nextDelivery = new Date(subscription.nextDelivery);
    const today = new Date();
    const diffDays = Math.ceil((nextDelivery.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { text: 'Today', color: 'text-green-600' };
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', color: 'text-orange-600' };
    } else if (diffDays <= 7) {
      return { text: `In ${diffDays} days`, color: 'text-blue-600' };
    } else {
      return { text: `In ${diffDays} days`, color: 'text-gray-600' };
    }
  };

  const calculateMonthlyValue = () => {
    switch (subscription.frequency) {
      case 'daily':
        return subscription.total * 30;
      case 'weekly':
        return subscription.total * 4;
      case 'monthly':
        return subscription.total;
      default:
        return subscription.total;
    }
  };

  if (!isOpen) return null;

  const nextDeliveryStatus = getNextDeliveryStatus();

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
                    {subscription.name}
                  </h2>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusVariant(subscription.status)} 
                           icon={getStatusIcon(subscription.status)}>
                      {subscription.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      ID: {subscription.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary-blue hover:text-blue-700 flex items-center gap-1 text-sm font-fredoka"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isUpdating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedSubscription(subscription);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Subscription Overview */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-primary-blue/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-8 h-8 text-primary-blue" />
                    <div>
                      <p className="text-sm text-gray-600 font-fredoka">Subscription Value</p>
                      <p className="text-2xl font-fredoka font-bold text-charcoal">
                        {formatters.currency(subscription.total)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-fredoka">
                    {formatters.currency(calculateMonthlyValue())} per month
                  </p>
                </div>

                <div className="bg-mint-green/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Repeat className="w-8 h-8 text-mint-green" />
                    <div>
                      <p className="text-sm text-gray-600 font-fredoka">Frequency</p>
                      <p className="text-2xl font-fredoka font-bold text-charcoal capitalize">
                        {subscription.frequency}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-fredoka">
                    Every {subscription.frequency.slice(0, -2)}
                  </p>
                </div>

                <div className="bg-sunny-yellow/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="w-8 h-8 text-vibrant-orange" />
                    <div>
                      <p className="text-sm text-gray-600 font-fredoka">Next Delivery</p>
                      <p className={`text-lg font-fredoka font-bold ${nextDeliveryStatus.color}`}>
                        {nextDeliveryStatus.text}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-fredoka">
                    {formatters.date(subscription.nextDelivery)}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              {!isEditing && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-fredoka font-semibold mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    {subscription.status !== 'active' && (
                      <button
                        onClick={() => handleStatusUpdate('active')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-fredoka hover:bg-green-600 flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Activate Subscription
                      </button>
                    )}
                    {subscription.status === 'active' && (
                      <button
                        onClick={() => handleStatusUpdate('paused')}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-fredoka hover:bg-yellow-600 flex items-center gap-2"
                      >
                        <Pause className="w-4 h-4" />
                        Pause Subscription
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusUpdate('cancelled')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-fredoka hover:bg-red-600 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              )}

              {/* Subscription Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-fredoka font-semibold mb-4">Subscription Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Subscription Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedSubscription.name}
                          onChange={(e) => setEditedSubscription({ ...editedSubscription, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        />
                      ) : (
                        <p className="font-fredoka">{subscription.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Frequency</label>
                      {isEditing ? (
                        <select
                          value={editedSubscription.frequency}
                          onChange={(e) => setEditedSubscription({ 
                            ...editedSubscription, 
                            frequency: e.target.value as 'daily' | 'weekly' | 'monthly'
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      ) : (
                        <p className="font-fredoka capitalize">{subscription.frequency}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Started</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-fredoka">{formatters.date(subscription.startDate)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Next Delivery</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={new Date(editedSubscription.nextDelivery).toISOString().split('T')[0]}
                          onChange={(e) => setEditedSubscription({ 
                            ...editedSubscription, 
                            nextDelivery: new Date(e.target.value)
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className={`font-fredoka ${nextDeliveryStatus.color}`}>
                            {formatters.date(subscription.nextDelivery)} ({nextDeliveryStatus.text})
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Savings</label>
                      <p className="font-fredoka text-green-600">
                        {formatters.currency(subscription.savedAmount)} saved per delivery
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-fredoka font-semibold mb-4">Delivery Address</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-fredoka font-medium">{subscription.deliveryAddress.fullName}</p>
                        <p className="text-sm text-gray-600 font-fredoka">{subscription.deliveryAddress.address}</p>
                        <p className="text-sm text-gray-600 font-fredoka">
                          {subscription.deliveryAddress.city}, {subscription.deliveryAddress.state}
                        </p>
                        <p className="text-sm text-gray-600 font-fredoka">
                          {subscription.deliveryAddress.pincode}, {subscription.deliveryAddress.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{subscription.deliveryAddress.type}</Badge>
                      {subscription.deliveryAddress.isDefault && (
                        <Badge variant="success">Default</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-fredoka font-semibold mb-4">
                  Subscription Products ({subscription.products.length})
                </h3>
                <div className="space-y-4">
                  {subscription.products.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary-blue" />
                      </div>
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
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-fredoka font-semibold">Total per delivery:</span>
                    <span className="font-fredoka font-bold text-lg">
                      {formatters.currency(subscription.total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600 font-fredoka">Monthly equivalent:</span>
                    <span className="text-sm font-fredoka">
                      {formatters.currency(calculateMonthlyValue())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
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

export default SubscriptionDetail;