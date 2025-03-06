// Google OAuth Client ID
const GOOGLE_CLIENT_ID = '1016374047073-mbaoubnc0g0pnk0vq0vraprmsbmjv35l.apps.googleusercontent.com';

// OAuth configuration
export const GOOGLE_AUTH_CONFIG = {
  clientId: GOOGLE_CLIENT_ID,
  // Define redirect URI - must match what's configured in Google Cloud Console
  redirectUri: window.location.origin + '/auth/google/callback',
  scope: 'email profile',
  responseType: 'code'
};

// Load the Google API client library
export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (document.querySelector('script#google-platform')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-platform';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    document.body.appendChild(script);
  });
};

// Initialize Google client
export const initializeGoogleClient = (): Promise<any> => {
  return new Promise((resolve) => {
    const client = window.google?.accounts?.id?.initialize({
      client_id: GOOGLE_CLIENT_ID,
      ux_mode: 'redirect', // Use redirect mode instead of popup
      redirect_uri: GOOGLE_AUTH_CONFIG.redirectUri, // Add explicit redirect URI
      callback: ({ credential }) => {
        // The callback will be handled by the component
      },
      auto_select: false,
    });
    
    resolve(client);
  });
};

// Initialize OAuth client for redirect flow
export const initializeGoogleOAuth = (): Promise<any> => {
  return new Promise((resolve) => {
    const client = window.google?.accounts?.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_AUTH_CONFIG.scope,
      redirect_uri: GOOGLE_AUTH_CONFIG.redirectUri,
      callback: (response) => {
        // This will be handled by the callback URL
        console.log('OAuth response', response);
      }
    });
    
    resolve(client);
  });
};

// Parse JWT token from Google
export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Get user data from Google JWT credential
export const extractUserDataFromCredential = (credential: string) => {
  const payload = parseJwt(credential);
  if (!payload) return null;
  
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    role: 'user', // Default role for Google auth users
  };
};

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: string;
}
