'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from './';
import { useTheme } from '../../context/ThemeContext';

const NavbarWrapper: React.FC = () => {
  // Initialize with false to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  
  // After component mounts, we can show it to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
};

export default NavbarWrapper; 