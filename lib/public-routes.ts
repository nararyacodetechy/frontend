// lib/public-routes.ts
// List of routes accessible without authentication
export const PUBLIC_ROUTES = [
  '/',                           // Homepage
  '/auth/login',                // Login page
  '/auth/login/success',        // Login success redirect
  '/auth/register',             // Registration page
  '/auth/register/success',     // Registration success redirect
  '/auth/verify-email-sent',    // Email verification sent page
  '/auth/forgot-password',      // Forgot password page
  '/auth/reset-password',       // Reset password page
  '/auth/verify-email',         // Email verification page
];