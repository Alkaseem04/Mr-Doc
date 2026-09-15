import React, { useEffect } from 'react';
import { useTheme } from './ThemeProvider';

const ThemeTest = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Log theme changes for testing
    console.log('Theme changed to:', theme);
    
    // Test background and text colors
    const bgColor = getComputedStyle(document.body).backgroundColor;
    const textColor = getComputedStyle(document.body).color;
    
    console.log('Background color:', bgColor);
    console.log('Text color:', textColor);
    
    // Test specific elements
    const testElements = document.querySelectorAll('.health-card, .resource-card');
    testElements.forEach((el, index) => {
      const elBg = getComputedStyle(el).backgroundColor;
      const elText = getComputedStyle(el).color;
      console.log(`Element ${index} - Background: ${elBg}, Text: ${elText}`);
    });
  }, [theme]);

  return null; // This component doesn't render anything visible
};

export default ThemeTest;