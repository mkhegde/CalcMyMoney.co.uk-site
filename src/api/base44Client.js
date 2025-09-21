import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68ae2f8e0f23b36de7e53638", 
  requiresAuth: true // Ensure authentication is required for all operations
});
