'use client';

import React, { useState } from 'react';
import { DynamicForm } from '../../components/DynamicForm';
import { Alert, Button, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function ApplyPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitSuccess = () => {
    setSubmitted(true);
  };

  const handleViewApplications = () => {
    router.push('/submissions');
  };
  
  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center">
        <Paper className="max-w-md p-8 text-center">
          <CheckCircleOutlineIcon color="success" style={{ fontSize: 60 }} className="mb-4" />
          <Typography variant="h5" gutterBottom>
            Application Submitted Successfully!
          </Typography>
          <Typography variant="body1" className="mb-6">
            Your insurance application has been submitted. You can check the status of your application in the applications list.
          </Typography>
          <div className="flex justify-center gap-4">
            <Button variant="outlined" onClick={() => setSubmitted(false)}>
              Submit Another Application
            </Button>
            <Button variant="contained" color="primary" onClick={handleViewApplications}>
              View My Applications
            </Button>
          </div>
        </Paper>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Apply for Insurance
      </Typography>
      <Typography variant="body1" className="mb-6">
        Please fill out the form below to apply for insurance. Required fields are marked with an asterisk (*).
      </Typography>
      
      <DynamicForm onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
} 