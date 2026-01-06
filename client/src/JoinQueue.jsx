import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext'; 

const JoinQueue = () => {
  const { deptId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [peopleAhead, setPeopleAhead] = useState(0);

  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '' 
  });

  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]); // automatically display the name of patient on the joining page .

  useEffect(() => {
    axios.get('http://localhost:8080/api/departments')
      .then(res => {
        const found = res.data.find(d => d._id === deptId);
        if (found) setDepartment(found);
      })
      .catch(err => console.error("Dept Error:", err));

    axios.get(`http://localhost:8080/api/queue/length/${deptId}`)
      .then(res => {
        setPeopleAhead(res.data.count); 
      })
      .catch(err => console.error("Queue Error:", err));

    setLoading(false);
  }, [deptId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Double check before sending
    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/queue/join', {
        deptId,
        name: formData.name,
        phone: formData.phone,
        userId: user?.id || null 
      });

      alert("Successfully Joined!");
      navigate('/my-tickets'); 
    } catch (err) {
      console.error(err);
      alert("Failed to join queue. Check console for details.");
    }
  };

  // NEW: Strict Phone Number Handler
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers (RegEx) AND max 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!department) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
          <h2 className="text-white text-3xl font-black mb-2">{department.name}</h2>
          <p className="text-blue-100 font-medium uppercase tracking-wider">{department.hospital}</p>
        </div>

        {/* Form */}
        <div className="p-8">
          
          {/* Queue Status */}
          <div className="mb-6 bg-blue-50 p-4 rounded-xl flex items-center gap-4 border border-blue-100">
             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
               ⏱️
             </div>
             <div>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">Queue Status</p>
               <p className="text-slate-800 font-black text-xl leading-none">~ 15 Mins / Person</p>
               <p className="text-sm text-slate-500 font-medium mt-1">
                 Current Queue: <span className="text-blue-600 font-bold">{peopleAhead} People Ahead</span>
               </p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Your Name</label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/50 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Phone Number</label>
              <input 
                type="tel" 
                required 
                maxLength="10" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/50 outline-none"
                placeholder="Ex. 9876543210"
                value={formData.phone}
                onChange={handlePhoneChange} 
              />
              <p className="text-xs text-slate-400 mt-1 ml-1">Must be exactly 10 digits</p>
            </div>

            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg mt-2 transition-all active:scale-95">
              Join Queue 🎫
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default JoinQueue;