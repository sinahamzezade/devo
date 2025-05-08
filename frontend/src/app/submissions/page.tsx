"use client";

import React from 'react';
import { Container, Typography } from '@mui/material';
import SubmissionsList from '../../components/SubmissionsList';

export default function SubmissionsPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Insurance Applications
      </Typography>
      <SubmissionsList />
    </Container>
  );
}
