import React, { useEffect, useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import { FormField } from '../../types';
import { useFormContext } from '../../context/FormContext';
import api from '../../services/api';

interface FormFieldRendererProps {
  field: FormField;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({ field }) => {
  const { formData, setFormData, errors, setErrors } = useFormContext();
  const [dynamicOptions, setDynamicOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (field.apiEndpoint) {
      api.get(field.apiEndpoint)
        .then(response => {
          setDynamicOptions(response.data);
        })
        .catch(error => {
          console.error('Error fetching dynamic options:', error);
        });
    }
  }, [field.apiEndpoint]);

  const handleChange = (value: any) => {
    setFormData(prev => ({
      ...prev,
      [field.id]: value,
    }));

    // Clear error when field is modified
    if (errors[field.id]) {
      setErrors(prev => ({
        ...prev,
        [field.id]: undefined,
      }));
    }
  };

  const validateField = (value: any): string | undefined => {
    if (field.validation) {
      if (field.validation.required && !value) {
        return 'This field is required';
      }
      if (field.validation.minLength && String(value).length < field.validation.minLength) {
        return `Minimum length is ${field.validation.minLength}`;
      }
      if (field.validation.maxLength && String(value).length > field.validation.maxLength) {
        return `Maximum length is ${field.validation.maxLength}`;
      }
      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(String(value))) {
        return 'Invalid format';
      }
      if (field.validation.min !== undefined && Number(value) < field.validation.min) {
        return `Minimum value is ${field.validation.min}`;
      }
      if (field.validation.max !== undefined && Number(value) > field.validation.max) {
        return `Maximum value is ${field.validation.max}`;
      }
    }
    return undefined;
  };

  const options = field.options || dynamicOptions;

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
    case 'tel':
      return (
        <TextField
          fullWidth
          type={field.type}
          label={field.label}
          value={formData[field.id] || ''}
          onChange={(e) => handleChange(e.target.value)}
          error={!!errors[field.id]}
          helperText={errors[field.id]}
          required={field.required}
          placeholder={field.placeholder}
          onBlur={(e) => {
            const error = validateField(e.target.value);
            setErrors(prev => ({
              ...prev,
              [field.id]: error,
            }));
          }}
        />
      );

    case 'select':
      return (
        <FormControl fullWidth error={!!errors[field.id]} required={field.required}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(e.target.value)}
            label={field.label}
            onBlur={(e) => {
              const error = validateField(e.target.value);
              setErrors(prev => ({
                ...prev,
                [field.id]: error,
              }));
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {errors[field.id] && <FormHelperText>{errors[field.id]}</FormHelperText>}
        </FormControl>
      );

    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!formData[field.id]}
              onChange={(e) => handleChange(e.target.checked)}
              required={field.required}
            />
          }
          label={field.label}
        />
      );

    case 'radio':
      return (
        <FormControl component="fieldset" error={!!errors[field.id]} required={field.required}>
          <FormLabel component="legend">{field.label}</FormLabel>
          <RadioGroup
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(e.target.value)}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {errors[field.id] && <FormHelperText>{errors[field.id]}</FormHelperText>}
        </FormControl>
      );

    default:
      return null;
  }
};

export default FormFieldRenderer; 