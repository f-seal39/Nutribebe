// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   LineChart, Line, ResponsiveContainer
// } from "recharts";
// import {
//   Users, UserPlus, Stethoscope, Baby, Utensils, Calendar,
//   AlertCircle, CheckCircle, Download, Search, ChevronLeft, ChevronRight,
//   LogOut, Home, BarChart3, UserCog, Trash2
// } from "lucide-react";

// const COLORS = {
//   primary: "#0f5238",
//   onPrimary: "#ffffff",
//   surface: "#f8f9fa",
//   surfaceContainerLow: "#f3f4f5",
//   surfaceContainerLowest: "#ffffff",
//   outlineVariant: "#bfc9c1",
//   errorContainer: "#ffdad6",
//   onErrorContainer: "#93000a",
//   onSurfaceVariant: "#404943",
// };

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const { logout } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [utilisateurs, setUtilisateurs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("stats");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [repas, setRepas] = useState([]);
//   const [loadingRepas, setLoadingRepas] = useState(false);

//   const fetchRepas = async () => {
//     setLoadingRepas(true);
//     try {
//       const res = await api.get('admin/stats/repas/');
//       setRepas(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingRepas(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//     fetchUtilisateurs();
//   }, []);

//   useEffect(() => {
//     if (activeTab === 'repas') {
//       fetchRepas();
//     }
//   }, [activeTab]);

//   const fetchStats = async () => {
//     try {
//       const res = await api.get("admin/stats/stats/");
//       setStats(res.data);
//     } catch (err) {
//       console.error(err);
//       setError("Impossible de charger les statistiques");
//     }
//   };

//   const fetchUtilisateurs = async () => {
//     try {
//       const res = await api.get("admin/stats/utilisateurs/");
//       setUtilisateurs(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const suspendreUtilisateur = async (userId) => {
//     if (!window.confirm("Suspendre cet utilisateur ?")) return;
//     try {
//       await api.post(`admin/stats/${userId}/suspendre_utilisateur/`);
//       fetchUtilisateurs();
//       fetchStats();
//     } catch (err) {
//       alert("Erreur lors de la suspension");
//     }
//   };

//   const activerUtilisateur = async (userId) => {
//     if (!window.confirm("Activer cet utilisateur ?")) return;
//     try {
//       await api.post(`admin/stats/${userId}/activer_utilisateur/`);
//       fetchUtilisateurs();
//       fetchStats();
//     } catch (err) {
//       alert("Erreur lors de l'activation");
//     }
//   };

//   const supprimerRepas = async (repasId) => {
//     if (!window.confirm("Supprimer définitivement ce repas ?")) return;
//     try {
//       await api.delete(`admin/stats/repas/${repasId}/`);
//       fetchRepas();
//       fetchStats(); // pour mettre à jour le nombre total de repas
//     } catch (err) {
//       alert("Erreur lors de la suppression du repas");
//     }
//   };

//   const filteredUsers = utilisateurs.filter(u =>
//     u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

//   const exportCSV = () => {
//     const headers = ["ID", "Nom d'utilisateur", "Prénom", "Nom", "Email", "Rôle", "Statut"];
//     const rows = utilisateurs.map(u => [u.id, u.username, u.first_name || "", u.last_name || "", u.email || "", u.role, u.statut]);
//     const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "utilisateurs.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Chargement...</div>;

//   return (
//     <div style={{ backgroundColor: COLORS.surface, minHeight: "100vh" }}>
//       {/* Header */}
//       <header style={{ backgroundColor: COLORS.primary, padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: COLORS.onPrimary }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//           <UserCog size={28} />
//           <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Administration NutriBébé</h1>
//         </div>
//         <button onClick={logout} style={{ background: "none", border: "none", color: COLORS.onPrimary, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
//           <LogOut size={20} /> Déconnexion
//         </button>
//       </header>

//       {/* Navigation interne */}
//       <div style={{ display: "flex", gap: "1rem", padding: "1rem 2rem", backgroundColor: COLORS.surfaceContainerLow, borderBottom: `1px solid ${COLORS.outlineVariant}` }}>
//         <button onClick={() => setActiveTab("stats")} style={{ padding: "0.5rem 1rem", borderRadius: "40px", border: "none", backgroundColor: activeTab === "stats" ? COLORS.primary : "transparent", color: activeTab === "stats" ? COLORS.onPrimary : COLORS.onSurfaceVariant, cursor: "pointer" }}>
//           <BarChart3 size={16} style={{ display: "inline", marginRight: "6px" }} /> Statistiques
//         </button>
//         <button onClick={() => setActiveTab("users")} style={{ padding: "0.5rem 1rem", borderRadius: "40px", border: "none", backgroundColor: activeTab === "users" ? COLORS.primary : "transparent", color: activeTab === "users" ? COLORS.onPrimary : COLORS.onSurfaceVariant, cursor: "pointer" }}>
//           <Users size={16} style={{ display: "inline", marginRight: "6px" }} /> Utilisateurs
//         </button>
//         <button onClick={() => setActiveTab("repas")} style={{ padding: "0.5rem 1rem", borderRadius: "40px", border: "none", backgroundColor: activeTab === "repas" ? COLORS.primary : "transparent", color: activeTab === "repas" ? COLORS.onPrimary : COLORS.onSurfaceVariant, cursor: "pointer" }}>
//           <Utensils size={16} style={{ display: "inline", marginRight: "6px" }} /> Repas
//         </button>
//       </div>

//       <main style={{ padding: "2rem" }}>
//         {error && <div style={{ backgroundColor: COLORS.errorContainer, padding: "1rem", borderRadius: "12px", marginBottom: "1rem", color: COLORS.onErrorContainer }}>{error}</div>}

//         {/* Onglet Statistiques */}
//         {activeTab === "stats" && stats && (
//           <>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
//               <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
//                 <Users size={32} color={COLORS.primary} />
//                 <h3 style={{ fontSize: "28px", fontWeight: 700, margin: "0.5rem 0 0" }}>{stats.total_parents}</h3>
//                 <p style={{ color: COLORS.onSurfaceVariant }}>Parents</p>
//               </div>
//               <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
//                 <Stethoscope size={32} color={COLORS.primary} />
//                 <h3 style={{ fontSize: "28px", fontWeight: 700, margin: "0.5rem 0 0" }}>{stats.total_medecins}</h3>
//                 <p style={{ color: COLORS.onSurfaceVariant }}>Médecins</p>
//               </div>
//               <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
//                 <Baby size={32} color={COLORS.primary} />
//                 <h3 style={{ fontSize: "28px", fontWeight: 700, margin: "0.5rem 0 0" }}>{stats.total_bebes}</h3>
//                 <p style={{ color: COLORS.onSurfaceVariant }}>Bébés</p>
//               </div>
//               <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
//                 <Utensils size={32} color={COLORS.primary} />
//                 <h3 style={{ fontSize: "28px", fontWeight: 700, margin: "0.5rem 0 0" }}>{stats.total_repas}</h3>
//                 <p style={{ color: COLORS.onSurfaceVariant }}>Repas</p>
//               </div>
//               <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
//                 <Calendar size={32} color={COLORS.primary} />
//                 <h3 style={{ fontSize: "28px", fontWeight: 700, margin: "0.5rem 0 0" }}>{stats.repas_programmes_aujourdhui}</h3>
//                 <p style={{ color: COLORS.onSurfaceVariant }}>Repas programmés aujourd'hui</p>
//               </div>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
//               <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1rem" }}>
//                 <h3>Évolution des inscriptions</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={stats.evolution_inscriptions}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={2} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//               <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1rem" }}>
//                 <h3>Nouveautés (7 derniers jours)</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={[
//                     { name: "Parents", value: stats.nouveaux_parents_7j },
//                     { name: "Médecins", value: stats.nouveaux_medecins_7j },
//                     { name: "Bébés", value: stats.nouveaux_bebes_7j }
//                   ]}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="value" fill={COLORS.primary} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Onglet Utilisateurs */}
//         {activeTab === "users" && (
//           <>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
//               <div style={{ position: "relative" }}>
//                 <Search size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: COLORS.onSurfaceVariant }} />
//                 <input
//                   type="text"
//                   placeholder="Rechercher un utilisateur..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   style={{ padding: "10px 10px 10px 40px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, width: "300px" }}
//                 />
//               </div>
//               <button onClick={exportCSV} style={{ background: COLORS.primary, color: COLORS.onPrimary, border: "none", borderRadius: "40px", padding: "8px 20px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
//                 <Download size={16} /> Exporter CSV
//               </button>
//             </div>

//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", overflow: "hidden" }}>
//                 <thead style={{ backgroundColor: COLORS.surfaceContainerLow }}>
//                   <tr>
//                     <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Nom d'utilisateur</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Prénom</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Nom</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Rôle</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Statut</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedUsers.map(user => (
//                     <tr key={user.id} style={{ borderTop: `1px solid ${COLORS.outlineVariant}` }}>
//                       <td style={{ padding: "12px" }}>{user.id}</td>
//                       <td style={{ padding: "12px" }}>{user.username}</td>
//                       <td style={{ padding: "12px" }}>{user.first_name || "-"}</td>
//                       <td style={{ padding: "12px" }}>{user.last_name || "-"}</td>
//                       <td style={{ padding: "12px" }}>{user.email || "-"}</td>
//                       <td style={{ padding: "12px" }}>{user.role}</td>
//                       <td style={{ padding: "12px" }}>
//                         <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: user.statut === "actif" ? "#2e7d32" : "#c62828" }}>
//                           {user.statut === "actif" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
//                           {user.statut}
//                         </span>
//                       </td>
//                       <td style={{ padding: "12px" }}>
//                         {user.statut === "actif" ? (
//                           <button onClick={() => suspendreUtilisateur(user.id)} style={{ background: "none", border: "none", color: "#c62828", cursor: "pointer" }}>Suspendre</button>
//                         ) : (
//                           <button onClick={() => activerUtilisateur(user.id)} style={{ background: "none", border: "none", color: "#2e7d32", cursor: "pointer" }}>Activer</button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
//               <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ background: "none", border: "none", cursor: "pointer" }}><ChevronLeft size={20} /></button>
//               <span>Page {currentPage} sur {totalPages}</span>
//               <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ background: "none", border: "none", cursor: "pointer" }}><ChevronRight size={20} /></button>
//             </div>
//           </>
//         )}

//         {/* Onglet Repas */}
//         {activeTab === "repas" && (
//           <>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
//               <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Catalogue des repas ({repas.length})</h2>
//             </div>
//             {loadingRepas ? (
//               <div>Chargement des repas...</div>
//             ) : (
//               <div style={{ overflowX: "auto" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", overflow: "hidden" }}>
//                   <thead style={{ backgroundColor: COLORS.surfaceContainerLow }}>
//                     <tr>
//                       <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
//                       <th style={{ padding: "12px", textAlign: "left" }}>Nom</th>
//                       <th style={{ padding: "12px", textAlign: "left" }}>Âge min (mois)</th>
//                       <th style={{ padding: "12px", textAlign: "left" }}>Coût (FCFA)</th>
//                       <th style={{ padding: "12px", textAlign: "left" }}>Image</th>
//                       <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {repas.map(r => (
//                       <tr key={r.id} style={{ borderTop: `1px solid ${COLORS.outlineVariant}` }}>
//                         <td style={{ padding: "12px" }}>{r.id}</td>
//                         <td style={{ padding: "12px" }}>{r.nom}</td>
//                         <td style={{ padding: "12px" }}>{r.age_minimum_mois}</td>
//                         <td style={{ padding: "12px" }}>{r.cout_estime_fcfa}</td>
//                         <td style={{ padding: "12px" }}>
//                           {r.image ? (
//                             // <img src={r.image} alt={r.nom} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />

//                             <img src={`http://localhost:8000${r.image}`} alt={r.nom} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
//                           ) : (
//                             "—"
//                           )}
//                         </td>
//                         <td style={{ padding: "12px" }}>
//                           <button onClick={() => supprimerRepas(r.id)} style={{ background: "none", border: "none", color: "#c62828", cursor: "pointer" }}>
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </>
//         )}
//       </main>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer
} from "recharts";
import {
  Users, Stethoscope, Baby, Utensils, Calendar,
  AlertCircle, CheckCircle, Download, Search, ChevronLeft, ChevronRight,
  LogOut, BarChart3, UserCog, Trash2
} from "lucide-react";

