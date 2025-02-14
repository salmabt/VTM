import React , { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import './App.css';
import Register from './Auth/Register';
import Login from './Auth/Login';
import PendingApproval from './pages/PendingApproval';
import AdminDashboard from './pages/AdminDashboard';
import GestionnaireDashboard from './pages/GestionnaireDashboard';
import TechnicienDashboard from './pages/TechnicienDashboard';
import { useAuth } from './contexts/AuthContext';
import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Orders, Calendar, Employees, Stacked, Pyramid, Customers, Kanban, Line, Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor } from './pages';
import { useStateContext } from './contexts/ContextProvider';



const App = () => {
  const { isAuthenticated, userData } = useAuth();

  // Fonction pour déterminer la route du tableau de bord selon le rôle
  const getDashboardRoute = () => {
    // Si l'utilisateur n'est pas authentifié ou si son rôle est invalide, redirige vers /login
    if (!isAuthenticated || !userData || !userData.role) return "/login";

    // Vérification du rôle et redirection correspondante
    switch (userData.role) {
      case "admin":
        return "/admin-dashboard";
      case "gestionnaire":
        return "/gestionnaire-dashboard";
      case "technicien":
        return "/technicien-dashboard";
      default:
        return "/login"; // Sécurité : redirige vers /login si le rôle est inconnu
    }
  };
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
    <Router>
    <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <TooltipComponent
              content="Settings"
              position="Top"
            >
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: '50%' }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>

            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            <div>
              {themeSettings && (<ThemeSettings />)}
         
      <Routes>
        {/* Redirection dynamique après connexion */}
        <Route path="/" element={!isAuthenticated ? <Register /> : <Navigate to={getDashboardRoute()} />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={getDashboardRoute()} />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={getDashboardRoute()} />} />

        {/* Routes des tableaux de bord */}
        <Route path="/admin-dashboard" element={isAuthenticated && userData.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/gestionnaire-dashboard" element={isAuthenticated && userData.role === 'gestionnaire' ? <GestionnaireDashboard /> : <Navigate to="/login" />} />
        <Route path="/technicien-dashboard" element={isAuthenticated && userData.role === 'technicien' ? <TechnicienDashboard /> : <Navigate to="/login" />} />
         
          {/* pages  */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/customers" element={<Customers />} />

                {/* apps  */}
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/color-picker" element={<ColorPicker />} />

                {/* charts  */}
                <Route path="/line" element={<Line />} />
                <Route path="/area" element={<Area />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/financial" element={<Financial />} />
                <Route path="/color-mapping" element={<ColorMapping />} />
                <Route path="/pyramid" element={<Pyramid />} />
                <Route path="/stacked" element={<Stacked />} />

        {/* Route par défaut : redirection si URL inconnue */}
        <Route path="*" element={<Navigate to={isAuthenticated ? getDashboardRoute() : "/login"} />} />
      </Routes>


      </div>
            <Footer />
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;
