import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Inscription from "./pages/Inscription";
import InscriptionMedecin from "./pages/InscriptionMedecin";
import MedecinRepas from "./pages/MedecinRepas";
import Repas from "./pages/Repas";
import ProfilBebe from "./pages/ProfilBebe";
import RestrictedPage from "./pages/RestrictedPage";
import { getHomeRouteForRole } from "./utils/authRoutes";
import MedecinDashboard from "./pages/MedecinDashboard";
import EditRepas from "./pages/EditRepas";
import Messagerie from "./pages/Messagerie";
import ProfilParent from "./pages/ProfilParent";



function RoutesProtegees({ children, roles }) {
  const { utilisateur } = useAuth();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/connexion" replace />;
  }

  if (roles?.length && utilisateur?.role && !roles.includes(utilisateur.role)) {
    return <Navigate to={getHomeRouteForRole(utilisateur.role)} replace />;
  }

  return children;
}

export default function App() {
  const { chargement } = useAuth();

  if (chargement) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/inscription-medecin" element={<InscriptionMedecin />} />

        <Route
          path="/dashboard"
          element={
            <RoutesProtegees roles={["parent"]}>
              <Dashboard />
            </RoutesProtegees>
          }
        />
        <Route
          path="/profil-bebe"
          element={
            <RoutesProtegees roles={["parent"]}>
              <ProfilBebe />
            </RoutesProtegees>
          }
        />
        <Route
          path="/repas"
          element={
            <RoutesProtegees roles={["parent"]}>
              <Repas />
            </RoutesProtegees>
          }
        />
        <Route
          path="/medecin/repas"
          element={
            <RoutesProtegees roles={["medecin"]}>
              <MedecinRepas />
            </RoutesProtegees>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RoutesProtegees roles={["admin"]}>
              <AdminDashboard />
            </RoutesProtegees>
          }
        />
            

        <Route
          path="/medecin/dashboard"
          element={
            <RoutesProtegees roles={["medecin"]}>
              <MedecinDashboard />
            </RoutesProtegees>
          }
        />

        <Route path="/profil" element={<ProfilParent />} />

        <Route path="/messagerie" element={<Messagerie />} />

        
        <Route path="/medecin/repas/edit/:id" element={
          <RoutesProtegees roles={["medecin"]}>
            <EditRepas />
          </RoutesProtegees>
        } />

       
        <Route path="/admin/dashboard" element={
          <RoutesProtegees roles={["admin"]}>
            <AdminDashboard />
          </RoutesProtegees>
        } />

        <Route path="/messagerie" element={<Messagerie />} />

        <Route path="/croissance" element={<RestrictedPage />} />
        <Route path="/teleconsultation" element={<RestrictedPage />} />
        <Route path="/notifications" element={<RestrictedPage />} />
        <Route path="/rapports" element={<RestrictedPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
