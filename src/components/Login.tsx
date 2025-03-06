import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { 
  loadGoogleScript, 
  initializeGoogleClient,
  initializeGoogleOAuth,
  extractUserDataFromCredential,
  GoogleUser 
} from "../utils/GoogleAuth";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [googleOAuthClient, setGoogleOAuthClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Initialize Google Sign-In
  useEffect(() => {
    const initGoogle = async () => {
      try {
        await loadGoogleScript();
        await initializeGoogleClient();
        
        // Initialize the OAuth client
        const oauthClient = await initializeGoogleOAuth();
        setGoogleOAuthClient(oauthClient);
        
        // Render the Google Sign-In button
        if (googleButtonRef.current) {
          window.google?.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: googleButtonRef.current.offsetWidth,
            text: 'continue_with',
            logo_alignment: 'center'
          });
        }
      } catch (error) {
        console.error("Error loading Google Sign-In:", error);
      }
    };

    initGoogle();

    // Set up callback for Google Sign-In
    window.handleGoogleSignIn = (response: any) => {
      if (!response.credential) {
        toast.error("Google sign-in failed");
        return;
      }
      
      handleGoogleAuthSuccess(response.credential);
    };

    return () => {
      // Clean up
      delete window.handleGoogleSignIn;
    };
  }, []);

  const handleGoogleAuthSuccess = (credential: string) => {
    try {
      setIsLoading(true);
      
      // Parse the JWT token to get user information
      const userData = extractUserDataFromCredential(credential);
      
      if (!userData) {
        toast.error("Failed to process Google authentication");
        return;
      }

      // Store user data and authentication state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast.success("Successfully logged in with Google");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to login with Google");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleLoginWithGoogle = () => {
    if (googleOAuthClient) {
      // Use the OAuth redirect flow instead of popup
      googleOAuthClient.requestCode();
    } else {
      window.google?.accounts.id.prompt();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (isLogin) {
        // Admin login
        if (formData.email === "admin@example.com" && formData.password === "admin123") {
          const userData = {
            id: "admin-123",
            name: "Admin User",
            email: formData.email,
            role: "admin",
          };
          
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(userData));
          
          toast.success("Admin login successful");
          navigate("/admin");
          return;
        }
        
        // Demo customer login
        if (formData.email === "user@example.com" && formData.password === "user123") {
          const userData = {
            id: "user-456",
            name: "Demo Customer",
            email: formData.email,
            role: "user",
          };
          
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(userData));
          
          toast.success("Login successful");
          navigate("/dashboard");
          return;
        }
        
        // For other email/password combinations, simulate API check
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      } else {
        // Register logic for new users
        // In a real app, we would make an API call here
        
        // Simulate API request
        const userData = {
          id: "user-" + Math.floor(Math.random() * 1000),
          name: formData.name,
          email: formData.email,
          role: "user",
        };
        
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(userData));
        
        toast.success("Registration successful");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(isLogin ? "Login failed" : "Registration failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-accent/30 p-4">
      <div className="glass-effect rounded-2xl shadow-xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-200 rounded-full opacity-40"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-200 rounded-full opacity-40"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-all duration-500">
              {isLogin ? (
                <LogIn className="w-8 h-8 text-white" />
              ) : (
                <UserPlus className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin
                ? "Sign in to access your account"
                : "Sign up to get started with SessionFlow"}
            </p>
          </div>

          {/* Demo Credentials Notice */}
          {isLogin && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p><strong>Admin:</strong> admin@example.com / admin123</p>
              <p><strong>User:</strong> user@example.com / user123</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 bg-white/50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 bg-white/50 focus:bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 bg-white/50 focus:bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 
                transition-all duration-300 relative overflow-hidden group ${
                  isLoading
                    ? "bg-primary/70 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 active:scale-95"
                }`}
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {isLoading ? (
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
              ) : isLogin ? (
                <LogIn className="w-5 h-5" />
              ) : (
                <UserPlus className="w-5 h-5" />
              )}
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Sign-In Button - Container div for Google's rendered button */}
          <div ref={googleButtonRef} id="google-signin-button" className="w-full"></div>
          
          {/* Fallback button in case the Google button doesn't load */}
          <button
            type="button"
            onClick={handleLoginWithGoogle}
            disabled={isLoading}
            className="w-full mt-3 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-3 
              border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300
              active:scale-95 text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Toggle Form */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleForm}
                className="ml-1 text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

// Add TypeScript declaration for window object
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => any;
          prompt: (callback?: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
        },
        oauth2: {
          initCodeClient: (config: any) => any;
        }
      }
    };
    handleGoogleSignIn: (response: any) => void;
  }
}
