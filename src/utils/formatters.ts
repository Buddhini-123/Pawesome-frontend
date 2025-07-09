// Formatting utilities for consistent display

export const formatters = {
  // Format currency (Sri Lankan Rupees)
  currency: (amount: number): string => {
    return `Rs. ${amount.toLocaleString('en-LK')}`;
  },

  // Format date
  date: (date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString('en-LK', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      
      case 'long':
        return dateObj.toLocaleDateString('en-LK', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      
      case 'relative':
        return getRelativeTime(dateObj);
      
      default:
        return dateObj.toLocaleDateString('en-LK');
    }
  },

  // Format time
  time: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-LK', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Format phone number
  phone: (phone: string): string => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Sri Lankan phone format
    if (cleaned.startsWith('94') && cleaned.length === 11) {
      return `+94 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    } else if (cleaned.length === 9 && cleaned.startsWith('7')) {
      // Mobile numbers
      return `0${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    } else if (cleaned.length === 9) {
      // Landline numbers
      return `0${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    }
    
    return phone;
  },

  // Format order ID
  orderId: (id: string): string => {
    return `#${id.toUpperCase().slice(0, 8)}`;
  },

  // Format percentage
  percentage: (value: number, decimals: number = 0): string => {
    return `${value.toFixed(decimals)}%`;
  },

  // Format file size
  fileSize: (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  },

  // Truncate text
  truncate: (text: string, maxLength: number, suffix: string = '...'): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
  },

  // Format credit card number (mask)
  creditCard: (number: string): string => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length !== 16) return number;
    return `•••• •••• •••• ${cleaned.slice(-4)}`;
  },

  // Capitalize first letter
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Title case
  titleCase: (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  },

  // Format address
  address: (address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  }): string => {
    const parts = [
      address.street,
      address.city,
      `${address.state} ${address.pincode}`,
      address.country || 'Sri Lanka'
    ].filter(Boolean);
    
    return parts.join(', ');
  },

  // Format product rating
  rating: (rating: number, showText: boolean = true): string => {
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return showText ? `${stars} ${rating.toFixed(1)}` : stars;
  },

  // Format delivery frequency
  deliveryFrequency: (frequency: 'daily' | 'weekly' | 'monthly'): string => {
    const frequencies = {
      daily: 'Every Day',
      weekly: 'Every Week',
      monthly: 'Every Month'
    };
    return frequencies[frequency] || frequency;
  },

  // Format order status
  orderStatus: (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: 'Order Placed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || formatters.titleCase(status);
  },

  // Pluralize
  pluralize: (count: number, singular: string, plural?: string): string => {
    if (count === 1) return `${count} ${singular}`;
    return `${count} ${plural || singular + 's'}`;
  }
};

// Export individual formatter functions for easier imports
export const formatCurrency = formatters.currency;
export const formatDate = formatters.date;
export const formatTime = formatters.time;
export const formatPhone = formatters.phone;
export const formatOrderId = formatters.orderId;
export const formatPercentage = formatters.percentage;
export const formatFileSize = formatters.fileSize;
export const truncateText = formatters.truncate;
export const formatCreditCard = formatters.creditCard;
export const capitalize = formatters.capitalize;
export const titleCase = formatters.titleCase;
export const formatAddress = formatters.address;
export const formatRating = formatters.rating;
export const formatDeliveryFrequency = formatters.deliveryFrequency;
export const formatOrderStatus = formatters.orderStatus;
export const pluralize = formatters.pluralize;

// Helper function for relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}