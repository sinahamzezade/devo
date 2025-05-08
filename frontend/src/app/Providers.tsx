'use client';

import React from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '../context/ThemeContext';
import { FormProvider } from '../context/FormContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavbarWrapper } from '../components/Navigation';
import { useTheme } from '../context/ThemeContext';

// Create a query client
const queryClient = new QueryClient();

// Create a MUI ThemeProvider wrapper that uses our custom theme context
function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
  const { darkMode } = useTheme();
  
  // Create a theme instance
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#4F46E5',
          },
          secondary: {
            main: '#6B7280',
          },
        },
      }),
    [darkMode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(new QueryClient());
  
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <FormProvider>
          <NavbarWrapper />
          <MuiThemeWrapper>
            {children}
          </MuiThemeWrapper>
        </FormProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
} 