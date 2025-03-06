import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Download,
  Users,
  ShoppingBag,
  IndianRupee,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  LogOut,
  Star,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface Booking {
  id: string;
  name: string;
  age: number;
  sessions: number;
  paymentMethod: "card" | "bank";
  totalAmount: number;
  premiumPlan?: "gold" | "platinum" | null;
  email: string;
  userId: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

// Backend API URL - Fixed to avoid process.env reference error
const API_URL = import.meta.env?.VITE_API_URL  || 'http://localhost:5000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Booking>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<Booking["status"] | "all">("all");
  const [filterPlan, setFilterPlan] = useState<Booking["premiumPlan"] | "all">("all");
  
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [premiumBookings, setPremiumBookings] = useState(0);
  const [recentBookings, setRecentBookings] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real booking data from API - updated endpoint
      const response = await axios.get(`${API_URL}/api/bookings`);
      const bookingsData = response.data;
      
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
      
      // Calculate dashboard metrics
      setTotalRevenue(bookingsData.reduce((sum, booking) => sum + booking.totalAmount, 0));
      setTotalBookings(bookingsData.length);
      setPremiumBookings(bookingsData.filter(booking => booking.premiumPlan).length);
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      setRecentBookings(bookingsData.filter(booking => new Date(booking.createdAt) > oneWeekAgo).length);
      
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters and search
    let result = [...bookings];
    
    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter(booking => booking.status === filterStatus);
    }
    
    // Filter by plan
    if (filterPlan !== "all") {
      result = result.filter(booking => booking.premiumPlan === filterPlan);
    }
    
    // Search by name or email
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        booking => 
          booking.name.toLowerCase().includes(term) || 
          booking.email.toLowerCase().includes(term)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc" 
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      // For numeric fields
      return sortDirection === "asc"
        ? Number(fieldA) - Number(fieldB)
        : Number(fieldB) - Number(fieldA);
    });
    
    setFilteredBookings(result);
  }, [bookings, searchTerm, filterStatus, filterPlan, sortField, sortDirection]);

  const handleSort = (field: keyof Booking) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleDownloadReceipt = async (bookingId: string) => {
    try {
      toast.info("Generating receipt...");
      
      // Updated endpoint from 'receipt' to 'receipts' to match the backend routes
      const response = await axios.get(`${API_URL}/api/receipts/${bookingId}`, {
        responseType: 'blob' // Important for handling file downloads
      });
      
      // Create a download link for the received file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast.error("Failed to download receipt");
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: Booking["status"]) => {
    try {
      // Call API to update booking status - updated endpoint
      await axios.put(`${API_URL}/api/bookings/${bookingId}/status`, {
        status: newStatus
      });
      
      // Update local state after successful API call
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
      
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    }
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "text-green-500 bg-green-50";
      case "pending":
        return "text-yellow-500 bg-yellow-50";
      case "cancelled":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getPlanColor = (plan: Booking["premiumPlan"]) => {
    switch (plan) {
      case "gold":
        return "text-yellow-600 bg-yellow-50";
      case "platinum":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
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
            <div>
              <span className="font-semibold text-xl">SessionFlow</span>
              <span className="text-xs text-primary ml-1 px-2 py-0.5 bg-primary/10 rounded-full">
                Admin
              </span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors px-3 py-1 rounded-lg hover:bg-gray-100"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Revenue",
              value: `₹${(totalRevenue || 0).toLocaleString("en-IN")}`,
              icon: <IndianRupee className="text-green-500" />,
              color: "from-green-500 to-emerald-600",
            },
            {
              title: "Total Bookings",
              value: totalBookings,
              icon: <Calendar className="text-primary" />,
              color: "from-primary to-indigo-600",
            },
            {
              title: "Premium Users",
              value: premiumBookings,
              icon: <Crown className="text-yellow-500" />,
              color: "from-yellow-500 to-amber-600",
            },
            {
              title: "Recent Bookings",
              value: recentBookings,
              icon: <Users className="text-blue-500" />,
              color: "from-blue-500 to-cyan-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="glass-effect rounded-xl p-6 hover-scale transition-all duration-300"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  {stat.icon && <div className="text-white">{stat.icon}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="glass-effect rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as Booking["status"] | "all")}
                  className="pl-8 pr-8 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all duration-300 appearance-none bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Filter size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value as Booking["premiumPlan"] | "all")}
                  className="pl-8 pr-8 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all duration-300 appearance-none bg-white"
                >
                  <option value="all">All Plans</option>
                  <option value="gold">Gold Plan</option>
                  <option value="platinum">Platinum Plan</option>
                  <option value={null}>Standard Plan</option>
                </select>
                <Star size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="glass-effect rounded-xl overflow-hidden mb-8">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-gray-600">
                  <tr>
                    <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">
                        Customer
                        {sortField === "name" && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort("sessions")}>
                      <div className="flex items-center gap-1">
                        Sessions
                        {sortField === "sessions" && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort("totalAmount")}>
                      <div className="flex items-center gap-1">
                        Amount
                        {sortField === "totalAmount" && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort("createdAt")}>
                      <div className="flex items-center gap-1">
                        Date
                        {sortField === "createdAt" && (
                          <ArrowUpDown size={14} className="text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr 
                      key={booking.id} 
                      className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-700">{booking.name}</p>
                          <p className="text-gray-500 text-xs">{booking.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.sessions}
                      </td>
                      <td className="px-6 py-4">
                        {booking.premiumPlan ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(booking.premiumPlan)}`}>
                            {booking.premiumPlan.charAt(0).toUpperCase() + booking.premiumPlan.slice(1)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ₹{(booking.totalAmount ?? 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDownloadReceipt(booking.id)}
                            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Download Receipt"
                          >
                            <Download size={16} className="text-gray-600" />
                          </button>
                          
                          {booking.status !== "confirmed" && (
                            <button
                              onClick={() => handleStatusChange(booking.id, "confirmed")}
                              className="p-1 rounded-lg hover:bg-green-50 transition-colors"
                              title="Confirm Booking"
                            >
                              <CheckCircle2 size={16} className="text-green-500" />
                            </button>
                          )}
                          
                          {booking.status !== "cancelled" && (
                            <button
                              onClick={() => handleStatusChange(booking.id, "cancelled")}
                              className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                              title="Cancel Booking"
                            >
                              <XCircle size={16} className="text-red-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
