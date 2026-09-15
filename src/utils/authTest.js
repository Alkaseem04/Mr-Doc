// Simple authentication testing utility
const authTest = {
  // Test login flow
  testLogin: async (email, password) => {
    console.log('Testing login with:', { email, password });
    
    // Basic validation
    if (!email || !password) {
      console.error('Email and password are required');
      return { success: false, error: 'Email and password are required' };
    }
    
    // Simulate API call
    console.log('Calling login API...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate response based on email
    if (email.includes('admin')) {
      return {
        success: true,
        data: {
          user: {
            id: 'admin-1',
            name: 'Admin User',
            email: email,
            role: 'admin'
          },
          token: 'admin-jwt-token'
        }
      };
    } else if (email.includes('doctor')) {
      return {
        success: true,
        data: {
          user: {
            id: 'doctor-1',
            name: 'Doctor User',
            email: email,
            role: 'doctor'
          },
          token: 'doctor-jwt-token'
        }
      };
    } else {
      return {
        success: true,
        data: {
          user: {
            id: 'patient-1',
            name: 'Patient User',
            email: email,
            role: 'patient'
          },
          token: 'patient-jwt-token'
        }
      };
    }
  },
  
  // Test signup flow
  testSignup: async (userData) => {
    console.log('Testing signup with:', userData);
    
    // Basic validation
    if (!userData.email || !userData.password || !userData.name) {
      console.error('Name, email and password are required');
      return { success: false, error: 'Name, email and password are required' };
    }
    
    // Password strength check
    if (userData.password.length < 6) {
      console.error('Password must be at least 6 characters');
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    
    // Simulate API call
    console.log('Calling signup API...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful signup
    return {
      success: true,
      data: {
        user: {
          id: `user-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'patient'
        },
        token: 'new-jwt-token'
      }
    };
  },
  
  // Test user role validation
  testRoleValidation: (user, requiredRole) => {
    console.log('Testing role validation:', { user, requiredRole });
    
    if (!user || !user.role) {
      return false;
    }
    
    if (requiredRole === 'admin') {
      return user.role === 'admin';
    }
    
    if (requiredRole === 'doctor') {
      return user.role === 'doctor' || user.role === 'admin';
    }
    
    return true; // Any authenticated user can access patient areas
  }
};

// Export for use in browser console
window.authTest = authTest;

export default authTest;