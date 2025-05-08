'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize dark mode based on user's system preference
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Check if the user has previously set a preference
      const storedPreference = localStorage.getItem('darkMode');
      
      if (storedPreference !== null) {
        setDarkMode(storedPreference === 'true');
      } else {
        setDarkMode(prefersDarkMode);
      }
    }
  }, []);

  // Update when the dark mode state changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      
      if (darkMode) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }

      // Store the user's preference
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const value = {
    darkMode,
    toggleDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 