const COLORS = {
  primary: "#0f5238",
  onPrimary: "#ffffff",
  surface: "#f8f9fa",
  surfaceContainerLow: "#f3f4f5",
  surfaceContainerLowest: "#ffffff",
  outlineVariant: "#bfc9c1",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  onSurfaceVariant: "#404943",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("stats");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [repas, setRepas] = useState([]);
  const [loadingRepas, setLoadingRepas] = useState(false);

  const fetchRepas = async () => {
    setLoadingRepas(true);
    try {
      const res = await api.get('admin/stats/repas/');
      setRepas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRepas(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUtilisateurs();
  }, []);

  useEffect(() => {
    if (activeTab === 'repas') {
      fetchRepas();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await api.get("admin/stats/stats/");
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les statistiques");
    }
  };

  const fetchUtilisateurs = async () => {
    try {
      const res = await api.get("admin/stats/utilisateurs/");
      setUtilisateurs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const suspendreUtilisateur = async (userId) => {
    if (!window.confirm("Suspendre cet utilisateur ?")) return;
    try {
      await api.post(`admin/stats/${userId}/suspendre_utilisateur/`);
      fetchUtilisateurs();
      fetchStats();
    } catch (err) {
      alert("Erreur lors de la suspension");
    }
  };

  const activerUtilisateur = async (userId) => {
    if (!window.confirm("Activer cet utilisateur ?")) return;
    try {
      await api.post(`admin/stats/${userId}/activer_utilisateur/`);
      fetchUtilisateurs();
      fetchStats();
    } catch (err) {
      alert("Erreur lors de l'activation");
    }
  };

  const supprimerRepas = async (repasId) => {
    if (!window.confirm("Supprimer définitivement ce repas ?")) return;
    try {
      await api.delete(`admin/stats/repas/${repasId}/`);
      fetchRepas();
      fetchStats();
    } catch (err) {
      alert("Erreur lors de la suppression du repas");
    }
  };

  const filteredUsers = utilisateurs.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const exportCSV = () => {
    const headers = ["ID", "Nom d'utilisateur", "Prénom", "Nom", "Email", "Rôle", "Statut"];
    const rows = utilisateurs.map(u => [u.id, u.username, u.first_name || "", u.last_name || "", u.email || "", u.role, u.statut]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "utilisateurs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Chargement...</div>;

  return (
    <div style={{ backgroundColor: COLORS.surface, minHeight: "100vh" }}>
      <header style={{ backgroundColor: COLORS.primary, padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: COLORS.onPrimary }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <UserCog size={28} />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Administration NutriBébéCam</h1>
        </div>
        <button onClick={logout} style={{ background: "none", border: "none", color: COLORS.onPrimary, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <LogOut size={20} /> Déconnexion
        </button>
      </header>

      <div style={{ display: "flex", gap: "1rem", padding: "1rem 2rem", backgroundColor: COLORS.surfaceContainerLow, borderBottom: `1px solid ${COLORS.outlineVariant}` }}>
        <button onClick={() => setActiveTab("stats")} style={{ padding: "0.5rem 1rem", borderRadius: "40px", border: "none", backgroundColor: activeTab === "stats" ? COLORS.primary : "transparent", color: activeTab === "stats" ? COLORS.onPrimary : COLORS.onSurfaceVariant, cursor: "pointer" }}>
          <BarChart3 size={16} style={{ display: "inline", marginRight: "6px" }} /> Statistiques
        </button>
        <button onClick={() => setActiveTab("users")} style={{ padding: "0.5rem 1rem", borderRadius: "40px", border: "none", backgroundColor: activeTab === "users" ? COLORS.primary : "transparent", color: activeTab === "users" ? COLORS.onPrimary : COLORS.onSurfaceVariant, cursor: "pointer" }}>
          <Users size={16} style={{ display: "inline", marginRight: "6px" }} /> Utilisateurs
        </button>
        <button onClick={() => setActiveTab("repas")} style={{ padding: "0.5rem 1rem", borderRadius: "40px", border: "none", backgroundColor: activeTab === "repas" ? COLORS.primary : "transparent", color: activeTab === "repas" ? COLORS.onPrimary : COLORS.onSurfaceVariant, cursor: "pointer" }}>
          <Utensils size={16} style={{ display: "inline", marginRight: "6px" }} /> Repas
        </button>
      </div>

      <main style={{ padding: "2rem" }}>
        {error && <div style={{ backgroundColor: COLORS.errorContainer, padding: "1rem", borderRadius: "12px", marginBottom: "1rem", color: COLORS.onErrorContainer }}>{error}</div>}

        {activeTab === "stats" && stats && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <Users size={32} color={COLORS.primary} />
                <h3 style={{ fontSize: "28px", fontWeight: 700, margin: "0.5rem 0 0" }}>{stats.total_parents}</h3>
                <p>Parents</p>
              </div>
              <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <Stethoscope size={32} color={COLORS.primary} />
                <h3 style={{ fontSize: "28px", fontWeight: 700, margin: "0.5rem 0 0" }}>{stats.total_medecins}</h3>
                <p>Médecins</p>
              </div>
              <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <Baby size={32} color={COLORS.primary} />
                <h3 style={{ fontSize: "28px", fontWeight: 700, margin: "0.5rem 0 0" }}>{stats.total_bebes}</h3>
                <p>Bébés</p>
              </div>
              <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <Utensils size={32} color={COLORS.primary} />
                <h3 style={{ fontSize: "28px", fontWeight: 700, margin: "0.5rem 0 0" }}>{stats.total_repas}</h3>
                <p>Repas</p>
              </div>
              <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <Calendar size={32} color={COLORS.primary} />
                <h3 style={{ fontSize: "28px", fontWeight: 700, margin: "0.5rem 0 0" }}>{stats.repas_programmes_aujourdhui}</h3>
                <p>Repas programmés aujourd'hui</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1rem" }}>
                <h3>Évolution des inscriptions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.evolution_inscriptions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "1rem" }}>
                <h3>Nouveautés (7 derniers jours)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: "Parents", value: stats.nouveaux_parents_7j },
                    { name: "Médecins", value: stats.nouveaux_medecins_7j },
                    { name: "Bébés", value: stats.nouveaux_bebes_7j }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative" }}>
                <Search size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: COLORS.onSurfaceVariant }} />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: "10px 10px 10px 40px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, width: "300px" }}
                />
              </div>
              <button onClick={exportCSV} style={{ background: COLORS.primary, color: COLORS.onPrimary, border: "none", borderRadius: "40px", padding: "8px 20px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <Download size={16} /> Exporter CSV
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", overflow: "hidden" }}>
                <thead style={{ backgroundColor: COLORS.surfaceContainerLow }}>
                  <tr>
                    <th>ID</th><th>Nom d'utilisateur</th><th>Prénom</th><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map(user => (
                    <tr key={user.id} style={{ borderTop: `1px solid ${COLORS.outlineVariant}` }}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.first_name || "-"}</td>
                      <td>{user.last_name || "-"}</td>
                      <td>{user.email || "-"}</td>
                      <td>{user.role}</td>
                      <td><span style={{ color: user.statut === "actif" ? "#2e7d32" : "#c62828" }}>{user.statut}</span></td>
                      <td>
                        {user.statut === "actif" ? (
                          <button onClick={() => suspendreUtilisateur(user.id)} style={{ background: "none", border: "none", color: "#c62828", cursor: "pointer" }}>Suspendre</button>
                        ) : (
                          <button onClick={() => activerUtilisateur(user.id)} style={{ background: "none", border: "none", color: "#2e7d32", cursor: "pointer" }}>Activer</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}><ChevronLeft size={20} /></button>
              <span>Page {currentPage} sur {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}><ChevronRight size={20} /></button>
            </div>
          </>
        )}

        {activeTab === "repas" && (
          <>
            <h2>Catalogue des repas ({repas.length})</h2>
            {loadingRepas ? <div>Chargement des repas...</div> : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", overflow: "hidden" }}>
                  <thead style={{ backgroundColor: COLORS.surfaceContainerLow }}>
                    <tr>
                      <th>ID</th><th>Nom</th><th>Âge min (mois)</th><th>Coût (FCFA)</th><th>Image</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repas.map(r => (
                      <tr key={r.id} style={{ borderTop: `1px solid ${COLORS.outlineVariant}` }}>
                        <td>{r.id}</td>
                        <td>{r.nom}</td>
                        <td>{r.age_minimum_mois}</td>
                        <td>{r.cout_estime_fcfa}</td>
                        <td>{r.image ? <img src={`http://localhost:8000${r.image}`} alt={r.nom} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} /> : "—"}</td>
                        <td><button onClick={() => supprimerRepas(r.id)} style={{ background: "none", border: "none", color: "#c62828", cursor: "pointer" }}><Trash2 size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}