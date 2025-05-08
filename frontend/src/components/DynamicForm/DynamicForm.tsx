"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchFormStructure, submitForm } from "../../services/api";
import { FormStructure, FormSection as FormSectionType } from "../../types";
import FormSection from "./FormSection";
import { useFormContext } from "../../context/FormContext";
import { Button, Alert, CircularProgress, Paper } from "@mui/material";

interface DynamicFormProps {
  formType?: "health" | "car" | "home";
  onSubmitSuccess?: (data: any) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  formType = "health",
  onSubmitSuccess,
}) => {
  const {
    formData,
    resetFormData,
    setCurrentFormStructure,
    formSubmitting,
    setFormSubmitting,
    formError,
    setFormError,
  } = useFormContext();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedFormType, setSelectedFormType] = useState<string>(formType);

  // Fetch form structure
  const {
    data: formStructures,
    isLoading,
    error,
  } = useQuery<FormStructure[]>({
    queryKey: ["formStructure"],
    queryFn: () => fetchFormStructure(selectedFormType),
  });

  // Find the current form structure based on type
  const currentForm = formStructures?.find(
    (form) => form.type === selectedFormType
  );

  // Submit form mutation
  const mutation = useMutation({
    mutationFn: submitForm,
    onSuccess: (data) => {
      setSuccessMessage("Your form has been submitted successfully!");
      setFormSubmitting(false);
      resetFormData();
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }
    },
    onError: (error: any) => {
      setFormError(
        error.message || "An error occurred while submitting the form."
      );
      setFormSubmitting(false);
    },
  });

  useEffect(() => {
    if (currentForm) {
      setCurrentFormStructure(currentForm);
    }

    return () => {
      setCurrentFormStructure(null);
    };
  }, [currentForm, setCurrentFormStructure]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setFormSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    // Structure the data according to the backend's expectations
    const submissionData = {
      data: {
        ...formData,
        type: selectedFormType,
      },
      templateId: currentForm?.id ? parseInt(currentForm.id) : 1,
      type: selectedFormType,
    };

    mutation.mutate(submissionData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="my-4">
        Error loading form: {(error as Error).message}
      </Alert>
    );
  }

  // if (!formStructures || formStructures.length === 0) {
  //   return (
  //     <Alert severity="warning" className="my-4">
  //       No form structures available.
  //     </Alert>
  //   );
  // }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Select Form Type
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {formStructures?.map((form) => (
            <Paper
              key={form.type}
              sx={{
                p: 3,
                cursor: "pointer",
                border:
                  selectedFormType === form.type
                    ? "2px solid #1976d2"
                    : "1px solid #e0e0e0",
                "&:hover": {
                  borderColor: "#1976d2",
                },
              }}
              onClick={() => {
                setSelectedFormType(form.type);
                resetFormData();
              }}
            >
              <h3 className="text-lg font-semibold">{form.title}</h3>
              <p className="mt-2 text-sm text-gray-600">
                Select to fill {form.type} insurance form
              </p>
            </Paper>
          ))}
        </div>
      </div>
      {currentForm && (
        <>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            {currentForm.title}
          </h2>

          {formError && (
            <Alert
              severity="error"
              className="my-4"
              onClose={() => setFormError(null)}
            >
              {formError}
            </Alert>
          )}

          {successMessage && (
            <Alert
              severity="success"
              className="my-4"
              onClose={() => setSuccessMessage(null)}
            >
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {currentForm.sections && currentForm.sections.length > 0 ? (
              currentForm.sections.map((section: FormSectionType) => (
                <div key={section.id}>
                  <FormSection section={section} />
                </div>
              ))
            ) : (
              <Alert severity="warning" className="my-4">
                Form structure is invalid. No sections found.
              </Alert>
            )}

            <div className="mt-6 flex justify-end gap-x-4">
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => resetFormData()}
                disabled={formSubmitting}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <>
                    <CircularProgress
                      size={20}
                      color="inherit"
                      className="mr-2"
                    />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default DynamicForm;
