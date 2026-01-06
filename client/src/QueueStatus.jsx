import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const QueueStatus = () => {
  const { deptId } = useParams();
  const location = useLocation(); 
  
  // Extract the ticket number passed from Join Page
  const myTicket = location.state?.myTicket;
  const myName = location.state?.patientName;

  const [status, setStatus] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`https://swift-q.onrender.com/api/queue-status/${deptId}`);
      setStatus(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchStatus();
    const socket = io("https://swift-q.onrender.com");

    // Listen for updates, but ONLY refresh data (no sound)
    socket.on(`update-${deptId}`, () => {
      fetchStatus();
    });

    return () => socket.disconnect();
  }, [deptId]);

  if (!status) return <div className="flex h-screen items-center justify-center text-teal-600">Loading Status...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      
      {/* --- YOUR TICKET CARD --- */}
      {myTicket ? (
         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-3xl shadow-xl w-full max-w-lg text-center mb-6 transform scale-105 border-4 border-white">
            <p className="text-blue-100 font-bold uppercase text-xs tracking-widest mb-1">Your Token Number</p>
            <h1 className="text-6xl font-black drop-shadow-md">#{myTicket}</h1>
            <p className="text-blue-200 text-sm mt-2 font-medium">Hello, {myName || 'Patient'}</p>
         </div>
      ) : (
         <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl mb-6 w-full max-w-lg text-center border border-yellow-200">
            ⚠️ Ticket info lost (Page Refreshed). <Link to={`/join/${deptId}`} className="underline font-bold">Join again?</Link>
         </div>
      )}

      {/* --- DEPARTMENT STATUS CARD --- */}
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl w-full max-w-lg text-center relative overflow-hidden border border-slate-100">
        <h2 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">Live Department Status</h2>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8">{status.deptName}</h1>
        
        <div className="py-8 bg-teal-50/50 rounded-3xl border border-teal-100 mb-8">
          <p className="text-teal-600 text-sm font-bold uppercase tracking-wide mb-2">Now Serving</p>
          <span className="text-7xl font-black text-teal-600">#{status.currentTicket}</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Waiting</p>
            <p className="text-2xl font-bold text-slate-700">{status.queueLength}</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Last Issued</p>
            <p className="text-2xl font-bold text-slate-700">#{status.lastTicket}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;