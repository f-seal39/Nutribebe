// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { api, publierRepasAuxFamilles } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { COLORS } from "../constants/colors";
// import { 
//   Plus, LogOut, Trash2, CalendarClock, Edit, 
//   Home, Utensils, Activity, User, Bell
// } from "lucide-react";

// export default function MedecinDashboard() {
//   const navigate = useNavigate();
//   const { logout } = useAuth();
//   const [repasList, setRepasList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [publishing, setPublishing] = useState(null);

//   useEffect(() => {
//     fetchRepas();
//   }, []);

//   const fetchRepas = async () => {
//     try {
//       const data = await api.getRepas();
//       setRepasList(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Impossible de charger les repas.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePublish = async (repasId) => {
//     setPublishing(repasId);
//     try {
//       const result = await publierRepasAuxFamilles(repasId);
//       alert(`Publié ! ${result.programmes_crees} créneaux ajoutés.`);
//     } catch {
//       alert("Erreur publication.");
//     } finally {
//       setPublishing(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Supprimer ce repas ?")) return;
//     try {
//       await api.delete(`nutrition/repas/${id}/`);
//       setRepasList(prev => prev.filter(r => r.id !== id));
//     } catch {
//       alert("Erreur suppression.");
//     }
//   };

//   if (loading) return <div className="text-center p-10">Chargement...</div>;
//   if (error) return <div className="text-red-500 p-10">{error}</div>;

//   return (
//     <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
//       <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        
//         {/* Header */}
//         <header style={{
//           position: "sticky", top: 0, zIndex: 40,
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//           padding: "0 20px", height: "64px",
//           backgroundColor: "rgba(248,249,250,0.92)", backdropFilter: "blur(8px)",
//           borderBottom: `1px solid ${COLORS.outlineVariant}30`,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <Utensils size={24} color={COLORS.primary} />
//             <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>NutriBébéCam</span>
//           </div>
//           <button onClick={logout} style={{ background: "none", border: "none" }}>
//             <LogOut size={24} color={COLORS.primary} />
//           </button>
//         </header>

//         <main style={{ flex: 1, padding: "20px", paddingBottom: "80px" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//             <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.primary }}>Mes repas</h2>
//             <button
//               onClick={() => navigate("/medecin/repas")}
//               style={{
//                 backgroundColor: COLORS.primary, color: "white", border: "none",
//                 borderRadius: "999px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px",
//                 fontSize: "13px", fontWeight: 600
//               }}
//             >
//               <Plus size={16} /> Nouveau
//             </button>
//           </div>

//           <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//             {repasList.map(repas => (
//               <div key={repas.id} style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
//                 <div style={{ display: "flex", gap: "12px" }}>
//                   {repas.image ? (
//                     <img src={repas.image} alt={repas.nom} style={{ width: "70px", height: "70px", borderRadius: "16px", objectFit: "cover" }} />
//                   ) : (
//                     <div style={{ width: "70px", height: "70px", backgroundColor: COLORS.surfaceContainer, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <Utensils size={28} color={COLORS.primary} />
//                     </div>
//                   )}
//                   <div style={{ flex: 1 }}>
//                     <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>{repas.nom}</h3>
//                     <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant }}>Âge min: {repas.age_minimum_mois} mois</p>
//                     <p style={{ fontSize: "12px", color: COLORS.primary, fontWeight: 600 }}>{repas.cout_estime_fcfa} FCFA</p>
//                   </div>
//                 </div>
//                 <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
//                   <button onClick={() => handlePublish(repas.id)} disabled={publishing === repas.id} style={{ flex: 1, backgroundColor: "#2c7a4d", color: "white", border: "none", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
//                     <CalendarClock size={14} /> Publier
//                   </button>
//                   <button onClick={() => navigate(`/medecin/repas/edit/${repas.id}`)} style={{ flex: 1, backgroundColor: COLORS.secondary, color: "white", border: "none", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
//                     <Edit size={14} /> Modifier
//                   </button>
//                   <button onClick={() => handleDelete(repas.id)} style={{ width: "40px", backgroundColor: COLORS.errorContainer, color: COLORS.onErrorContainer, border: "none", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {repasList.length === 0 && <div className="text-center py-8">Aucun repas</div>}
//           </div>
//         </main>

