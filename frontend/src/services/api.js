import axios from "axios";

// Instance de base demandée par tes composants
export const api = axios.create({
  baseURL: "http://127.0.0.1:9000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to set auth token for subsequent requests
export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

// --- AUTHENTIFICATION ---

// Fonction de connexion (demandée par AuthContext.jsx)
export const connexion = async (usernameOrPayload, password) => {
  try {
    let payload = usernameOrPayload;
    if (typeof usernameOrPayload === "string" && password !== undefined) {
      payload = { username: usernameOrPayload, password };
    }
    const response = await api.post("auth/connexion/", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur connexion :", error?.response || error);
    throw error;
  }
};
// Alias au cas où un autre composant l'appelle login
export const login = connexion;

// Fonction d'inscription
// export const inscription = async (donneesUtilisateur) => {
//   try {
//     const response = await api.post("auth/inscription/", donneesUtilisateur);
//     return response.data;
//   } catch (error) {
//     console.error("Erreur inscription :", error);
//     throw error;
//   }
// };

// export const inscription = async (donnees) => {
//   try {
//     const response = await axios.post('/api/auth/inscription/', donnees); // Votre URL actuelle
//     return response.data;
//   } catch (error) {
//     // On extrait le message détaillé du serveur s'il existe
//     if (error.response && error.response.data) {
//       console.error("Détails de l'erreur backend :", error.response.data);
//       // Rejeter la promesse avec les vraies données d'erreur pour InscriptionMedecin.jsx
//       throw error.response.data;
//     }
//     throw error;
//   }
// };

// Fonction d'inscription corrigée utilisant l'instance 'api'
export const inscription = async (donnees) => {
  try {
    // Utilisation de api.post à la place de axios.post
    const response = await api.post("auth/inscription/", donnees); 
    console.log(response);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Détails de l'erreur backend :", error.response.data);
      throw error.response.data;
    }
    throw error;
  }
};


// --- PROFIL BÉBÉ ---

// Double export pour couvrir toutes les variantes de nommage (avec et sans 'e')
export const createBebe = async (donneesBebe) => {
  try {
    const response = await api.post("bebes/", donneesBebe);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du bébé :", error);
    throw error;
  }
};
export const creatBebe = createBebe;


// --- FONCTIONS GENERIQUES (Pour éviter les crashs d'imports) ---
export const obtenirMesuresCroissance = async () => { return []; };
export const ajouterMesureCroissance = async () => { return null; };
export const getNotifications = async () => { return []; };
export const getRapports = async () => { return []; };