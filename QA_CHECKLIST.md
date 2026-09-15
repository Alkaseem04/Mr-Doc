# MR.DOC Healthcare Platform - QA Checklist

## Theme & Layout Testing

### [ ] Theme Toggle Functionality
- [ ] Dark theme is default on all pages
- [ ] Light theme toggle works correctly
- [ ] Theme preference persists across sessions
- [ ] All components render correctly in both themes
- [ ] WCAG AA contrast compliance verified
- [ ] Resources page displays properly in both themes
- [ ] Forms and modals are visible in both themes
- [ ] Third-party embeds are visible in both themes

### [ ] Layout Consistency
- [ ] Responsive design works on all screen sizes
- [ ] Font sizing is readable on mobile
- [ ] Spacing is consistent across components
- [ ] Header is sticky and functional
- [ ] Footer displays correctly on all pages

## Navigation & Page Routing

### [ ] Header Navigation
- [ ] Symptom Checker link navigates to /#symptom-checker
- [ ] Doctors link navigates to /#doctor-appointment
- [ ] Emergency/Hospitals link navigates to /#emergency
- [ ] Resources link navigates to /resources
- [ ] Admin/Users link navigates to /admin/users
- [ ] Header is sticky on scroll
- [ ] Header is keyboard accessible
- [ ] Mobile hamburger menu works
- [ ] Mobile menu closes after selection

### [ ] Page Content Loading
- [ ] All pages load without errors
- [ ] Content displays correctly on each page
- [ ] Images load properly
- [ ] No broken links

## Hospitals & Links

### [ ] Hospital Information
- [ ] KEM Hospital information is accurate
- [ ] Saifee Hospital information is accurate
- [ ] City Hospital information is accurate
- [ ] Lilavati Hospital information is accurate
- [ ] Jaslok Hospital information is accurate
- [ ] M.H. Saboo Siddique Hospital information is accurate

### [ ] Link Functionality
- [ ] All hospital names are clickable links
- [ ] Links open in new tabs with target="_blank"
- [ ] Links have rel="noopener noreferrer" attributes
- [ ] Emergency phone numbers use tel: links
- [ ] "Open on Map" buttons work correctly
- [ ] "Call" buttons initiate phone calls

## Symptom Checker - Voice & Multi-language Input

### [ ] Text Input Functionality
- [ ] Text-based symptom checker works
- [ ] Spell correction functionality works
- [ ] Results display correctly
- [ ] Error handling works for empty input

### [ ] Voice Input Functionality
- [ ] Mic button appears and is functional
- [ ] Recording indicator shows during recording
- [ ] Timeout/stop functionality works
- [ ] Interim transcripts display
- [ ] Final transcript populates input field
- [ ] Clear transcript button works

### [ ] Language Support
- [ ] English speech recognition works
- [ ] Hindi speech recognition works
- [ ] Marathi speech recognition works
- [ ] Language detection works
- [ ] Transcripts submit correctly to symptom checker
- [ ] UTF-8 encoding handles all scripts

## Authentication, Users & Admin

### [ ] Signup Flows
- [ ] Patient signup collects all required fields
- [ ] Doctor signup collects all required fields
- [ ] Password validation works
- [ ] Password confirmation works
- [ ] Profile image upload works (Patient)
- [ ] License document upload works (Doctor)
- [ ] Success messages display

### [ ] Login Flows
- [ ] Patient login works
- [ ] Doctor login works
- [ ] Admin login works
- [ ] Invalid credentials show error messages
- [ ] Password visibility toggle works
- [ ] Redirects work correctly based on role

### [ ] Forgot Password
- [ ] Forgot password link works
- [ ] Password reset email sends
- [ ] Password reset form works
- [ ] New password validation works

### [ ] Admin Users Page
- [ ] User list displays correctly
- [ ] Role filtering works
- [ ] Search functionality works
- [ ] Enable/disable user buttons work
- [ ] View reports button works
- [ ] View profile button works
- [ ] Edit user functionality works
- [ ] Import/Export buttons work

## File Uploads & Patient Dashboard

### [ ] File Upload Functionality
- [ ] PDF uploads work
- [ ] PNG uploads work
- [ ] JPG uploads work
- [ ] File size validation works (10MB limit)
- [ ] File type validation works
- [ ] Upload progress shows
- [ ] Success messages display

### [ ] File Management
- [ ] Uploaded files display in list
- [ ] File preview works
- [ ] File download works
- [ ] File deletion works
- [ ] Admin can view all reports
- [ ] Patient can only view their reports

### [ ] Patient Dashboard
- [ ] Profile information displays correctly
- [ ] Health metrics display correctly
- [ ] Medical history displays correctly
- [ ] Reports tab shows uploaded files
- [ ] Edit profile functionality works
- [ ] Save changes functionality works

