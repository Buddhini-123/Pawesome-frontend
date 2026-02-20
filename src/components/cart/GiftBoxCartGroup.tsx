import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Gift, Trash2, Package } from 'lucide-react';
import { formatters } from '../../utils/formatters';

interface GiftBoxCartGroupProps {
  groupId: string;
  items: any[];
  recipientName?: string;
  giftMessage?: string;
  onRemoveGroup: () => void;
}

const GiftBoxCartGroup: React.FC<GiftBoxCartGroupProps> = ({
  groupId,
  items,
  recipientName,
  giftMessage,
  onRemoveGroup,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <motion.div
      className="border-2 border-vibrant-orange/30 rounded-2xl overflow-hidden bg-gradient-to-br from-vibrant-orange/5 to-sunny-yellow/5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gift Box Header */}
      <div
        className="p-6 cursor-pointer hover:bg-vibrant-orange/10 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Gift Icon */}
            <div className="bg-vibrant-orange rounded-2xl p-3 flex-shrink-0">
              <Gift className="w-8 h-8 text-white" />
            </div>

            {/* Gift Box Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-fredoka font-bold text-charcoal text-xl">
                  Custom Gift Box
                </h3>
                <span className="bg-vibrant-orange text-white text-xs font-fredoka font-bold px-2 py-1 rounded-full">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>

              {recipientName && (
                <p className="text-sm text-medium-gray font-fredoka mt-1">
                  For: <span className="font-semibold">{recipientName}</span>
                </p>
              )}

              {giftMessage && !isExpanded && (
                <p className="text-sm text-medium-gray italic mt-1 line-clamp-1">
                  "{giftMessage}"
                </p>
              )}

              <p className="text-xs text-vibrant-orange font-fredoka font-semibold mt-1">
                Click to {isExpanded ? 'collapse' : 'view'} items
              </p>
            </div>

            {/* Total Price */}
            <div className="text-right">
              <p className="font-fredoka font-bold text-2xl text-charcoal">
                {formatters.currency(totalPrice)}
              </p>
              <p className="text-sm text-medium-gray font-fredoka">
                Total
              </p>
            </div>

            {/* Expand/Collapse Button */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-6 h-6 text-vibrant-orange" />
            </motion.div>

            {/* Remove Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Remove entire gift box from cart?')) {
                  onRemoveGroup();
                }
              }}
              className="text-coral-red hover:text-coral-red/80 transition-colors flex-shrink-0 ml-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Expanded Gift Box Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t-2 border-vibrant-orange/20"
          >
            <div className="p-6 bg-white/50 space-y-4">
              {giftMessage && (
                <div className="bg-sunny-yellow/10 border-l-4 border-sunny-yellow p-3 rounded-r-lg">
                  <p className="text-sm font-fredoka text-charcoal">
                    <span className="font-bold">Gift Message:</span>{' '}
                    <span className="italic">"{giftMessage}"</span>
                  </p>
                </div>
              )}

              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Product Image */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg shadow"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <h4 className="font-fredoka font-semibold text-charcoal">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-medium-gray font-fredoka">
                      Qty: {item.quantity} × {formatters.currency(item.product.price)}
                    </p>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-right">
                    <p className="font-fredoka font-bold text-lg text-charcoal">
                      {formatters.currency(item.product.price * item.quantity)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GiftBoxCartGroup;
