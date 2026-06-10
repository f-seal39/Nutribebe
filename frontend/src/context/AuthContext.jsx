import { createContext, useState, useContext, useEffect } from "react";
import { connexion, rafraichirToken, setAuthToken } from "../services/api";
import { getHomeRouteForRole } from "../utils/authRoutes";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(() => {
    const stored = localStorage.getItem("utilisateur");
    return stored ? JSON.parse(stored) : null;
  });
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const refresh = localStorage.getItem("refresh");
    if (refresh && !localStorage.getItem("token")) {
      refreshAccessToken(refresh);
    }
    setChargement(false);
  }, []);

  const refreshAccessToken = async (refresh) => {
    try {
      const data = await rafraichirToken(refresh);
      if (data?.access) {
        setAuthToken(data.access);
      }
    } catch (e) {
      console.error("Refresh expiré", e);
      logout();
    }
  };

  const login = async (username, password) => {
    const data = await connexion(username, password);
    if (data.token) {
      enregistrerSession(data);
      return { succes: true };
    }
    return { succes: false, erreur: data.error };
  };

  const enregistrerSession = (data) => {
    if (data?.token) setAuthToken(data.token);
    if (data?.refresh) localStorage.setItem("refresh", data.refresh);
    if (data?.utilisateur) {
      localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));
      setUtilisateur(data.utilisateur);
    }
    if (data?.profil) {
      localStorage.setItem("profil", JSON.stringify(data.profil));
      localStorage.setItem("profil_type", data.profil_type || "");
    }
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("refresh");
    localStorage.removeItem("utilisateur");
    localStorage.removeItem("profil");
    localStorage.removeItem("profil_type");
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider value={{ utilisateur, chargement, login, logout, enregistrerSession, getHomeRouteForRole }}>
      {!chargement ? children : <div style={{ color: "#fff", textAlign: "center", marginTop: "20%" }}>Chargement...</div>}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);