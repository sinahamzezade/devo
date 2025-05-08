import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { FormSection as FormSectionType, FormField } from '../../types';
import FormFieldRenderer from './FormFieldRenderer';
import { useFormContext } from '../../context/FormContext';

interface FormSectionProps {
  section: FormSectionType;
}

const FormSection: React.FC<FormSectionProps> = ({ section }) => {
  const { formData } = useFormContext();

  const shouldShowField = (field: FormField): boolean => {
    // If no conditions are defined, always show the field
    if (!field.conditions || field.conditions.length === 0) return true;

    // Check all conditions (AND logic - all must be true)
    return field.conditions.every((condition) => {
      const fieldValue = formData[condition.field];
      
      // If the field value doesn't exist yet, don't show conditional fields
      if (fieldValue === undefined || fieldValue === null) {
        return false;
      }
      
      switch (condition.operator) {
        case 'equals':
          return String(fieldValue) === String(condition.value);
        case 'notEquals':
          return String(fieldValue) !== String(condition.value);
        case 'contains':
          return String(fieldValue).includes(String(condition.value));
        case 'greaterThan':
          return Number(fieldValue) > Number(condition.value);
        case 'lessThan':
          return Number(fieldValue) < Number(condition.value);
        default:
          console.warn(`Unknown condition operator: ${condition.operator}`);
          return true;
      }
    });
  };

  const renderFields = (fields: FormField[]) => {
    if (!fields || !Array.isArray(fields)) {
      console.warn('Invalid fields array provided to FormSection', fields);
      return null;
    }

    return fields.map((field) => {
      if (!shouldShowField(field)) return null;

      return (
        <Box key={field.id} sx={{ mb: 2 }}>
          <FormFieldRenderer field={field} />
          {field.fields && field.fields.length > 0 && renderFields(field.fields)}
        </Box>
      );
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {section.title}
      </Typography>
      {renderFields(section.fields)}
    </Paper>
  );
};

export default FormSection;
