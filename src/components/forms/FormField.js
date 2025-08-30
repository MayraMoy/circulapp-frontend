// components/forms/FormField.js - Campo de formulario con validación
import React, { useState, useEffect } from 'react';
import { TextField, FormHelperText } from '@mui/material';
import { validators } from '../../utils/validators';

const FormField = ({
  name,
  label,
  value,
  onChange,
  validation,
  onValidation,
  debounce = 0,
  ...props
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched && validation) {
      const validateField = () => {
        const rules = Array.isArray(validation) ? validation : [validation];

        for (const rule of rules) {
          if (typeof rule === 'string') {
            // Validación predefinida
            const validator = validators[rule];
            if (validator && !validator(value)) {
              const errorMsg = `${label} no es válido`;
              setError(errorMsg);
              onValidation?.(name, false, errorMsg);
              return;
            }
          } else if (typeof rule === 'function') {
            // Validación personalizada
            const result = rule(value);
            if (result !== true) {
              const errorMsg = typeof result === 'string' ? result : `${label} no es válido`;
              setError(errorMsg);
              onValidation?.(name, false, errorMsg);
              return;
            }
          } else if (typeof rule === 'object') {
            // Validación con opciones
            const { type, message, ...options } = rule;
            const validator = validators[type];
            if (validator) {
              const isValid = validator(value, ...Object.values(options));
              if (!isValid) {
                const errorMsg = message || `${label} no es válido`;
                setError(errorMsg);
                onValidation?.(name, false, errorMsg);
                return;
              }
            }
          }
        }

        // Si llegó hasta aquí, es válido
        setError('');
        onValidation?.(name, true, '');
      };

      if (debounce > 0) {
        const timer = setTimeout(validateField, debounce);
        return () => clearTimeout(timer);
      } else {
        validateField();
      }
    }
  }, [value, touched, validation, name, label, onValidation, debounce]);

  const handleChange = e => {
    onChange(e);
    if (!touched) setTouched(true);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <>
      <TextField
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched && !!error}
        {...props}
      />
      {touched && error && <FormHelperText error>{error}</FormHelperText>}
    </>
  );
};

export default FormField;
