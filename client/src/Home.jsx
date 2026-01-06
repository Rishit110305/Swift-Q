import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Fuse from 'fuse.js'; 
import { useAuth } from './context/AuthContext'; // 1. Ensure Auth is imported

const Home = () => {
  const { user } = useAuth(); // 2. Get the current user
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams(); 
  
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8080/api/departments')
      .then(res => {
        setDepartments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(departments, {
      keys: ['name', 'hospital'],
      threshold: 0.3,
    });
  }, [departments]);

  const filteredDepartments = searchQuery 
    ? fuse.search(searchQuery).map(result => result.item) 
    : departments;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 pt-28">
      
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Welcome to <span className="text-blue-600">SwiftQ</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Skip the waiting room. Select a department below to get your digital ticket instantly.
        </p>
        
        {searchQuery && (
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-sm animate-fade-in">
            <span>🔍 Searching for: "{searchQuery}"</span>
            <Link to="/" className="hover:text-blue-900 ml-2 text-lg leading-none">&times;</Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        /* Department Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept) => (
              <div key={dept._id} className="bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-slate-100 group hover:-translate-y-1">
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{dept.name}</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{dept.hospital}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                    🏥
                  </div>
                </div>

                <div className="flex gap-4">
                  
                  {/* ✅ LOGIC CHANGE 1: "Get Ticket" is HIDDEN for Admins */}
                  {/* Show only if user is NOT an admin (Guest or Patient) */}
                  {user?.role !== 'admin' && (
                    <Link 
                      to={`/join/${dept._id}`}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl text-center shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                    >
                      Get Ticket 🎫
                    </Link>
                  )}
                  
                  {/* ✅ LOGIC CHANGE 2: "Admin" is ONLY visible for Admins */}
                  {user?.role === 'admin' && (
                    <Link 
                      to={`/admin/${dept._id}`}
                      className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-center shadow-lg active:scale-95 transition-all"
                    >
                      Admin Dashboard 🔒
                    </Link>
                  )}

                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-400">
              <p className="text-xl font-medium">No departments found matching "{searchQuery}"</p>
              <Link to="/" className="text-blue-600 font-bold mt-2 inline-block hover:underline">Clear Search</Link>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Home;