//         {/* BottomNavBar */}
//         <nav style={{
//           position: "sticky", bottom: 0, width: "100%", zIndex: 50,
//           display: "flex", justifyContent: "space-around", alignItems: "center",
//           padding: "10px 16px",
//           backgroundColor: "rgba(248,249,250,0.95)", backdropFilter: "blur(8px)",
//           borderTop: `1px solid ${COLORS.outlineVariant}30`,
//         }}>
//           {[
//             { icon: Home, label: "Accueil", path: "/medecin/dashboard" },
//             { icon: Utensils, label: "Repas", path: "/medecin/repas" },
//             { icon: Activity, label: "Stats", path: "/admin/dashboard" },
//             { icon: User, label: "Profil", path: "/profil" },
//           ].map((item, i) => (
//             <button key={i} onClick={() => navigate(item.path)} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: window.location.pathname === item.path ? COLORS.primary : COLORS.onSurfaceVariant }}>
//               <item.icon size={20} />
//               <span style={{ fontSize: "10px", marginTop: "2px" }}>{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { api, publierRepasAuxFamilles } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { COLORS } from "../constants/colors";
// import {
//   Plus, LogOut, Trash2, CalendarClock, Edit, Home, Utensils, Activity, User,
//   CalendarX, AlertCircle
// } from "lucide-react";

// export default function MedecinDashboard() {
//   const navigate = useNavigate();
//   const { logout } = useAuth();
//   const [repasList, setRepasList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [publishing, setPublishing] = useState(null);
//   const [unpublishing, setUnpublishing] = useState(null);

//   useEffect(() => {
//     fetchRepas();
//   }, []);

//   const fetchRepas = async () => {
//     try {
//       const data = await api.getRepas();
//       setRepasList(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Impossible de charger les repas.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePublish = async (repasId) => {
//     setPublishing(repasId);
//     try {
//       const result = await publierRepasAuxFamilles(repasId);
//       alert(`Publié ! ${result.programmes_crees} créneaux ajoutés.`);
//     } catch {
//       alert("Erreur publication.");
//     } finally {
//       setPublishing(null);
//     }
//   };

//   const handleUnpublish = async (repasId) => {
//     if (!window.confirm("Retirer ce repas du planning d'aujourd'hui ?")) return;
//     setUnpublishing(repasId);
//     try {
//       await api.post(`nutrition/repas/${repasId}/unpublish/`);
//       alert("Repas retiré du planning.");
//     } catch {
//       alert("Erreur lors du retrait.");
//     } finally {
//       setUnpublishing(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Supprimer définitivement ce repas ?")) return;
//     try {
//       await api.delete(`nutrition/repas/${id}/`);
//       setRepasList((prev) => prev.filter((r) => r.id !== id));
//     } catch {
//       alert("Erreur suppression.");
//     }
//   };

//   if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Chargement...</div>;
//   if (error) return <div style={{ textAlign: "center", padding: "2rem", color: COLORS.onErrorContainer }}>{error}</div>;

//   return (
//     <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
//       <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//         <header style={{
//           position: "sticky", top: 0, zIndex: 40,
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//           padding: "0 20px", height: "64px",
//           backgroundColor: "rgba(248,249,250,0.92)", backdropFilter: "blur(8px)",
//           borderBottom: `1px solid ${COLORS.outlineVariant}30`,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <Utensils size={24} color={COLORS.primary} />
//             <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>NutriBébéCam</span>
//           </div>
//           <button onClick={logout} style={{ background: "none", border: "none" }}>
//             <LogOut size={24} color={COLORS.primary} />
//           </button>
//         </header>

//         <main style={{ flex: 1, padding: "20px", paddingBottom: "80px" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//             <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.primary }}>Mes repas</h2>
//             <button
//               onClick={() => navigate("/medecin/repas")}
//               style={{
//                 backgroundColor: COLORS.primary, color: "white", border: "none",
//                 borderRadius: "999px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px",
//                 fontSize: "13px", fontWeight: 600
//               }}
//             >
//               <Plus size={16} /> Nouveau
//             </button>
//           </div>

