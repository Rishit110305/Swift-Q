import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // 🔙 REVERTED: Hardcoded PIN for now
  const SECRET_PIN = "1234";

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (password === SECRET_PIN) {
      sessionStorage.setItem(`admin-auth-${deptId}`, "true");
      navigate(`/admin/${deptId}/dashboard`);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🔒
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin Access</h2>
        <p className="text-slate-500 mb-6 text-sm">Enter PIN to control the queue.</p>

        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Enter PIN (1234)" 
            className="w-full p-3 border border-slate-300 rounded-lg text-center text-2xl tracking-widest mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            autoFocus
          />
          
          {error && <p className="text-red-500 text-sm mb-4">❌ Incorrect PIN</p>}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition">
            Unlock Panel 🔓
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;