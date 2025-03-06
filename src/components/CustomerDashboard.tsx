import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Download,
  LogOut,
  ChevronRight,
  User,
  Mail,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Crown,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { api, endpoints } from "../api"; // Add this import

interface Booking {
  _id: string;
  name: string;
  age: number;
  sessions: number;
  paymentMethod: "card" | "bank";
  totalAmount: number;
  premiumPlan?: "gold" | "platinum" | null;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("User data not found. Please login again.");
        navigate("/login");
        return;
      }
      
      const user = JSON.parse(storedUser);
      const userId = user._id || user.id;
      
      if (!userId) {
        toast.error("User ID not found. Please login again.");
        navigate("/login");
        return;
      }
      
      const response = await endpoints.bookings.getByUser(userId);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReceipt = async (bookingId: string) => {
    try {
      toast.info("Generating receipt...");
      
      // Use the API endpoints to download the receipt
      const response = await endpoints.receipts.download(bookingId);
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Receipt-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast.error("Failed to download receipt");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const getStatusIcon = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="text-green-500" size={18} />;
      case "pending":
        return <AlertCircle className="text-yellow-500" size={18} />;
      case "cancelled":
        return <XCircle className="text-red-500" size={18} />;
      default:
        return null;
    }
  };

  const getPlanBadge = (plan: Booking["premiumPlan"]) => {
    if (!plan) return null;
    
    const iconClass = plan === "gold" 
      ? "text-yellow-500 bg-yellow-50 border-yellow-200" 
      : "text-purple-500 bg-purple-50 border-purple-200";
    
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${iconClass}`}>
        <Crown size={12} />
        <span>{plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent/20">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-xl">SessionFlow</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="/booking" 
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              Book New Session
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors px-3 py-1 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Section */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-xl p-6 sticky top-24">
              <div className="mb-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-indigo-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold">{userData?.name || "User"}</h2>
                <p className="text-gray-500 text-sm">{userData?.email || "user@example.com"}</p>
              </div>
              
              <div className="space-y-4">
                <a 
                  href="/booking" 
                  className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium flex items-center justify-center gap-2 
                    hover:bg-primary/90 transition-all duration-300 hover-scale"
                >
                  <Calendar size={18} />
                  Book New Session
                </a>
                
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium flex items-center justify-center gap-2 
                    hover:bg-gray-50 transition-all duration-300"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
              
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-yellow-500" size={18} />
                  <h3 className="font-medium text-yellow-700">Upgrade to Premium</h3>
                </div>
                <p className="text-sm text-yellow-600 mb-3">
                  Unlock exclusive benefits with our Gold or Platinum plans.
                </p>
                <a 
                  href="/booking" 
                  className="text-xs font-medium text-yellow-700 flex items-center hover:underline"
                >
                  Learn More
                  <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Bookings List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Your Bookings</h1>
              <p className="text-gray-500">Manage your scheduled sessions</p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="glass-effect rounded-xl p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-6">Book your first session to get started</p>
                <a 
                  href="/booking" 
                  className="py-2 px-4 rounded-lg bg-primary text-white font-medium inline-flex items-center gap-2 
                    hover:bg-primary/90 transition-all duration-300"
                >
                  <Calendar size={16} />
                  Book Now
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking._id} 
                    className="glass-effect rounded-xl p-5 hover-scale transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{booking.sessions} {booking.sessions === 1 ? "Session" : "Sessions"}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPlanBadge(booking.premiumPlan)}
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border border-gray-100">
                          {getStatusIcon(booking.status)}
                          <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-gray-800 ml-1">₹{booking.totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadReceipt(booking._id)}
                          className="py-1.5 px-3 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-1 
                            hover:bg-gray-100 transition-colors border border-gray-100"
                        >
                          <Download size={14} />
                          Receipt
                        </button>
                        
                        {booking.status === "confirmed" && (
                          <a 
                            href="/booking" 
                            className="py-1.5 px-3 rounded-lg bg-primary/10 text-primary text-sm font-medium 
                              hover:bg-primary/20 transition-colors"
                          >
                            Book Again
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
