'use client';

import React, { createContext, useContext, useState } from 'react';
import { FormStructure } from '../types';

interface FormContextType {
  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  errors: Record<string, string | undefined>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>;
  currentFormStructure: FormStructure | null;
  setCurrentFormStructure: (structure: FormStructure | null) => void;
  formSubmitting: boolean;
  setFormSubmitting: (submitting: boolean) => void;
  formError: string | null;
  setFormError: (error: string | null) => void;
  resetFormData: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [currentFormStructure, setCurrentFormStructure] = useState<FormStructure | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetFormData = () => {
    setFormData({});
    setErrors({});
    setFormError(null);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        errors,
        setErrors,
        currentFormStructure,
        setCurrentFormStructure,
        formSubmitting,
        setFormSubmitting,
        formError,
        setFormError,
        resetFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
