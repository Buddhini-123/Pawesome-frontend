import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  X,
  Calendar,
  Settings,
  MoreHorizontal,
  TrendingUp,
  Trophy,
  Plus,
  ShoppingBag,
  Clock,
  DollarSign,
} from 'lucide-react';

interface SubscriptionItem {
  name: string;
  quantity: number;
  price: number;
}

interface Subscription {
  id: number;
  name: string;
  products: number;
  frequency: string;
  nextDelivery: string;
  total: number;
  startDate: string;
  status: string;
  items: SubscriptionItem[];
  deliveryAddress: string;
  savedAmount: number;
  totalDeliveries?: number;
  completedDeliveries?: number;
  remainingDeliveries?: number;
  perDeliveryCost?: number;
  totalSubscriptionCost?: number;
}

interface ActiveSubscriptionsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  onSubscriptionClick: (subscription: Subscription) => void;
  onManageSubscription: (e: React.MouseEvent, subscription: Subscription) => void;
}

const ActiveSubscriptionsSidebar: React.FC<ActiveSubscriptionsSidebarProps> = ({
  isOpen,
  onClose,
  subscriptions,
  onSubscriptionClick,
  onManageSubscription,
}) => {
  const totalMonthlySpend = subscriptions.reduce((sum, sub) => sum + sub.total, 0);
  const totalSavings = Math.floor(totalMonthlySpend * 0.1);
  const loyaltyPoints = subscriptions.length * 50;

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && subscriptions.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="fixed right-6 bottom-24 bg-primary-blue hover:bg-vibrant-orange text-white p-4 rounded-full shadow-2xl transition-all duration-300 z-40 group"
          >
            <div className="relative">
              <Package className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-crimson text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {subscriptions.length}
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={onClose}
            />
            
            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-6 top-6 bottom-6 w-80 lg:w-96 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden ring-1 ring-black/5"
            >
              {/* Header */}
              <div className="bg-soft-gray/50 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-fredoka font-bold text-charcoal">
                    My Subscriptions
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-soft-gray rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-medium-gray" />
                  </button>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-light-gray">
                    <Package className="h-5 w-5 text-primary-blue mx-auto mb-1" />
                    <p className="text-xs text-medium-gray">Active</p>
                    <p className="font-fredoka font-bold text-lg text-charcoal">{subscriptions.length}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-light-gray">
                    <DollarSign className="h-5 w-5 text-vibrant-orange mx-auto mb-1" />
                    <p className="text-xs text-medium-gray">Monthly</p>
                    <p className="font-fredoka font-bold text-lg text-charcoal">Rs. {totalMonthlySpend}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-light-gray">
                    <TrendingUp className="h-5 w-5 text-mint-green mx-auto mb-1" />
                    <p className="text-xs text-medium-gray">Saved</p>
                    <p className="font-fredoka font-bold text-lg text-mint-green">Rs. {totalSavings}</p>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto bg-soft-gray/5 p-2">
                {subscriptions.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {/* Subscription Cards */}
                    {subscriptions.map((subscription, index) => (
                      <motion.div
                        key={subscription.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl border-2 border-transparent hover:border-primary-blue hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => onSubscriptionClick(subscription)}
                      >
                        <div className="p-4">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center flex-1">
                              <div className="w-12 h-12 bg-soft-gray rounded-2xl flex items-center justify-center mr-3 shadow-sm">
                                <span className="text-2xl">
                                  {subscription.name?.includes('Dog') ? '🐕' :
                                  subscription.name?.includes('Cat') ? '🐱' :
                                  subscription.name?.includes('Bird') ? '🦜' : '🐾'}
                                </span>

                              </div>
                              <div className="flex-1">
                                <h3 className="font-fredoka font-semibold text-charcoal line-clamp-1">
                                  {subscription.name}
                                </h3>
                                <p className="text-sm text-medium-gray">
                                  {subscription.products} products • {subscription.frequency}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Next Delivery */}
                          <div className="bg-soft-gray rounded-xl p-3 mb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-medium-gray mr-2" />
                                <div>
                                  <p className="text-xs text-medium-gray">Next Delivery</p>
                                  <p className="font-fredoka font-medium text-sm text-charcoal">
                                    {new Date(subscription.nextDelivery).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-medium-gray">
                                  {subscription.totalSubscriptionCost ? 'Per Delivery' : 'Total'}
                                </p>
                                <p className="font-fredoka font-bold text-lg text-primary-blue">
                                  Rs. {subscription.perDeliveryCost || subscription.total}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Progress */}
                          {subscription.totalDeliveries && subscription.totalDeliveries > 0 && (
                            <div className="bg-mint-green/10 rounded-xl p-3 mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-fredoka font-medium text-charcoal">
                                  Delivery Progress
                                </span>
                                <span className="text-xs font-fredoka font-bold text-mint-green">
                                  {subscription.completedDeliveries || 0} / {subscription.totalDeliveries}
                                </span>
                              </div>
                              {/* Progress Bar */}
                              <div className="w-full bg-soft-gray rounded-full h-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${((subscription.completedDeliveries || 0) / subscription.totalDeliveries) * 100}%`
                                  }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className="bg-gradient-to-r from-mint-green to-primary-blue h-full rounded-full"
                                />
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-medium-gray">
                                  {subscription.remainingDeliveries || 0} remaining
                                </span>
                                {subscription.totalSubscriptionCost && (
                                  <span className="text-xs font-fredoka font-bold text-primary-blue">
                                    Total: Rs. {subscription.totalSubscriptionCost.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onManageSubscription(e, subscription);
                              }}
                              className="flex-1 bg-primary-blue hover:bg-blue-700 text-white py-2 px-4 rounded-full font-fredoka font-medium text-sm transition-colors flex items-center justify-center"
                            >
                              <Settings className="h-4 w-4 mr-1.5" />
                              Manage
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Quick actions
                              }}
                              className="p-2 bg-soft-gray hover:bg-light-gray rounded-full transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4 text-medium-gray" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Benefits Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: subscriptions.length * 0.1 + 0.2 }}
                      className="bg-primary-blue text-white rounded-2xl p-4 mt-6"
                    >
                      <h3 className="font-fredoka font-bold text-lg mb-3 flex items-center">
                        <Trophy className="h-5 w-5 mr-2" />
                        Your Benefits
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Monthly Savings</span>
                          <span className="font-fredoka font-bold">Rs. {totalSavings}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Free Deliveries</span>
                          <span className="font-fredoka font-bold">{subscriptions.length}/month</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Loyalty Points</span>
                          <span className="font-fredoka font-bold">{loyaltyPoints} pts</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="w-24 h-24 bg-soft-gray rounded-3xl flex items-center justify-center mb-4 shadow-md">
                      <Package className="h-12 w-12 text-medium-gray" />
                    </div>
                    <h3 className="font-fredoka font-bold text-xl text-charcoal mb-2">
                      No Active Subscriptions
                    </h3>
                    <p className="text-medium-gray mb-6 max-w-sm">
                      Start saving with our subscription service and never run out of your pet's essentials!
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-primary-blue hover:bg-vibrant-orange text-white font-fredoka font-medium px-6 py-3 rounded-full transition-colors flex items-center"
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              {subscriptions.length > 0 && (
                <div className="p-4 bg-soft-gray/30 rounded-b-2xl">
                  <button
                    onClick={onClose}
                    className="w-full bg-vibrant-orange hover:bg-sunny-yellow text-white font-fredoka font-medium py-3 rounded-2xl transition-colors flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Subscription
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActiveSubscriptionsSidebar;