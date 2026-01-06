import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  // 1. Get the Department ID from the URL (e.g., /admin/695d...)
  const { deptId } = useParams();
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(""); 
  const [currentPatient, setCurrentPatient] = useState(null);

  // 2. Function to fetch the ticket list from Render
  const fetchTickets = () => {
    console.log("Fetching tickets for Department ID:", deptId);

    // ✅ FIXED: Changed 'departmentId' to 'deptId' to match the variable above
    axios.get(`https://swift-q.onrender.com/api/queue/list/${deptId}`)
      .then(res => {
        console.log("Server replied:", res.data);
        
        // Safety check: ensure tickets is always an array
        const ticketList = res.data.tickets || []; 
        setTickets(ticketList);
        
        // Find if anyone is currently being served
        const serving = ticketList.find(t => t.status === 'serving');
        setCurrentPatient(serving || null);
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard Error:", err);
        setErrorMsg(err.message + (err.response ? ` (Status: ${err.response.status})` : ""));
        setLoading(false);
      });
  };

  // 3. Initial Load & Auto-Refresh
  useEffect(() => {
    if (!deptId) {
      setErrorMsg("Error: Department ID is missing in URL");
      setLoading(false);
      return;
    }
    
    fetchTickets(); // Run immediately
    const interval = setInterval(fetchTickets, 5000); // Run every 5 seconds
    
    return () => clearInterval(interval); // Cleanup on exit
  }, [deptId]);

  // 4. Function to call the next patient
  const callNext = async () => {
    try {
      // ✅ FIXED: Using 'deptId' here as well
      await axios.post('https://swift-q.onrender.com/api/queue/next', { deptId });
      fetchTickets(); // Refresh immediately after update
    } catch (err) {
      alert("Failed to call next patient");
    }
  };

  // --- UI RENDER ---

  if (errorMsg) return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong!</h2>
      <p className="text-slate-600 mb-4">{errorMsg}</p>
      <Link to="/" className="text-blue-500 underline">Go Back Home</Link>
    </div>
  );

  if (loading) return <div className="p-10 text-center text-xl">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-800">Doctor Dashboard 👨‍⚕️</h1>
            
            {/* Opens TV Mode in a new tab */}
            <Link 
              to={`/tv/${deptId}`} 
              target="_blank" 
              className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              📺 Open TV Display
            </Link>
          </div>

          <Link to="/" className="bg-slate-200 px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-300">
            Exit
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: CURRENT PATIENT --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 text-center">
              <h2 className="text-slate-400 font-bold uppercase tracking-wider mb-2">Now Serving</h2>
              {currentPatient ? (
                <>
                  <div className="text-8xl font-black text-blue-600 mb-4">#{currentPatient.ticketNumber}</div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">{currentPatient.patientName}</h3>
                  <p className="text-xl text-slate-500 mb-8">📞 {currentPatient.phone}</p>
                  <button onClick={callNext} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-6 rounded-2xl text-2xl shadow-lg active:scale-95 transition-all">
                    ✅ Complete & Call Next
                  </button>
                </>
              ) : (
                <div className="py-10">
                  <p className="text-2xl text-slate-400 font-medium mb-6">No patient is currently active.</p>
                  <button onClick={callNext} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl text-xl shadow-lg transition-all">
                    📢 Call Next Patient
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT COLUMN: WAITING LIST --- */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-[600px]">
            <div className="bg-slate-100 p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-700">Waiting Queue ({tickets.filter(t => t.status === 'pending').length})</h3>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {tickets.filter(t => t.status === 'pending').length > 0 ? (
                tickets.filter(t => t.status === 'pending').map((t) => (
                  <div key={t._id} className="p-4 mb-2 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg text-slate-800">#{t.ticketNumber}</span>
                      <p className="text-sm text-slate-500 font-medium">{t.patientName}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400">Queue is empty! 🎉</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;