//           <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//             {repasList.map((repas) => (
//               <div key={repas.id} style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
//                 <div style={{ display: "flex", gap: "12px" }}>
//                   {repas.image ? (
//                     <img src={repas.image} alt={repas.nom} style={{ width: "70px", height: "70px", borderRadius: "16px", objectFit: "cover" }} />
//                   ) : (
//                     <div style={{ width: "70px", height: "70px", backgroundColor: COLORS.surfaceContainer, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <Utensils size={28} color={COLORS.primary} />
//                     </div>
//                   )}
//                   <div style={{ flex: 1 }}>
//                     <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>{repas.nom}</h3>
//                     <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant }}>Âge min: {repas.age_minimum_mois} mois</p>
//                     <p style={{ fontSize: "12px", color: COLORS.primary, fontWeight: 600 }}>{repas.cout_estime_fcfa} FCFA</p>
//                   </div>
//                 </div>
//                 <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
//                   <button
//                     onClick={() => handlePublish(repas.id)}
//                     disabled={publishing === repas.id}
//                     style={{ flex: 1, backgroundColor: "#2c7a4d", color: "white", border: "none", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
//                   >
//                     <CalendarClock size={14} /> Publier
//                   </button>
//                   <button
//                     onClick={() => handleUnpublish(repas.id)}
//                     disabled={unpublishing === repas.id}
//                     style={{ flex: 1, backgroundColor: COLORS.errorContainer, color: COLORS.onErrorContainer, border: "none", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
//                   >
//                     <CalendarX size={14} /> Annuler
//                   </button>
//                   <button
//                     onClick={() => navigate(`/medecin/repas/edit/${repas.id}`)}
//                     style={{ flex: 1, backgroundColor: COLORS.secondary, color: "white", border: "none", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
//                   >
//                     <Edit size={14} /> Modifier
//                   </button>
//                   <button
//                     onClick={() => handleDelete(repas.id)}
//                     style={{ width: "40px", backgroundColor: COLORS.errorContainer, color: COLORS.onErrorContainer, border: "none", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center" }}
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {repasList.length === 0 && <div style={{ textAlign: "center", padding: "32px" }}>Aucun repas</div>}
//           </div>
//         </main>

//         <nav style={{
//           position: "sticky", bottom: 0, width: "100%", zIndex: 50,
//           display: "flex", justifyContent: "space-around", alignItems: "center",
//           padding: "10px 16px",
//           backgroundColor: "rgba(248,249,250,0.95)", backdropFilter: "blur(8px)",
//           borderTop: `1px solid ${COLORS.outlineVariant}30`,
//         }}>
//           {[
//             { icon: Home, label: "Accueil", path: "/medecin/dashboard" },
//             { icon: Utensils, label: "Repas", path: "/medecin/repas" },
//             { icon: Activity, label: "Stats", path: "/admin/dashboard" },
//             { icon: User, label: "Profil", path: "/profil" },
//           ].map((item) => (
//             <button
//               key={item.path}
//               onClick={() => navigate(item.path)}
//               style={{
//                 display: "flex", flexDirection: "column", alignItems: "center",
//                 background: "none", border: "none", cursor: "pointer",
//                 color: window.location.pathname === item.path ? COLORS.primary : COLORS.onSurfaceVariant,
//               }}
//             >
//               <item.icon size={20} />
//               <span style={{ fontSize: "10px", marginTop: "2px" }}>{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, publierRepasAuxFamilles } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";
import { Plus, LogOut, Trash2, CalendarClock, Edit, Home, Utensils, Activity, User, CalendarX, MessageCircle } from "lucide-react";

