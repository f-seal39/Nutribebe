import { createContext, useState, useContext, useEffect } from "react";
import { connexion } from "../services/api";
//import { useAuth } from "../context/AuthContext";


const AuthContext = createContext();
const BASE_URL = "http://localhost:8000/api";

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(
    JSON.parse(localStorage.getItem("utilisateur")) || null
  );

  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const refresh = localStorage.getItem("refresh");
    if (refresh && !localStorage.getItem("token")) {
      rafraichirToken(refresh);
    }
    setChargement(false);
  }, []);

  const rafraichirToken = async (refresh) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      const data = await res.json();
      if (data.access) localStorage.setItem("token", data.access);
    } catch (e) {
      console.error("Refresh expiré", e);
    }
  };

  const login = async (username, password) => {
    const data = await connexion(username, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));
      setUtilisateur(data.utilisateur);
      return { succes: true };
    }
    return { succes: false, erreur: data.error };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("utilisateur");
    setUtilisateur(null);
  };

  // return (
  //   <AuthContext.Provider value={{ utilisateur, login, logout }}>
  //     {children}
  //   </AuthContext.Provider>
  // );

  return (
    <AuthContext.Provider value={{ utilisateur, chargement, login, logout }}>
      {!chargement ? children : <div style={{ color: "#fff", textAlign: "center", marginTop: "20%" }}>Chargement de l'application...</div>}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);