import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  return (
    <span
      className={`inline-flex items-center font-fredoka font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

// Specialized badge components for common use cases

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'suspended';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    active: { variant: 'success' as BadgeVariant, label: 'Active' },
    inactive: { variant: 'default' as BadgeVariant, label: 'Inactive' },
    pending: { variant: 'warning' as BadgeVariant, label: 'Pending' },
    suspended: { variant: 'danger' as BadgeVariant, label: 'Suspended' }
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

interface StockBadgeProps {
  stock: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock }) => {
  let variant: BadgeVariant = 'success';
  let label = 'In Stock';

  if (stock === 0) {
    variant = 'danger';
    label = 'Out of Stock';
  } else if (stock < 10) {
    variant = 'warning';
    label = 'Low Stock';
  }

  return (
    <Badge variant={variant}>
      {label} ({stock})
    </Badge>
  );
};

interface OrderStatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { variant: 'warning' as BadgeVariant, label: 'Pending' },
    processing: { variant: 'info' as BadgeVariant, label: 'Processing' },
    completed: { variant: 'success' as BadgeVariant, label: 'Completed' },
    cancelled: { variant: 'danger' as BadgeVariant, label: 'Cancelled' },
    refunded: { variant: 'purple' as BadgeVariant, label: 'Refunded' }
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

interface PaymentStatusBadgeProps {
  status: 'paid' | 'unpaid' | 'partial' | 'refunded';
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    paid: { variant: 'success' as BadgeVariant, label: 'Paid' },
    unpaid: { variant: 'danger' as BadgeVariant, label: 'Unpaid' },
    partial: { variant: 'warning' as BadgeVariant, label: 'Partial' },
    refunded: { variant: 'purple' as BadgeVariant, label: 'Refunded' }
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};