export default function MedecinDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [repasList, setRepasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(null);
  const [unpublishing, setUnpublishing] = useState(null);

  useEffect(() => {
    fetchRepas();
  }, []);

  const fetchRepas = async () => {
    try {
      const data = await api.getRepas();
      setRepasList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Impossible de charger les repas.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (repasId) => {
    setPublishing(repasId);
    try {
      const result = await publierRepasAuxFamilles(repasId);
      alert(`Publié ! ${result.programmes_crees} créneaux ajoutés.`);
    } catch {
      alert("Erreur publication.");
    } finally {
      setPublishing(null);
    }
  };

  const handleUnpublish = async (repasId) => {
    if (!window.confirm("Retirer ce repas du planning d'aujourd'hui ?")) return;
    setUnpublishing(repasId);
    try {
      await api.post(`nutrition/repas/${repasId}/unpublish/`);
      alert("Repas retiré du planning.");
    } catch {
      alert("Erreur lors du retrait.");
    } finally {
      setUnpublishing(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement ce repas ?")) return;
    try {
      await api.delete(`nutrition/repas/${id}/`);
      setRepasList((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Erreur suppression.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Chargement...</div>;
  if (error) return <div style={{ textAlign: "center", padding: "2rem", color: COLORS.onErrorContainer }}>{error}</div>;

  return (
    <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 20px", height: "64px",
          backgroundColor: "rgba(248,249,250,0.92)", backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${COLORS.outlineVariant}30`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Utensils size={24} color={COLORS.primary} />
            <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>NutriBébéCam</span>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none" }}>
            <LogOut size={24} color={COLORS.primary} />
          </button>
        </header>

        <main style={{ flex: 1, padding: "20px", paddingBottom: "80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.primary }}>Mes repas</h2>
            <button
              onClick={() => navigate("/medecin/repas")}
              style={{
                backgroundColor: COLORS.primary, color: "white", border: "none",
                borderRadius: "999px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px",
                fontSize: "13px", fontWeight: 600
              }}
            >
              <Plus size={16} /> Nouveau
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {repasList.map((repas) => (
              <div key={repas.id} style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  {repas.image ? (
                    <img src={repas.image} alt={repas.nom} style={{ width: "70px", height: "70px", borderRadius: "16px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "70px", height: "70px", backgroundColor: COLORS.surfaceContainer, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Utensils size={28} color={COLORS.primary} />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>{repas.nom}</h3>
                    <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant }}>Âge min: {repas.age_minimum_mois} mois</p>
                    <p style={{ fontSize: "12px", color: COLORS.primary, fontWeight: 600 }}>{repas.cout_estime_fcfa} FCFA</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handlePublish(repas.id)}
                    disabled={publishing === repas.id}
                    style={{ flex: 1, backgroundColor: "#2c7a4d", color: "white", border: "none", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <CalendarClock size={14} /> Publier
                  </button>
                  <button
                    onClick={() => handleUnpublish(repas.id)}
                    disabled={unpublishing === repas.id}
                    style={{ flex: 1, backgroundColor: COLORS.errorContainer, color: COLORS.onErrorContainer, border: "none", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <CalendarX size={14} /> Annuler
                  </button>
                  <button
                    onClick={() => navigate(`/medecin/repas/edit/${repas.id}`)}
                    style={{ flex: 1, backgroundColor: COLORS.secondary, color: "white", border: "none", borderRadius: "999px", padding: "8px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <Edit size={14} /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(repas.id)}
                    style={{ width: "40px", backgroundColor: COLORS.errorContainer, color: COLORS.onErrorContainer, border: "none", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {repasList.length === 0 && <div style={{ textAlign: "center", padding: "32px" }}>Aucun repas</div>}
          </div>
        </main>

        <nav style={{
          position: "sticky", bottom: 0, width: "100%", zIndex: 50,
          display: "flex", justifyContent: "space-around", alignItems: "center",
          padding: "10px 16px",
          backgroundColor: "rgba(248,249,250,0.95)", backdropFilter: "blur(8px)",
          borderTop: `1px solid ${COLORS.outlineVariant}30`,
        }}>
          {[
            { icon: Home, label: "Accueil", path: "/medecin/dashboard" },
            { icon: Utensils, label: "Repas", path: "/medecin/repas" },
            { icon: MessageCircle, label: "Messages", path: "/messagerie" },
            { icon: User, label: "Profil", path: "/profil" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                background: "none", border: "none", cursor: "pointer",
                color: window.location.pathname === item.path ? COLORS.primary : COLORS.onSurfaceVariant,
              }}
            >
              <item.icon size={20} />
              <span style={{ fontSize: "10px", marginTop: "2px" }}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}