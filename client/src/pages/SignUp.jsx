import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await register({ ...formData, role });
    
    if (result.success) {
      alert("Account created! Please log in.");
      navigate('/login');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className={`px-8 pt-8 pb-6 ${role === 'patient' ? 'bg-blue-50' : 'bg-slate-900'} transition-colors duration-500`}>
          <div className="text-center mb-6">
            <h2 className={`text-3xl font-black ${role === 'patient' ? 'text-slate-800' : 'text-white'}`}>Create Account</h2>
          </div>
          
          {/* Role Toggle */}
          <div className="bg-white/20 backdrop-blur-sm p-1 rounded-xl flex">
            <button onClick={() => setRole("patient")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === "patient" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-white"}`}>Patient</button>
            <button onClick={() => setRole("doctor")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === "doctor" ? "bg-teal-500 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>Doctor</button>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 text-center">{error}</div>}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="John Doe" onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input type="email" name="email" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="name@example.com" onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input type="password" name="password" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="••••••••" onChange={handleChange} />
            </div>

            <button type="submit" disabled={loading} className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg ${role === 'patient' ? 'bg-blue-600' : 'bg-slate-900'}`}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;