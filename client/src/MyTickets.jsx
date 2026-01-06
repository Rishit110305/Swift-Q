import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import axios from 'axios';

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:8080/api/queue/user/${user.id}`)
        .then(res => {
          setTickets(res.data.tickets);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return <div className="p-10 text-center">Loading tickets...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">My Active Tickets</h1>

        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <div key={ticket._id} className="bg-white p-6 rounded-2xl shadow-md mb-4 flex justify-between items-center border border-slate-100">
              <div>
                {/* We use ticket.departmentId.name because we .populated() it in the backend */}
                <h2 className="text-xl font-bold text-slate-800">{ticket.departmentId?.name || "Department"}</h2>
                <p className="text-sm text-slate-500 font-bold uppercase">{ticket.departmentId?.hospital || "Hospital"}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">
                  {ticket.status}
                </div>
              </div>
              <div className="text-center bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 font-bold uppercase">Your Number</p>
                <p className="text-4xl font-black text-slate-800">#{ticket.ticketNumber}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-500 mb-4">You have no active tickets.</p>
            <a href="/" className="text-blue-600 font-bold hover:underline">Find a Department</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;