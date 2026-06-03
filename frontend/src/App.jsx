// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Splash from "./pages/Splash";
// import { useAuth } from "./context/AuthContext";
// import Login from "./pages/Login";
// import Inscription from "./pages/Inscription";
// import InscriptionMedecin from "./pages/InscriptionMedecin";
// import MedecinRepas from "./pages/MedecinRepas";
// import RestrictedPage from "./pages/RestrictedPage";
// // import Dashboard from "./pages/Dashboard"; // Ou le chemin vers votre dossier pages/Dashboard

// function RoutesProtegees({ children }) {
//   // Temporarily bypass auth checks while debugging rendering
//   return children;
// }

// export default function App() {
//   const { utilisateur, chargement } = useAuth();
// if (chargement) return null;
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Splash />} />
//         <Route path="/connexion" element={<Login />} />
//         <Route path="/inscription" element={<Inscription />} />
//         {/* <Route path="/inscription-medecin" element={<InscriptionMedecin />} /> */}
//         <Route path="/profil-bebe" element={<RestrictedPage />} />
//         {/* <Route path="/dashboard" element={<Dashboard />} /> */}
//         <Route path="/repas" element={<RestrictedPage />} />
//         <Route path="/medecin/repas" element={<RoutesProtegees><MedecinRepas /></RoutesProtegees>} />
//         <Route path="/croissance" element={<RestrictedPage />} />
//         <Route path="/teleconsultation" element={<RestrictedPage />} />
//         <Route path="/notifications" element={<RestrictedPage />} />
//         <Route path="/rapports" element={<RestrictedPage />} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </BrowserRouter>
//   );
//   if (!utilisateur) {
//   return <Navigate to="/connexion" />;
// }
// return <Dashboard />;
// }


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Dashboard from './pages/Dashboard';
//import { getAliments } from "../services/api"; // <-- LE VOILÀ
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Inscription from "./pages/Inscription";
import InscriptionMedecin from "./pages/InscriptionMedecin";
import MedecinRepas from "./pages/MedecinRepas";
import RestrictedPage from "./pages/RestrictedPage";

function RoutesProtegees({ children }) {
  // Temporarily bypass auth checks while debugging rendering
  return children;
}

export default function App() {
  const { utilisateur, chargement } = useAuth();

  // 1. On attend impérativement la fin du chargement du token
  if (chargement) return null;

  // 2. On centralise le routeur principal pour éviter les redirections hors-contexte
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages Publiques ou d'aiguillage */}
        <Route path="/" element={<Splash />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Pages Soumises à restrictions */}
        <Route path="/profil-bebe" element={<RestrictedPage />} />
        <Route path="/repas" element={<RestrictedPage />} />
        <Route path="/medecin/repas" element={<RoutesProtegees><MedecinRepas /></RoutesProtegees>} />
        <Route path="/croissance" element={<RestrictedPage />} />
        <Route path="/teleconsultation" element={<RestrictedPage />} />
        <Route path="/notifications" element={<RestrictedPage />} />
        <Route path="/rapports" element={<RestrictedPage />} />
        
        {/* Redirection globale sécurisée utilisant "replace" pour briser définitivement la boucle */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}