import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // for react animation purpose .

const TVMode = () => {
  const { deptId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [department, setDepartment] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);

  // Fetch data loop
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Dept Name
        if (!department) {
          const deptRes = await axios.get('http://localhost:8080/api/departments');
          const found = deptRes.data.find(d => d._id === deptId);
          if (found) setDepartment(found);
        }

        // 2. Get Tickets
        const res = await axios.get(`http://localhost:8080/api/queue/list/${deptId}`);
        setTickets(res.data.tickets);

        // 3. Find who is being served
        const serving = res.data.tickets.find(t => t.status === 'serving');
        setCurrentTicket(serving || null);

      } catch (err) {
        console.error("TV Mode Error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds (stays updated by fetching fresh data every 3 seconds)
    return () => clearInterval(interval);
  }, [deptId, department]);

  if (!department) return <div className="h-screen bg-black text-white flex items-center justify-center text-4xl animate-pulse">Loading System...</div>;

  // Filter pending tickets for the "Up Next" list
  const pendingTickets = tickets.filter(t => t.status === 'pending').slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden font-sans selection:bg-none cursor-none">
      
      {/* Top Header */}
      <div className="bg-slate-800 p-6 flex justify-between items-center shadow-2xl border-b border-slate-700">
        <h1 className="text-4xl font-bold tracking-wider text-blue-400 uppercase">{department.name}</h1>
        <div className="text-2xl font-mono text-slate-400">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-100px)]">

        {/* LEFT: NOW SERVING (BIG) */}
        <div className="flex flex-col items-center justify-center border-r border-slate-800 p-10 bg-gradient-to-br from-slate-900 to-slate-800 relative">
          
          <h2 className="text-3xl uppercase tracking-[0.2em] text-slate-400 font-bold mb-8">Now Serving</h2>
          
          <AnimatePresence mode='wait'>
            {currentTicket ? (
              <motion.div 
                key={currentTicket._id}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                {/* Glowing Background Effect */}
                <div className="absolute inset-0 bg-green-500 blur-[100px] opacity-20 rounded-full"></div>
                
                {/* The Big Number */}
                <div className="text-[15rem] leading-none font-black text-white drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
                  #{currentTicket.ticketNumber}
                </div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl text-green-400 font-bold text-center mt-4 bg-slate-800/50 px-6 py-2 rounded-full border border-green-500/30"
                >
                  {currentTicket.patientName}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="text-8xl mb-4">☕️</div>
                <p className="text-3xl text-slate-500 font-light">Please wait...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: UP NEXT LIST */}
        <div className="bg-slate-900 p-10 flex flex-col justify-center">
          <h3 className="text-2xl uppercase tracking-widest text-slate-500 font-bold mb-8 border-b border-slate-700 pb-4">
            Up Next
          </h3>

          <div className="space-y-6">
            <AnimatePresence>
              {pendingTickets.length > 0 ? (
                pendingTickets.map((t, index) => (
                  <motion.div
                    key={t._id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ delay: index * 0.1 }} // Stagger effect
                    className="flex justify-between items-center bg-slate-800 p-6 rounded-2xl border-l-8 border-blue-500 shadow-lg"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-5xl font-bold text-white">#{t.ticketNumber}</span>
                      <span className="text-2xl text-slate-300 truncate max-w-[200px]">{t.patientName}</span>
                    </div>
                    <div className="text-xl text-blue-400 font-bold">
                       Wait: ~{(index + 1) * 15}m
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-slate-600 text-2xl italic">Queue is empty</div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Bottom Info */}
          <div className="mt-auto pt-10 text-center">
            <p className="text-slate-500 text-lg">
              Please have your documents ready when your number is called.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TVMode;