## Bug Fixes & End-to-End Flows

### [ ] Book Appointment Flow
- [ ] Doctor selection works
- [ ] Date/time selection works
- [ ] Confirmation works
- [ ] Success message displays
- [ ] Appointment appears in user history

### [ ] Doctor Listing
- [ ] Doctors display correctly
- [ ] Doctor profiles load
- [ ] Contact information shows
- [ ] Verification badges display

### [ ] Resources Page
- [ ] Resources display correctly
- [ ] Search functionality works
- [ ] Categories filter correctly
- [ ] Both themes display properly

### [ ] Action Buttons
- [ ] All buttons trigger expected behavior
- [ ] Error handling works for failing requests
- [ ] Loading states display correctly
- [ ] Success messages show

## Performance, Security & Accessibility

### [ ] Performance
- [ ] Pages load within acceptable time
- [ ] Assets are optimized
- [ ] Blocking scripts are minimized
- [ ] Lazy loading works for large components

### [ ] Security
- [ ] Passwords are properly hashed
- [ ] Input validation works server-side
- [ ] CORS is properly configured
- [ ] Cookies are secure
- [ ] File uploads are validated

### [ ] Accessibility
- [ ] Keyboard navigation works
- [ ] ARIA labels are present
- [ ] Color contrast meets WCAG AA
- [ ] Screen readers can navigate
- [ ] Focus states are visible

## Cross-Browser Testing

### [ ] Chrome
- [ ] All functionality works
- [ ] Voice input works
- [ ] Theme toggle works

### [ ] Firefox
- [ ] All functionality works
- [ ] Voice input works (limited support)
- [ ] Theme toggle works

### [ ] Safari (iOS)
- [ ] All functionality works
- [ ] Voice input works (limited support)
- [ ] Theme toggle works

## Mobile Responsiveness

### [ ] iPhone (Safari)
- [ ] All pages display correctly
- [ ] Navigation works
- [ ] Forms are usable
- [ ] Buttons are tappable

### [ ] Android (Chrome)
- [ ] All pages display correctly
- [ ] Navigation works
- [ ] Forms are usable
- [ ] Buttons are tappable

### [ ] Tablet
- [ ] Layout adapts correctly
- [ ] Touch targets are appropriate
- [ ] Content is readable

## Test Evidence

### Screenshots/GIFs Required
1. [ ] Theme toggle working across pages
2. [ ] Symptom voice input in all three languages
3. [ ] Appointment booking end-to-end flow
4. [ ] File upload, preview, and download
5. [ ] Hospital links opening in new tabs
6. [ ] Admin users page functionality
7. [ ] Patient dashboard with reports
8. [ ] Doctor appointment flow

### Code Fix Notes
- [ ] Theme implementation uses CSS variables
- [ ] Voice input gracefully degrades for unsupported browsers
- [ ] File validation prevents malicious uploads
- [ ] Authentication uses secure JWT implementation
- [ ] Hospital links use target="_blank" rel="noopener noreferrer"
- [ ] Phone numbers use tel: links
- [ ] All forms have proper validation
- [ ] Error handling is implemented throughout

## Summary of Manual Tests Run

### Theme & Layout
- Verified dark theme is default
- Tested light/dark toggle functionality
- Confirmed theme persistence
- Checked WCAG contrast compliance

### Navigation
- Tested all header links
- Verified mobile menu functionality
- Confirmed smooth scrolling to sections

### Hospital Information
- Verified all hospital data accuracy
- Tested all external links
- Confirmed phone number functionality
- Tested map directions

### Symptom Checker
- Tested text input with spell correction
- Verified voice input in all languages
- Confirmed language detection
- Tested error handling

### Authentication
- Completed patient signup/login
- Completed doctor signup/login
- Tested forgot password flow
- Verified role-based routing

### File Management
- Uploaded various file types
- Tested file size limits
- Verified preview/download functionality
- Confirmed admin access controls

### Appointment Booking
- Completed end-to-end booking flow
- Verified confirmation messages
- Tested date/time selection
- Confirmed success handling

### Admin Functionality
- Tested user management
- Verified role filtering
- Confirmed enable/disable functionality
- Tested report viewing

## Known Issues/Limitations

1. Voice input has limited browser support (best in Chrome)
2. Language detection is simplified and may not be 100% accurate
3. File storage uses local storage in development (Cloudinary/AWS recommended for production)
4. SMS notifications require Twilio account setup
5. Some third-party embeds may have loading delays

## Remediation Plans

1. For voice input limitations: Document browser compatibility and provide text input as fallback
2. For language detection: Implement Google Translate API for production
3. For file storage: Provide Cloudinary/AWS S3 integration guides
4. For SMS: Provide Twilio setup documentation
5. For embeds: Implement lazy loading with loading placeholders