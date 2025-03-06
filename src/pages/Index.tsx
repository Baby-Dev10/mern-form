
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Star } from 'lucide-react';
import { toast } from "sonner";

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (path === "/booking" && !isAuthenticated) {
      toast.info("Please login first to book a session");
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (!isAuthenticated) {
      toast.info("Please login first to book a session");
      navigate("/login");
    } else {
      navigate("/booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent/30 overflow-hidden">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="font-semibold text-xl">SessionFlow</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
          <a 
            href="/booking" 
            onClick={(e) => handleNavigation(e, "/booking")} 
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Book Session
          </a>
          {localStorage.getItem("isAuthenticated") === "true" ? (
            <a
              href="/dashboard"
              onClick={(e) => handleNavigation(e, "/dashboard")}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Dashboard
            </a>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-primary transition-colors">Login</Link>
          )}
        </nav>
        
        <button 
          onClick={handleBookNow}
          className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20"
        >
          Book Now
        </button>
      </header>

      {/* Hero Section */}
      <section className={`container mx-auto py-20 px-4 transition-all duration-1000 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              Streamlined Session Booking
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Book Your Perfect Session Experience
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Effortlessly schedule and manage your sessions with our intuitive booking platform. Experience simplicity at its finest.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleBookNow}
              className="bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20 hover-scale"
            >
              Book a Session
            </button>
            <Link 
              to="/login" 
              className="bg-white text-primary px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 border border-gray-100 shadow-md hover:shadow-lg hover-scale"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-20 px-4">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <Calendar className="w-10 h-10 text-primary" />,
              title: "Easy Scheduling",
              description: "Book sessions with just a few clicks. Our intuitive interface makes scheduling effortless."
            },
            {
              icon: <Star className="w-10 h-10 text-yellow-500" />,
              title: "Premium Plans",
              description: "Unlock exclusive benefits with our Gold and Platinum premium plans."
            },
            {
              icon: <User className="w-10 h-10 text-indigo-500" />,
              title: "Personalized Experience",
              description: "Get a customized session experience tailored to your specific needs."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`glass-effect p-8 rounded-2xl hover-scale transition-all duration-500 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto py-10 px-4 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">SessionFlow</span>
          </div>
          
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SessionFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
