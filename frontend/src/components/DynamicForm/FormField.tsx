import React, { useEffect, useState } from "react";
import { FormField as FormFieldType } from "../../types";
import { useFormContext } from "../../context/FormContext";
import axios from "axios";
import {
  MenuItem,
  Select,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormHelperText,
  InputLabel,
} from "@mui/material";

interface FormFieldProps {
  field: FormFieldType;
  parentValue?: any;
}

const FormField: React.FC<FormFieldProps> = ({ field }) => {
  const { formData, setFormData } = useFormContext();
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    field.options || []
  );
  const [error, setError] = useState<string | null>(null);
  const fieldValue = formData[field.id] || "";

  // Load dynamic options from API if specified
  useEffect(() => {
    if (field.apiEndpoint) {
      const fetchOptions = async () => {
        try {
          const response = await axios.get(field.apiEndpoint!);
          if (response.data?.options) {
            setOptions(response.data.options);
          }
        } catch (error) {
          console.error(`Error fetching options for field ${field.id}:`, error);
        }
      };

      fetchOptions();
    }
  }, [field.apiEndpoint, field.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const value = e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
      ? e.target.checked
      : e.target.value;

    setFormData(prevData => ({
      ...prevData,
      [field.id]: value
    }));
    validateField(value);
  };

  const validateField = (value: any) => {
    if (!field.validation) return;

    if (field.validation.required && (!value || value === "")) {
      setError(`${field.label} is required`);
      return;
    }

    if (
      field.validation.minLength &&
      typeof value === "string" &&
      value.length < field.validation.minLength
    ) {
      setError(
        `${field.label} must be at least ${field.validation.minLength} characters`
      );
      return;
    }

    if (
      field.validation.maxLength &&
      typeof value === "string" &&
      value.length > field.validation.maxLength
    ) {
      setError(
        `${field.label} must be less than ${field.validation.maxLength} characters`
      );
      return;
    }

    if (
      field.validation.min &&
      typeof value === "number" &&
      value < field.validation.min
    ) {
      setError(`${field.label} must be at least ${field.validation.min}`);
      return;
    }

    if (
      field.validation.max &&
      typeof value === "number" &&
      value > field.validation.max
    ) {
      setError(`${field.label} must be less than ${field.validation.max}`);
      return;
    }

    if (field.validation.pattern && typeof value === "string") {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        setError(`${field.label} has an invalid format`);
        return;
      }
    }

    setError(null);
  };

  // Check if the field should be shown based on conditions
  const shouldShow = () => {
    if (!field.conditions || field.conditions.length === 0) {
      return true;
    }

    return field.conditions.every((condition) => {
      const conditionFieldValue = formData[condition.field];

      switch (condition.operator) {
        case "equals":
          return conditionFieldValue === condition.value;
        case "notEquals":
          return conditionFieldValue !== condition.value;
        case "contains":
          return (
            typeof conditionFieldValue === "string" &&
            conditionFieldValue.includes(String(condition.value))
          );
        case "greaterThan":
          return Number(conditionFieldValue) > Number(condition.value);
        case "lessThan":
          return Number(conditionFieldValue) < Number(condition.value);
        default:
          return true;
      }
    });
  };

  if (!shouldShow()) {
    return null;
  }

  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "number":
      return (
        <div className="mb-4">
          <TextField
            fullWidth
            id={field.id}
            label={field.label}
            type={field.type}
            value={fieldValue}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.validation?.required}
            error={!!error}
            helperText={error}
            size="small"
          />
        </div>
      );

    case "select":
      return (
        <div className="mb-4">
          <FormControl fullWidth size="small" error={!!error}>
            <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.id}-label`}
              id={field.id}
              value={fieldValue}
              label={field.label}
              onChange={handleChange}
              required={field.validation?.required}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        </div>
      );

    case "radio":
      return (
        <div className="mb-4">
          <FormControl component="fieldset" error={!!error}>
            <p className="mb-2 text-sm font-medium">{field.label}</p>
            <RadioGroup
              name={field.id}
              value={fieldValue}
              onChange={handleChange}
              row
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        </div>
      );

    case "checkbox":
      return (
        <div className="mb-4">
          <FormControlLabel
            control={
              <Checkbox
                checked={!!fieldValue}
                onChange={handleChange}
                name={field.id}
                size="small"
              />
            }
            label={field.label}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </div>
      );

    case "textarea":
      return (
        <div className="mb-4">
          <TextField
            fullWidth
            id={field.id}
            label={field.label}
            multiline
            rows={4}
            value={fieldValue}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.validation?.required}
            error={!!error}
            helperText={error}
            size="small"
          />
        </div>
      );

    case "group":
      return field.fields ? (
        <div className="mb-4 rounded border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-3 font-medium">{field.label}</h4>
          <div className="space-y-2">
            {field.fields.map((nestedField) => (
              <FormField key={nestedField.id} field={nestedField} />
            ))}
          </div>
        </div>
      ) : null;

    default:
      return null;
  }
};

export default FormField;
