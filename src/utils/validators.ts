// Form validation utilities

export const validators = {
  // Email validation
  email: (value: string): string | null => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email format';
    return null;
  },

  // Password validation
  password: (value: string): string | null => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
    return null;
  },

  // Phone validation (Indian format)
  phone: (value: string): string | null => {
    if (!value) return null; // Phone is optional
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    const cleanedValue = value.replace(/\s|-/g, '');
    if (!phoneRegex.test(cleanedValue)) return 'Invalid phone number';
    return null;
  },

  // Name validation
  name: (value: string): string | null => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
    return null;
  },

  // Address validation
  address: {
    street: (value: string): string | null => {
      if (!value) return 'Street address is required';
      if (value.length < 5) return 'Please enter a valid street address';
      return null;
    },
    
    city: (value: string): string | null => {
      if (!value) return 'City is required';
      if (!/^[a-zA-Z\s]+$/.test(value)) return 'City can only contain letters and spaces';
      return null;
    },
    
    state: (value: string): string | null => {
      if (!value) return 'State is required';
      return null;
    },
    
    pincode: (value: string): string | null => {
      if (!value) return 'Pincode is required';
      if (!/^\d{6}$/.test(value)) return 'Pincode must be 6 digits';
      return null;
    }
  },

  // Credit card validation
  creditCard: {
    number: (value: string): string | null => {
      if (!value) return 'Card number is required';
      const cleanedValue = value.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cleanedValue)) return 'Card number must be 16 digits';
      // Basic Luhn algorithm check
      if (!luhnCheck(cleanedValue)) return 'Invalid card number';
      return null;
    },
    
    expiry: (value: string): string | null => {
      if (!value) return 'Expiry date is required';
      const [month, year] = value.split('/');
      if (!month || !year) return 'Invalid format (MM/YY)';
      
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      const expMonth = parseInt(month);
      const expYear = parseInt(year);
      
      if (expMonth < 1 || expMonth > 12) return 'Invalid month';
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return 'Card has expired';
      }
      return null;
    },
    
    cvv: (value: string): string | null => {
      if (!value) return 'CVV is required';
      if (!/^\d{3,4}$/.test(value)) return 'CVV must be 3 or 4 digits';
      return null;
    }
  },

  // Quantity validation
  quantity: (value: number): string | null => {
    if (!value || value < 1) return 'Quantity must be at least 1';
    if (value > 99) return 'Maximum quantity is 99';
    return null;
  },

  // Price validation
  price: (value: number): string | null => {
    if (value < 0) return 'Price cannot be negative';
    return null;
  },

  // Required field validation
  required: (value: any): string | null => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },

  // Min length validation
  minLength: (min: number) => (value: string): string | null => {
    if (!value || value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  // Max length validation
  maxLength: (max: number) => (value: string): string | null => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },

  // Custom regex validation
  pattern: (pattern: RegExp, message: string) => (value: string): string | null => {
    if (!pattern.test(value)) {
      return message;
    }
    return null;
  }
};

// Luhn algorithm for credit card validation
function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// Form validation helper
export function validateForm<T extends Record<string, any>>(
  values: T,
  validationRules: Partial<Record<keyof T, (value: any) => string | null>>
): Record<keyof T, string | null> {
  const errors: any = {};
  
  for (const field in validationRules) {
    const validator = validationRules[field];
    if (validator) {
      errors[field] = validator(values[field]);
    }
  }
  
  return errors;
}

// Check if form has errors
export function hasErrors(errors: Record<string, string | null>): boolean {
  return Object.values(errors).some(error => error !== null);
}