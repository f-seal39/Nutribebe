/** Route d'accueil selon le rôle renvoyé par le backend */
// export function getHomeRouteForRole(role) {
//   if (role === "medecin") return "/medecin/repas";
//   if (role === "admin") return "/admin/dashboard";
//   return "/dashboard";
// }

export function getHomeRouteForRole(role) {
  if (role === "medecin") return "/medecin/dashboard";  // ← changer ici
  if (role === "admin") return "/admin/dashboard";
  return "/dashboard";
}

/** Extrait un message lisible depuis une réponse d'erreur DRF ou Axios */
export function formatApiErrors(data) {
  if (!data) return "Une erreur est survenue. Veuillez réessayer.";
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (typeof data !== "object") return String(data);
  if (typeof data.detail === "string") return data.detail;
  const parts = [];
  for (const [, value] of Object.entries(data)) {
    const label = Array.isArray(value) ? value.join(" ") : String(value);
    parts.push(label);
  }
  return parts.join(" ") || "Vérifiez les informations fournies.";
}

/** Affiche l'heure HH:MM depuis l'API */
export function formatHeure(heure) {
  if (!heure) return "—";
  const s = String(heure);
  return s.length >= 5 ? s.substring(0, 5) : s;
}
