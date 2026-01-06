import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // State for form fields and UI toggle
  const [role, setRole] = useState("patient"); // 'patient' or 'doctor'
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🚀 REAL AUTHENTICATION
    try {
      // 1. Call the backend login function
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // 2. Login Successful! Redirect based on role.
        // (The backend knows the real role, but for this UI we use your toggle state)
        if (role === 'patient') {
          navigate('/my-tickets'); 
        } else {
          navigate('/');
        }
      } else {
        // 3. Login Failed (Wrong password / User not found)
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl">
        
        {/* HEADER & TOGGLE */}
        <div className={`px-8 pt-8 pb-6 ${role === 'patient' ? 'bg-blue-50' : 'bg-slate-900'} transition-colors duration-500`}>
          <div className="text-center mb-6">
            <h2 className={`text-3xl font-black tracking-tight ${role === 'patient' ? 'text-slate-800' : 'text-white'}`}>
              Welcome Back
            </h2>
            <p className={`text-sm font-medium ${role === 'patient' ? 'text-slate-500' : 'text-slate-400'}`}>
              Please sign in to your account
            </p>
          </div>

          {/* Role Toggle Switch */}
          <div className="bg-white/20 backdrop-blur-sm p-1 rounded-xl flex">
            <button
              onClick={() => setRole("patient")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                role === "patient"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setRole("doctor")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                role === "doctor"
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Doctor
            </button>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 text-center font-medium">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all font-medium text-slate-700"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all font-medium text-slate-700"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs font-bold text-blue-500 hover:text-blue-600">Forgot Password?</a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transform active:scale-95 transition-all duration-300 ${
                role === 'patient' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-blue-500/30' 
                : 'bg-slate-900 hover:bg-slate-800 hover:shadow-slate-900/30'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer / Register Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{" "}
              {/* 🚀 Changed span to Link */}
              <Link to="/signup" className="text-slate-800 font-bold cursor-pointer hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;