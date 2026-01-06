import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/"); // ✅ FIXED: Go to Home, not API
  };

  // 🚀 SEARCH LOGIC: Update URL on Enter
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/?q=${query}`); // Sends query to Home page
      setIsMobileMenuOpen(false); // Close mobile menu if open
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. LOGO - Click goes to Home */}
          <div
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")} // ✅ FIXED
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform hover:rotate-3 transition-transform duration-300">
              <span className="text-white font-black text-xl">Q</span>
            </div>
            <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
              Swift<span className="text-teal-500">Q</span>
            </span>
          </div>

          {/* 2. SEARCH BAR (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Find a department (e.g. Cardio)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch} // ✅ Triggers search on Enter
                className="w-full bg-slate-100/50 border border-slate-200 text-slate-600 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all duration-300"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {/* Visual Hint */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                 <span className="text-xs text-slate-400 opacity-0 group-focus-within:opacity-100 transition-opacity">Press Enter ↵</span>
              </div>
            </div>
          </div>

          {/* 3. DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            {!user && (
              <>
                <Link to="/" className="text-slate-500 hover:text-blue-600 font-medium transition-colors">Home</Link> {/* ✅ FIXED */}
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors">
                    Login
                  </button>
                  <button onClick={() => navigate('/signup')} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    Get Started
                  </button>
                </div>
              </>
            )}

            {user && (
              <div className="flex items-center gap-6">
                {user.role === "patient" ? (
                  <Link to="/my-tickets" className="text-slate-500 hover:text-blue-600 font-medium transition-colors">My Tickets</Link>
                ) : (
                  <Link to="/admin/dashboard" className="text-slate-500 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in-down origin-top-right">
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{user.role}</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      </div>
                      {/* You can add a Profile page route later */}
                      <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Settings</button>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-medium">Sign Out</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. MOBILE HAMBURGER */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-blue-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 5. MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-2xl animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {/* Mobile Search - Now Functional! */}
            <input 
              type="text" 
              placeholder="Search & Press Enter..." 
              className="w-full bg-slate-100 p-3 rounded-xl text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch} 
            />
            
            {!user ? (
              <>
                <Link to="/" className="block px-3 py-2 text-base font-medium text-slate-600 rounded-lg hover:bg-slate-50">Home</Link> {/* ✅ FIXED */}
                <button onClick={() => navigate('/login')} className="w-full text-left px-3 py-2 text-base font-bold text-blue-600 rounded-lg hover:bg-blue-50">Login</button>
              </>
            ) : (
              <>
                <div className="px-3 py-2 bg-slate-50 rounded-xl mb-2">
                  <p className="text-xs text-slate-400 font-bold uppercase">Signed in as</p>
                  <p className="font-bold text-slate-800">{user.name}</p>
                </div>
                {user.role === "patient" ? (
                  <Link to="/my-tickets" className="block px-3 py-2 font-medium text-slate-600 hover:text-blue-600">My Tickets</Link>
                ) : (
                   <Link to="/admin/dashboard" className="block px-3 py-2 font-medium text-slate-600 hover:text-blue-600">Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 font-bold text-red-500 hover:bg-red-50 rounded-lg mt-2">Log Out</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;