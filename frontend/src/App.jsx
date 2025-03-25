//App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home'; // Importez votre nouveau composant Home
import About from './pages/About';
import Register from './Auth/Register';
import Login from './Auth/Login';
import PendingApproval from './pages/PendingApproval';
import AdminDashboard from './pages/AdminDashboard';
import GestionnaireDashboard from './pages/GestionnaireDashboard';
import TechnicienDashboard from './pages/TechnicienDashboard';
import { useAuth } from './contexts/AuthContext';
//import { useStateContext } from './contexts/ContextProvider';

const App = () => {
  const { isAuthenticated, userData } = useAuth();

  // Fonction pour déterminer la route du tableau de bord selon le rôle
  const getDashboardRoute = () => {
    if (!isAuthenticated || !userData || !userData.role) return "/login";

    switch (userData.role) {
      case "admin":
        return "/admin-dashboard";
      case "gestionnaire":
        return "/gestionnaire-dashboard";
      case "technicien":
        return "/technicien-dashboard";
      default:
        return "/login";
    }
  };

  

  return (
    <Router>
      <Routes>
        {/* Redirection dynamique après connexion */}
        <Route path="/" element={!isAuthenticated ? <Home /> : <Navigate to={getDashboardRoute()} />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={getDashboardRoute()} />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={getDashboardRoute()} />} />

        {/* Routes des tableaux de bord */}
        <Route path="/admin-dashboard" element={isAuthenticated && userData.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/gestionnaire-dashboard" element={isAuthenticated && userData.role === 'gestionnaire' ? <GestionnaireDashboard /> : <Navigate to="/login" />} />
        <Route path="/technicien-dashboard" element={isAuthenticated && userData.role === 'technicien' ? <TechnicienDashboard /> : <Navigate to="/login" />} />

        {/* Route par défaut : redirection si URL inconnue */}
        <Route path="*" element={<Navigate to={isAuthenticated ? getDashboardRoute() : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
