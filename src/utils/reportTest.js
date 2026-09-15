// Simple report upload testing utility
const reportTest = {
  // Test file validation
  testFileValidation: (file) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const isValidType = validTypes.includes(file.type);
    const isValidSize = file.size <= maxSize;
    
    console.log('File validation results:', {
      name: file.name,
      type: file.type,
      size: file.size,
      validType: isValidType,
      validSize: isValidSize,
      isValid: isValidType && isValidSize
    });
    
    return isValidType && isValidSize;
  },
  
  // Test report upload simulation
  testReportUpload: async (file) => {
    console.log('Starting report upload test for:', file.name);
    
    // Validate file first
    if (!reportTest.testFileValidation(file)) {
      console.error('File validation failed');
      return { success: false, error: 'Invalid file' };
    }
    
    // Simulate upload process
    console.log('Uploading file...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful upload
    const reportData = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      date: new Date().toISOString(),
      status: 'uploaded',
      adminSeen: false
    };
    
    console.log('Upload successful:', reportData);
    return { success: true, data: reportData };
  },
  
  // Test report removal
  testReportRemoval: (reportId) => {
    console.log('Removing report:', reportId);
    // In a real implementation, this would call the API to delete the report
    return { success: true, message: 'Report removed successfully' };
  }
};

// Export for use in browser console
window.reportTest = reportTest;

export default reportTest;