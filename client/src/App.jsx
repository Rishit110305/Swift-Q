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
import TVMode from './TVMode';

// 1. NEW SECURITY GUARD: "Private Route"
// Checks if ANY user is logged in. If not, sends them to Login.
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  
  if (!user) {
    // If not logged in, go to Login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

// (Keep your AdminRoute code here as is...)
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
            
            {/*  PROTECTED PATIENT ROUTES */}
            {/* Now you MUST be logged in to join or see tickets */}
            
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

            {/* Public Route (Can check status without login) */}
            <Route path="/status/:deptId" element={<QueueStatus />} />

            {/* Admin Routes */}
            <Route path="/admin/:deptId" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            <Route path="/admin/:deptId/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            <Route path="/tv/:deptId" element={<TVMode />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;