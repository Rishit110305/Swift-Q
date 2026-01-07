import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TVDisplay = () => {
  const { deptId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the current serving ticket
  const fetchCurrentTicket = () => {
    axios.get(`https://swift-q.onrender.com/api/queue/list/${deptId}`)
      .then(res => {
        // Find the ticket with status 'serving'
        const serving = (res.data.tickets || []).find(t => t.status === 'serving');
        setTicket(serving || null);
        setLoading(false);
      })
      .catch(err => console.error("TV Error:", err));
  };

  useEffect(() => {
    fetchCurrentTicket();
    // Refresh every 3 seconds to keep it real-time
    const interval = setInterval(fetchCurrentTicket, 3000);
    return () => clearInterval(interval);
  }, [deptId]);

  if (loading) return <div className="h-screen flex items-center justify-center text-4xl font-bold">Loading TV...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-10">
      
      {ticket ? (
        <div className="animate-pulse">
          <h1 className="text-6xl font-bold text-slate-400 mb-8 uppercase tracking-widest">Now Serving</h1>
          
          <div className="bg-white text-black rounded-[50px] px-20 py-16 shadow-[0_0_50px_rgba(37,99,235,0.5)]">
            <div className="text-[12rem] font-black text-blue-600 leading-none mb-4">
              #{ticket.ticketNumber}
            </div>
            <div className="text-5xl font-bold text-slate-800">
              {ticket.patientName}
            </div>
          </div>

          <p className="mt-12 text-3xl text-slate-500">Please proceed to the doctor's room</p>
        </div>
      ) : (
        <div>
          <h1 className="text-5xl font-bold text-slate-500 mb-4">Waiting for Next Patient...</h1>
          <div className="text-8xl">☕</div>
        </div>
      )}

    </div>
  );
};

export default TVMode;