import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import Navbar from './components/Navbar'; 
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './Home';
import JoinQueue from './JoinQueue';
import QueueStatus from './QueueStatus';
import MyTickets from './MyTickets';
import AdminDashboard from './AdminDashboard'; 

// 👇 FIX 1: Import the file you actually created ("TVDisplay")
import TVDisplay from './TVDisplay'; 

// ... (Your PrivateRoute and AdminRoute code is perfect, keep it!) ...
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>; 
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pt-20"> 
      <AuthProvider> 
        <BrowserRouter>
          <Navbar /> 
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected Routes */}
            <Route path="/join/:deptId" element={
              <PrivateRoute>
                <JoinQueue />
              </PrivateRoute>
            } />
            
            <Route path="/my-tickets" element={
              <PrivateRoute>
                <MyTickets />
              </PrivateRoute>
            } />

            <Route path="/status/:deptId" element={<QueueStatus />} />

            {/* Admin Routes */}
            <Route path="/admin/:deptId" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* 👇 FIX 2: Use the TVDisplay component here */}
            <Route path="/tv/:deptId" element={<TVDisplay />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;