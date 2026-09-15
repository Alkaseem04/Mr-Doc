# Dark Mode Implementation for Mr.Doc Healthcare Platform

This document explains how dark mode has been implemented in the Mr.Doc healthcare platform to provide users with a comfortable viewing experience in low-light conditions.

## Overview

The dark mode implementation includes:
1. Theme provider for managing theme state
2. Automatic detection of system preferences
3. Persistent storage of user preferences
4. Smooth transitions between themes
5. Toggle button in the navigation bar

## Implementation Details

### Theme Provider

The theme functionality is implemented in `src/components/ThemeProvider.tsx` with:

1. **ThemeProvider Component** - Wraps the entire application to provide theme context
2. **useTheme Hook** - Allows components to access and modify theme state
3. **Automatic Detection** - Checks system preference for dark mode
4. **Persistent Storage** - Saves user preference in localStorage

### Usage

To use the theme provider, wrap your application in `main.tsx`:

```typescript
import { ThemeProvider } from './components/ThemeProvider';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### Accessing Theme State

Components can access and modify the theme using the `useTheme` hook:

```typescript
import { useTheme } from './ThemeProvider';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
};
```

### Theme Toggle Button

A theme toggle button has been added to the Navbar component with:
- Sun icon for light mode
- Moon icon for dark mode
- Smooth transition animations
- Accessible labeling

### CSS Implementation

The dark mode is implemented using CSS variables in `src/index.css`:

1. **Light Theme Variables** - Default color scheme
2. **Dark Theme Variables** - Inverted color scheme for dark mode
3. **Smooth Transitions** - Gradual color changes for better UX

## Tailwind CSS Integration

The project uses Tailwind CSS with dark mode configured as `class` strategy:

```javascript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  // ... other configuration
};
```

This allows using dark mode variants in Tailwind classes:
```html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content that adapts to theme
</div>
```

## Testing Dark Mode

To test the dark mode implementation:

1. Open the application in a browser
2. Look for the theme toggle button in the top navigation bar
3. Click the button to switch between light and dark modes
4. Refresh the page to verify that the preference is saved
5. Change your system theme preference to verify automatic detection

## Customization

To customize the dark mode colors:

1. Modify the CSS variables in `src/index.css` under the `.dark` selector
2. Update Tailwind theme configuration in `tailwind.config.ts` if needed
3. Test changes across different components

## Accessibility

The dark mode implementation considers accessibility:

1. **Sufficient Contrast** - Ensures text remains readable in both modes
2. **Focus States** - Maintains visible focus indicators
3. **Reduced Motion** - Respects user preference for reduced motion
4. **System Preference** - Automatically adapts to user's system settings

## Performance

The dark mode implementation is optimized for performance:

1. **Minimal JavaScript** - Lightweight theme management
2. **CSS-First Approach** - Leverages browser-native CSS features
3. **Efficient Storage** - Uses localStorage for preference persistence
4. **No Layout Shifts** - Maintains consistent layout between themes

## Browser Support

The implementation works in all modern browsers that support:
- CSS variables
- localStorage
- class-based dark mode strategies

## Troubleshooting

Common issues and solutions:

1. **Theme not persisting** - Check if localStorage is available and not blocked
2. **Icons not changing** - Verify that both Sun and Moon icons are imported
3. **CSS not applying** - Ensure Tailwind dark mode is configured correctly
4. **Transition issues** - Check that CSS transition properties are set correctly

## Future Improvements

1. **Theme Customization** - Allow users to choose from multiple color schemes
2. **Scheduled Themes** - Automatically switch based on time of day
3. **Print Styles** - Optimize themes for printing
4. **High Contrast Mode** - Additional accessibility options