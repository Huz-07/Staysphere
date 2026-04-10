// =============================================
// StaySphere – Validation Utilities
// =============================================

export const validators = {
  required: (val) => (!val || val.toString().trim() === '') ? 'This field is required.' : null,

  email: (val) => {
    if (!val) return 'Email is required.';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val) ? null : 'Enter a valid email address.';
  },

  password: (val) => {
    if (!val) return 'Password is required.';
    if (val.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(val)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(val)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(val)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*]/.test(val)) return 'Password must contain at least one special character (!@#$%^&*).';
    return null;
  },

  confirmPassword: (val, original) => {
    if (!val) return 'Please confirm your password.';
    return val !== original ? 'Passwords do not match.' : null;
  },

  phone: (val) => {
    if (!val) return 'Phone number is required.';
    const re = /^[6-9]\d{9}$/;
    return re.test(val) ? null : 'Enter a valid 10-digit Indian mobile number.';
  },

  name: (val) => {
    if (!val || val.trim() === '') return 'Name is required.';
    if (val.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!/^[a-zA-Z\s]+$/.test(val)) return 'Name can only contain letters and spaces.';
    return null;
  },

  date: (val) => {
    if (!val) return 'Date is required.';
    const d = new Date(val);
    return isNaN(d.getTime()) ? 'Enter a valid date.' : null;
  },

  futureDate: (val) => {
    const req = validators.date(val);
    if (req) return req;
    const d = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today ? 'Date must be today or in the future.' : null;
  },

  checkOutAfterCheckIn: (checkOut, checkIn) => {
    if (!checkOut || !checkIn) return 'Both dates are required.';
    const out = new Date(checkOut);
    const inn = new Date(checkIn);
    return out <= inn ? 'Check-out date must be after check-in date.' : null;
  },

  minLength: (min) => (val) => {
    if (!val) return `Minimum ${min} characters required.`;
    return val.length < min ? `Minimum ${min} characters required.` : null;
  },
};

/**
 * Validate an entire form
 * @param {Object} values - form field values
 * @param {Object} rules  - { fieldName: [validatorFn, ...] }
 * @returns {Object} errors map
 */
export function validateForm(values, rules) {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      const error = typeof rule === 'function' ? rule(values[field], values) : null;
      if (error) { errors[field] = error; break; }
    }
  }
  return errors;
}

// Helper: months between two dates
export function monthsBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24 * 30)));
}
