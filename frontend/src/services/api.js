
import axios from "axios";

export const BASE_URL = "/api";

export const api = axios.create({
  baseURL: `${BASE_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return data ?? [];
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (!error.response) {
      error.message = "Impossible de joindre le serveur. Démarrez Django.";
    } else if (error.response.status === 404) {
      error.message = "Route API introuvable (404).";
    }
    return Promise.reject(error);
  }
);

const storedToken = localStorage.getItem("token");
if (storedToken) setAuthToken(storedToken);
export const connexion = async (username, password) => {
  // Si on reçoit déjà un objet, on l'utilise directement
  let payload = { username, password };
  console.log("Payload envoyé :", payload);
  const response = await api.post("auth/connexion/", payload);
  if (response.data?.token) setAuthToken(response.data.token);
  return response.data;
};

export const login = connexion;

export const inscription = async (donnees) => {
  const isFormData = donnees instanceof FormData;
  const response = await api.post("auth/inscription/", donnees, isFormData ? {} : undefined);
  if (response.data?.token) setAuthToken(response.data.token);
  return response.data;
};

export const rafraichirToken = async (refresh) => {
  const response = await api.post("auth/token/refresh/", { refresh });
  if (response.data?.access) setAuthToken(response.data.access);
  return response.data;
};

// --- PROFIL ---
export const createBebe = async (donneesBebe) => {
  const payload = {
    nom: donneesBebe.nom ?? donneesBebe.nom_complet,
    date_naissance: donneesBebe.date_naissance,
    sexe: donneesBebe.sexe ?? "M",
    poids_naissance: donneesBebe.poids_naissance,
    taille_naissance: donneesBebe.taille_naissance,
    ...(donneesBebe.region != null ? { region: donneesBebe.region } : {}),
  };
  const response = await api.post("profil/bebes/", payload);
  return response.data;
};

export const creatBebe = createBebe;
export const getBebes = async () => {
  const response = await api.get("profil/bebes/");
  return unwrapList(response.data);
};
export const getProfilMedecin = async () => {
  const response = await api.get("profil/medecins/me/");
  return response.data;
};

// --- NUTRITION ---
export const getRepas = async (params = {}) => {
  const response = await api.get("nutrition/repas/", { params });
  return unwrapList(response.data);
};

export const getAliments = async () => {
  const response = await api.get("nutrition/aliments/");
  return unwrapList(response.data);
};

export const creerRepas = async (payload) => {
  const response = await api.post("nutrition/repas/", payload);
  return response.data;
};

export const creerHoraireRepas = async (payload) => {
  const response = await api.post("nutrition/horaires-repas/", payload);
  return response.data;
};

export const creerAliment = async (payload) => {
  const response = await api.post("nutrition/aliments/", payload);
  return response.data;
};

export const creerComposition = async (payload) => {
  const response = await api.post("nutrition/compositions/", payload);
  return response.data;
};

export const publierRepasAuxFamilles = async (repasId) => {
  const response = await api.post(`nutrition/repas/${repasId}/publier_aux_familles/`);
  return response.data;
};

export const getRepasProgrammesAujourdhui = async () => {
  const response = await api.get("nutrition/repas-programmes/aujourd_hui/");
  return unwrapList(response.data);
};

export const toggleAlarmeRepas = async (id) => {
  const response = await api.post(`nutrition/repas-programmes/${id}/toggle_alarm/`);
  return response.data;
};

// --- TÉLÉCONSULTATION ---
export const getConsultations = async () => {
  const response = await api.get("teleconsultation/consultations/");
  return unwrapList(response.data);
};
export const createConsultation = async (donnees) => {
  const response = await api.post("teleconsultation/consultations/", donnees);
  return response.data;
};
export const getCompositionRepas = async (repasId) => {
  const response = await api.get(`nutrition/repas/${repasId}/composition/`);
  return response.data;
};

// --- CROISSANCE ---
export const obtenirMesuresCroissance = async () => {
  const response = await api.get("croissance/mesures/");
  return unwrapList(response.data);
};
export const ajouterMesureCroissance = async (donnees) => {
  const response = await api.post("croissance/mesures/", donnees);
  return response.data;
};

// --- NOTIFICATIONS & RAPPORTS ---
export const getNotifications = async () => {
  const response = await api.get("notifications/notifications/");
  return unwrapList(response.data);
};
export const getRapports = async () => {
  const response = await api.get("rapports/");
  return unwrapList(response.data);
};

api.getBebes = getBebes;
api.getRepas = getRepas;
api.getAliments = getAliments;
api.getRepasProgrammesAujourdhui = getRepasProgrammesAujourdhui;
api.toggleAlarmeRepas = toggleAlarmeRepas;
api.getConsultations = getConsultations;
api.createConsultation = createConsultation;
api.creerRepas = creerRepas;
api.publierRepasAuxFamilles = publierRepasAuxFamilles;

// --- ADMIN DASHBOARD ---
export const getAdminStats = async () => {
  const response = await api.get("admin/statistiques/");
  return response.data;
};
export const getAdminUsers = async () => {
  const response = await api.get("admin/utilisateurs/");
  return response.data;
};
export const getAdminRepas = async () => {
  const response = await api.get("admin/repas/");
  return response.data;
};
export const getAdminBebes = async () => {
  const response = await api.get("admin/bebes/");
  return response.data;
};
export const getAdminMedecins = async () => {
  const response = await api.get("admin/medecins/");
  return response.data;
};

api.getAdminStats = getAdminStats;
api.getAdminUsers = getAdminUsers;
api.getAdminRepas = getAdminRepas;
api.getAdminBebes = getAdminBebes;
api.getAdminMedecins = getAdminMedecins;
