import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../api';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from the URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        
        if (!code) {
          setError('No authorization code received from Google');
          toast.error('Google authentication failed');
          return;
        }
        
        // In a real application, you would exchange this code for tokens
        // by making a request to your backend API
        // For this demo, we'll simulate a successful authentication
        
        // Simulate API request to exchange code for user data
        // const response = await api.post('/api/auth/google', { code });
        // const userData = response.data;
        
        // For demo purposes, create a mock user
        const userData = {
          id: 'google-' + Math.random().toString(36).substring(2, 15),
          name: 'Google User',
          email: 'google-user@example.com',
          picture: 'https://ui-avatars.com/api/?name=Google+User&background=random',
          role: 'user',
        };
        
        // Store user data in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success('Successfully authenticated with Google');
        navigate('/dashboard');
      } catch (err) {
        console.error('Google authentication error:', err);
        setError('Failed to process Google authentication');
        toast.error('Google authentication failed');
      } finally {
        setIsProcessing(false);
      }
    };
    
    handleCallback();
  }, [location, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-accent/30">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold">Processing your login...</h2>
        <p className="text-gray-600 mt-2">Please wait while we authenticate you</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-accent/30">
        <div className="bg-red-100 p-4 rounded-lg mb-4">
          <h2 className="text-red-800 font-semibold text-xl">Authentication Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
