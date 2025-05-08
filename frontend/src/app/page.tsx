"use client";
import React from "react";
import { Container, Tabs, Tab, Box } from "@mui/material";
import DynamicForm from "../components/DynamicForm/DynamicForm";
import SubmissionsList from "../components/SubmissionsList/SubmissionsList";
import { FormProvider } from "../context/FormContext";

export default function Home() {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <FormProvider>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="New Application" />
            <Tab label="View Applications" />
          </Tabs>
        </Box>

        {activeTab === 0 ? (
          <DynamicForm
            formType="health"
            onSubmitSuccess={() => setActiveTab(1)}
          />
        ) : (
          <SubmissionsList />
        )}
      </Container>
    </FormProvider>
  );
}
