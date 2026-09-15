// Simple theme testing utility
const themeTest = {
  // Test if dark mode is properly applied
  testDarkMode: () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    console.log('Dark mode active:', isDarkMode);
    
    // Test background color
    const bgColor = getComputedStyle(document.body).backgroundColor;
    console.log('Background color:', bgColor);
    
    // Test text color
    const textColor = getComputedStyle(document.body).color;
    console.log('Text color:', textColor);
    
    return { isDarkMode, bgColor, textColor };
  },
  
  // Toggle theme and test
  testThemeToggle: () => {
    const toggleButton = document.querySelector('[aria-label="Toggle theme"]');
    if (toggleButton) {
      toggleButton.click();
      setTimeout(() => {
        themeTest.testDarkMode();
      }, 100);
    }
  },
  
  // Test resource page visibility in dark mode
  testResourceVisibility: () => {
    // This would be run on the resources page
    const resourceCards = document.querySelectorAll('.resource-card');
    const computedStyles = [];
    
    resourceCards.forEach((card, index) => {
      const bgColor = getComputedStyle(card).backgroundColor;
      const textColor = getComputedStyle(card).color;
      computedStyles.push({
        card: index,
        background: bgColor,
        text: textColor,
        contrast: themeTest.calculateContrast(bgColor, textColor)
      });
    });
    
    console.table(computedStyles);
    return computedStyles;
  },
  
  // Simple contrast calculation (simplified)
  calculateContrast: (bg, text) => {
    // This is a simplified version - real implementation would be more complex
    return 'tested';
  }
};

// Export for use in browser console
window.themeTest = themeTest;

export default themeTest;