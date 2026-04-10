import { useState, useEffect, useCallback } from 'react';
import { validateForm } from '../utils/validation';

/**
 * useForm – generic form state + validation hook
 *
 * @param {Object} initialValues  – initial field values
 * @param {Object} rules          – { fieldName: [validatorFn, …] }
 * @param {Function} onSubmit     – called with values when valid
 */
export default function useForm(initialValues, rules, onSubmit) {
  const [values, setValues]   = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Re-validate touched fields whenever values change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const newErrors = validateForm(values, rules);
      // Only show errors for fields that have been touched
      const filteredErrors = Object.fromEntries(
        Object.entries(newErrors).filter(([k]) => touched[k])
      );
      setErrors(filteredErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validateForm(values, rules);
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, rules]);

  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Touch all fields
    const allTouched = Object.fromEntries(Object.keys(values).map(k => [k, true]));
    setTouched(allTouched);

    const allErrors = validateForm(values, rules);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, rules, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
  };
}
