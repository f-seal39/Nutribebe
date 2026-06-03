// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAliments } from "../services/api";

// const C = {
//   primary: "#0f5238",
//   onPrimary: "#ffffff",
//   primaryFixed: "#b1f0ce",
//   surface: "#f8f9fa",
//   surfaceContainerLowest: "#ffffff",
//   surfaceContainerLow: "#f3f4f5",
//   surfaceContainer: "#edeeef",
//   onSurface: "#191c1d",
//   onSurfaceVariant: "#404943",
//   outlineVariant: "#bfc9c1",
//   errorContainer: "#ffdad6",
//   onErrorContainer: "#93000a",
// };

// // Modifié pour pointer vers la route médecin existante au lieu de s'écraser
// const DEFAUT_DASHBOARD = "/medecin/repas"; 
// const BASE_URL = "http://localhost:8000/api";

// export default function MedecinRepas() {
//   const navigate = useNavigate();
//   const [aliments, setAliments] = useState([]);
//   const [loadingAliments, setLoadingAliments] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [repas, setRepas] = useState({
//     nom: "", heure_repas: "12:00",
//     age_minimum_mois: 6, cout_estime_fcfa: 0,
//     description: "", recette: "",
//   });
//   const [compositions, setCompositions] = useState([
//     { aliment: "", quantite: 100, unite: "g" },
//   ]);

//   useEffect(() => {
//     getAliments().then((data) => {
//       if (Array.isArray(data)) setAliments(data);
//       loadingAliments && setLoadingAliments(false);
//     }).catch(() => setLoadingAliments(false));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setRepas(prev => ({
//       ...prev,
//       [name]: ["age_minimum_mois", "cout_estime_fcfa"].includes(name)
//         ? parseFloat(value) || 0 : value,
//     }));
//   };

//   const addRow = () => setCompositions(p => [...p, { aliment: "", quantite: 100, unite: "g" }]);
//   const removeRow = (i) => setCompositions(p => p.filter((_, idx) => idx !== i));
//   const updateRow = (i, f, v) => setCompositions(p =>
//     p.map((r, idx) => idx === i ? { ...r, [f]: f === "quantite" ? parseFloat(v) || 0 : v } : r)
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true); setError("");
//     try {
//       const token = localStorage.getItem("token");
//       const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };
//       const res = await fetch(`${BASE_URL}/nutrition/repas/`, { method: "POST", headers, body: JSON.stringify(repas) });
//       const created = await res.json();
//       for (const comp of compositions) {
//         if (!comp.aliment || comp.quantite <= 0) continue;
//         await fetch(`${BASE_URL}/nutrition/compositions/`, {
//           method: "POST", headers,
//           body: JSON.stringify({ repas: created.id, aliment: comp.aliment, quantite: comp.quantite, unite: comp.unite }),
//         });
//       }
//       setSuccess(true);
//       setTimeout(() => navigate(DEFAUT_DASHBOARD), 2000);
//     } catch {
//       setError("Une erreur est survenue lors de l'enregistrement.");
//     }
//     setSubmitting(false);
//   };

//   // Fonction de déconnexion sécurisée gérée localement
//   const handleLocalLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("utilisateur");
//     navigate("/");
//   };

//   const input = {
//     width: "100%", height: "48px", padding: "0 14px",
//     borderRadius: "10px", border: `1px solid ${C.outlineVariant}`,
//     backgroundColor: C.surfaceContainerLow, fontSize: "14px",
//     outline: "none", boxSizing: "border-box",
//   };

//   const label = {
//     display: "block", fontSize: "13px", fontWeight: 600,
//     color: C.onSurfaceVariant, marginBottom: "6px",
//   };

//   const card = {
//     backgroundColor: C.surfaceContainerLowest, borderRadius: "16px",
//     padding: "20px", marginBottom: "16px",
//     border: `1px solid ${C.outlineVariant}40`,
//     boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//   };

//   return (
//     <div style={{ backgroundColor: C.surface, minHeight: "100vh", paddingBottom: "32px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

//       {/* Header */}
//       <div style={{ backgroundColor: C.primary, padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <button type="button" onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#A8D8C8", cursor: "pointer", display: "flex", alignItems: "center" }}>
//             <span className="material-symbols-outlined">arrow_back</span>
//           </button>
//           <h1 style={{ color: C.onPrimary, fontSize: "18px", fontWeight: 700, margin: 0 }}>Créer un Repas</h1>
//         </div>
//         <button 
//           type="button"
//           onClick={handleLocalLogout}
//           style={{ background: "rgba(255,255,255,0.15)", border: "none", color: C.onPrimary, padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
//         >
//           Déconnexion
//         </button>
//       </div>

//       <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem 1rem" }}>
//         <p style={{ color: C.onSurfaceVariant, fontSize: "14px", marginBottom: "24px" }}>
//           Espace Médecin — Ajoutez un nouveau repas au catalogue NutriBébéCam
//         </p>

//         {success && (
//           <div style={{ backgroundColor: "#eafaf1", color: "#1a5c2e", padding: "16px", borderRadius: "12px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
//             <span className="material-symbols-outlined">check_circle</span>
//             Repas créé avec succès ! Redirection...
//           </div>
//         )}

//         {error && (
//           <div style={{ backgroundColor: C.errorContainer, color: C.onErrorContainer, padding: "16px", borderRadius: "12px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
//             <span className="material-symbols-outlined">error</span>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>

//           {/* Informations de base */}
//           <div style={card}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
//               <span className="material-symbols-outlined" style={{ color: C.primary }}>restaurant_menu</span>
//               <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.primary, margin: 0 }}>Informations de base</h2>
//             </div>

//             {[
//               { label: "Nom du repas", name: "nom", type: "text", placeholder: "Ex: Purée de patate douce", required: true },
//               { label: "Heure recommandée", name: "heure_repas", type: "time" },
//               { label: "Âge minimum (mois)", name: "age_minimum_mois", type: "number", min: "4", max: "24" },
//               { label: "Coût estimé (FCFA)", name: "cout_estime_fcfa", type: "number", min: "0" },
//             ].map(champ => (
//               <div key={champ.name} style={{ marginBottom: "14px" }}>
//                 <label style={label}>{champ.label}</label>
//                 <input type={champ.type} name={champ.name} value={repas[champ.name]}
//                   onChange={handleChange} placeholder={champ.placeholder}
//                   required={champ.required} min={champ.min} max={champ.max} style={input} />
//               </div>
//             ))}

//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Description</label>
//               <textarea name="description" value={repas.description} onChange={handleChange}
//                 placeholder="Décrivez le repas et ses bienfaits..." rows={3}
//                 style={{ ...input, height: "auto", padding: "12px 14px", resize: "vertical" }} />
//             </div>

//             <div>
//               <label style={label}>Recette</label>
//               <textarea name="recette" value={repas.recette} onChange={handleChange}
//                 placeholder="Instructions de préparation..." rows={4}
//                 style={{ ...input, height: "auto", padding: "12px 14px", resize: "vertical" }} />
//             </div>
//           </div>

//           {/* Compositions */}
//           <div style={card}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <span className="material-symbols-outlined" style={{ color: C.primary }}>nutrition</span>
//                 <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.primary, margin: 0 }}>Ingrédients</h2>
//               </div>
//               <button type="button" onClick={addRow}
//                 style={{ backgroundColor: C.primary, color: C.onPrimary, border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
//                 <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
//                 Ajouter
//               </button>
//             </div>

//             {loadingAliments ? (
//               <p style={{ textAlign: "center", color: C.onSurfaceVariant, padding: "24px" }}>Chargement des aliments...</p>
//             ) : (
//               compositions.map((comp, i) => (
//                 <div key={i} style={{ backgroundColor: C.surfaceContainerLow, borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
//                   <div style={{ marginBottom: "10px" }}>
//                     <label style={label}>Aliment</label>
//                     <select value={comp.aliment} onChange={e => updateRow(i, "aliment", e.target.value)}
//                       style={{ ...input, height: "44px" }}>
//                       <option value="">Sélectionner un aliment</option>
//                       {aliments.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
//                     </select>
//                   </div>
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <div style={{ flex: 1 }}>
//                       <label style={label}>Quantité</label>
//                       <input type="number" min="0" step="0.1" value={comp.quantite}
//                         onChange={e => updateRow(i, "quantite", e.target.value)}
//                         style={{ ...input, height: "44px" }} />
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <label style={label}>Unité</label>
//                       <select value={comp.unite} onChange={e => updateRow(i, "unite", e.target.value)}
//                         style={{ ...input, height: "44px" }}>
//                         <option value="g">grammes (g)</option>
//                         <option value="ml">millilitres (ml)</option>
//                         <option value="cuillère">cuillères</option>
//                         <option value="unité">unité(s)</option>
//                       </select>
//                     </div>
//                     <div style={{ display: "flex", alignItems: "flex-end" }}>
//                       <button type="button" onClick={() => removeRow(i)}
//                         style={{ height: "44px", padding: "0 12px", backgroundColor: C.errorContainer, color: C.onErrorContainer, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
//                         Retirer
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Boutons de soumission */}
//           <div style={{ display: "flex", gap: "12px" }}>
//             <button type="button" onClick={() => navigate(-1)}
//               style={{ flex: 1, height: "52px", backgroundColor: C.surfaceContainer, color: C.onSurface, border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
//               Annuler
//             </button>
//             <button type="submit" disabled={submitting}
//               style={{ flex: 2, height: "52px", backgroundColor: submitting ? C.surfaceContainer : C.primary, color: submitting ? C.onSurfaceVariant : C.onPrimary, border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}>
//               {submitting ? "Enregistrement..." : "Enregistrer le Repas"}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const C = {
//   primary: "#0f5238",
//   onPrimary: "#ffffff",
//   primaryFixed: "#b1f0ce",
//   surface: "#f8f9fa",
//   surfaceContainerLowest: "#ffffff",
//   surfaceContainerLow: "#f3f4f5",
//   surfaceContainer: "#edeeef",
//   onSurface: "#191c1d",
//   onSurfaceVariant: "#404943",
//   outlineVariant: "#bfc9c1",
//   errorContainer: "#ffdad6",
//   onErrorContainer: "#93000a",
// };

// const DEFAUT_DASHBOARD = "/medecin/repas"; 
// const BASE_URL = "http://localhost:8000/api";

// export default function MedecinRepas() {
//   const navigate = useNavigate();
//   const [aliments, setAliments] = useState([]);
//   const [loadingAliments, setLoadingAliments] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [repas, setRepas] = useState({
//     nom: "", heure_repas: "12:00",
//     age_minimum_mois: 6, cout_estime_fcfa: 0,
//     description: "", recette: "",
//   });
//   const [compositions, setCompositions] = useState([
//     { aliment: "", quantite: 100, unite: "g" },
//   ]);

//   useEffect(() => {
//     const chargerAlimentsDirectement = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${BASE_URL}/nutrition/aliments/`, {
//           headers: { 
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         });
//         if (res.ok) {
//           const data = await res.json();
//           if (Array.isArray(data)) setAliments(data);
//         }
//       } catch (err) {
//         console.error("Erreur de récupération des aliments :", err);
//       } finally {
//         setLoadingAliments(false);
//       }
//     };
//     chargerAlimentsDirectement();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setRepas(prev => ({
//       ...prev,
//       [name]: ["age_minimum_mois", "cout_estime_fcfa"].includes(name)
//         ? parseInt(value, 10) || 0 : value,
//     }));
//   };

//   const addRow = () => setCompositions(p => [...p, { aliment: "", quantite: 100, unite: "g" }]);
//   const removeRow = (i) => setCompositions(p => p.filter((_, idx) => idx !== i));
//   const updateRow = (i, f, v) => setCompositions(p =>
//     p.map((r, idx) => idx === i ? { ...r, [f]: f === "quantite" ? parseFloat(v) || 0 : v } : r)
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!repas.nom.trim()) {
//       setError("Le nom du repas est obligatoire.");
//       return;
//     }

//     setSubmitting(true); 
//     setError("");
    
//     try {
//       const token = localStorage.getItem("token");
//       const headers = { 
//         "Content-Type": "application/json", 
//         "Authorization": `Bearer ${token}` 
//       };

//       // Payload nettoyé pour correspondre au RepasSerializer de Django
//       const repasPayload = {
//         nom: repas.nom,
//         //heure_repas: repas.heure_repas || "12:00",
//         heure_repas: repas.heures.join(","),
//         age_minimum_mois: parseInt(repas.age_minimum_mois, 10) || 6,
//         cout_estime_fcfa: parseFloat(repas.cout_estime_fcfa) || 0,
//         description: repas.description,
//         recette: repas.recette
//       };

//       // 1. Envoi du repas au backend
//       // const resRepas = await fetch(`${BASE_URL}/nutrition/repas/`, { 
//       //   method: "POST", 
//       //   headers, 
//       //   body: JSON.stringify(repasPayload) 
//       // });

//       const [repas, setRepas] = useState({
//         nom: "", 
//         heures: ["12:00"], // Remplacement de heure_repas par un tableau d'heures dynamiques
//         age_minimum_mois: 6, 
//         cout_estime_fcfa: 0,
//         description: "", 
//         recette: "",
//       });

//         const resRepas = await fetch(`${BASE_URL}/nutrition/repas/`, { 
//         method: "POST", 
//         headers, 
//         body: JSON.stringify(repasPayload) 
//       });

//       if (!resRepas.ok) {
//       const errData = await resRepas.json().catch(() => ({}));
//       throw new Error(errData.detail || "Le serveur Django a rejeté la création du repas.");
//     }

//     const repasCree = await resRepas.json();

//     for (const h of repas.heures) {
//       if (!h) continue; // Évite d'envoyer un champ vide

//       const horairePayload = {
//         repas: repasCree.id, // Liaison avec l'ID du repas venant d'être créé
//         heure: h // Ex: "08:30"
//       };

//       const resHoraire = await fetch(`${BASE_URL}/nutrition/horaires-repas/`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(horairePayload),
//       });

//       if (!resHoraire.ok) {
//         console.error("Erreur lors de l'enregistrement de l'horaire :", h);
//       }
//     }

    

//       const addHeure = () => setRepas(prev => ({ ...prev, heures: [...prev.heures, "12:00"] }));

//         const removeHeure = (index) => setRepas(prev => ({
//           ...prev,
//           heures: prev.heures.filter((_, idx) => idx !== index)
//         }));

//         const updateHeure = (index, valeur) => setRepas(prev => ({
//           ...prev,
//           heures: prev.heures.map((h, idx) => idx === index ? valeur : h)
//         }));

//       if (!resRepas.ok) {
//         const errData = await resRepas.json().catch(() => ({}));
//         throw new Error(errData.detail || "Le serveur Django a rejeté la création du repas.");
//       }

//       const repasCree = await resRepas.json();

//       // 2. Envoi des compositions d'ingrédients une par une
//       for (const comp of compositions) {
//         if (!comp.aliment || comp.quantite <= 0) continue;
        
//         const composerPayload = { 
//           repas: repasCree.id, 
//           aliment: parseInt(comp.aliment, 10), // Conversion stricte en Entier (évite la 500)
//           quantite: parseFloat(comp.quantite), 
//           unite: comp.unite 
//         };

//         const resComp = await fetch(`${BASE_URL}/nutrition/composer/`, {
//           method: "POST", 
//           headers,
//           body: JSON.stringify(composerPayload),
//         });

//         if (!resComp.ok) {
//           console.error("Erreur sur l'ingrédient ID:", comp.aliment);
//         }
//       }

//       setSuccess(true);
//       setTimeout(() => navigate(DEFAUT_DASHBOARD), 2000);
//     } catch (err) {
//       setError(err.message || "Une erreur interne du serveur (500) s'est produite.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleLocalLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("utilisateur");
//     navigate("/");
//   };

//   const input = {
//     width: "100%", height: "48px", padding: "0 14px",
//     borderRadius: "10px", border: `1px solid ${C.outlineVariant}`,
//     backgroundColor: C.surfaceContainerLow, fontSize: "14px",
//     outline: "none", boxSizing: "border-box",
//   };

//   const label = {
//     display: "block", fontSize: "13px", fontWeight: 600,
//     color: C.onSurfaceVariant, marginBottom: "6px",
//   };

//   const card = {
//     backgroundColor: C.surfaceContainerLowest, borderRadius: "16px",
//     padding: "20px", marginBottom: "16px",
//     border: `1px solid ${C.outlineVariant}40`,
//     boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//   };

//   return (
//     <div style={{ backgroundColor: C.surface, minHeight: "100vh", paddingBottom: "32px", fontFamily: "sans-serif" }}>
      
//       {/* Header */}
//       <div style={{ backgroundColor: C.primary, padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <button type="button" onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#A8D8C8", cursor: "pointer" }}>
//             Retour
//           </button>
//           <h1 style={{ color: C.onPrimary, fontSize: "18px", fontWeight: 700, margin: 0 }}>Créer un Repas</h1>
//         </div>
//         <button 
//           type="button"
//           onClick={handleLocalLogout}
//           style={{ background: "rgba(255,255,255,0.15)", border: "none", color: C.onPrimary, padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
//         >
//           Déconnexion
//         </button>
//       </div>

//       <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem 1rem" }}>
//         <p style={{ color: C.onSurfaceVariant, fontSize: "14px", marginBottom: "24px" }}>
//           Espace Médecin — Ajoutez un nouveau repas au catalogue NutriBébéCam
//         </p>

//         {success && (
//           <div style={{ backgroundColor: "#eafaf1", color: "#1a5c2e", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
//             Repas créé avec succès ! Redirection...
//           </div>
//         )}

//         {error && (
//           <div style={{ backgroundColor: C.errorContainer, color: C.onErrorContainer, padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {/* Formulaire principal */}
//           <div style={card}>
//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Nom du repas *</label>
//               <input type="text" name="nom" value={repas.nom} onChange={handleChange} placeholder="Ex: Purée de patate douce" required style={input} />
//             </div>

//             {/* <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Heure recommandée</label>
//               <input type="time" name="heure_repas" value={repas.heure_repas} onChange={handleChange} style={input} />
//             </div> */}

//             <div style={{ ...card, border: `1px solid ${C.outlineVariant}60` }}>
//                 <label style={label}>Heure(s) recommandée(s) de consommation</label>
//                 <p style={{ fontSize: "12px", color: C.onSurfaceVariant, marginTop: "-4px", marginBottom: "12px" }}>
//                   Ajoutez les différents moments de la journée où ce repas peut être consommé.
//                 </p>

//                 {repas.heures.map((heure, index) => (
//                   <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "center" }}>
//                     <input 
//                       type="time" 
//                       value={heure} 
//                       onChange={e => updateHeure(index, e.target.value)} 
//                       style={{ ...input, flex: 1 }} 
//                       required 
//                     />
                    
//                     {repas.heures.length > 1 && (
//                       <button 
//                         type="button" 
//                         onClick={() => removeHeure(index)} 
//                         style={{ 
//                           backgroundColor: C.errorContainer, 
//                           color: C.onErrorContainer, 
//                           border: "none", 
//                           borderRadius: "8px", 
//                           height: "48px", 
//                           padding: "0 14px", 
//                           cursor: "pointer" 
//                         }}
//                       >
//                         X
//                       </button>
//                     )}
//                   </div>
//                 ))}

//                 <button 
//                   type="button" 
//                   onClick={addHeure} 
//                   style={{ 
//                     marginTop: "6px", 
//                     backgroundColor: C.surfaceContainer, 
//                     color: C.primary, 
//                     border: `1px solid ${C.primary}40`, 
//                     borderRadius: "8px", 
//                     padding: "6px 12px", 
//                     cursor: "pointer",
//                     fontSize: "13px",
//                     fontWeight: 600
//                   }}
//                 >
//                   + Associer un autre horaire
//                 </button>
//               </div>

//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Âge minimum (mois)</label>
//               <input type="number" name="age_minimum_mois" value={repas.age_minimum_mois} onChange={handleChange} min="4" max="24" style={input} />
//             </div>

//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Coût estimé (FCFA)</label>
//               <input type="number" name="cout_estime_fcfa" value={repas.cout_estime_fcfa} onChange={handleChange} min="0" style={input} />
//             </div>

//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Description</label>
//               <textarea name="description" value={repas.description} onChange={handleChange} placeholder="Description..." rows={3} style={{ ...input, height: "auto", padding: "12px 14px" }} />
//             </div>

//             <div>
//               <label style={label}>Recette</label>
//               <textarea name="recette" value={repas.recette} onChange={handleChange} placeholder="Instructions..." rows={4} style={{ ...input, height: "auto", padding: "12px 14px" }} />
//             </div>
//           </div>
//           <div style={card}>
//   <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.primary, marginBottom: "16px" }}>
//     Ingrédients du repas
//   </h2>
  
//   {loadingAliments ? (
//     <p style={{ textAlign: "center", color: C.onSurfaceVariant }}>Chargement des suggestions...</p>
//   ) : (
//     compositions.map((comp, i) => (
//       <div key={i} style={{ backgroundColor: C.surfaceContainerLow, borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
        
//         {/* Saisie libre de l'aliment avec suggestions automatiques (datalist) */}
//         <div style={{ marginBottom: "10px" }}>
//           <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.onSurfaceVariant, marginBottom: "4px" }}>
//             Nom de l'aliment / ingrédient *
//           </label>
//           <input 
//             type="text"
//             list="liste-aliments-suggestions"
//             value={comp.nomAliment || ""} 
//             onChange={e => updateRow(i, "nomAliment", e.target.value)} 
//             placeholder="Ex: Patate douce, Poulet, Banane..." 
//             style={input} 
//             required 
//           />
//         </div>

//             <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
//               <div style={{ flex: 1 }}>
//                 <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.onSurfaceVariant, marginBottom: "4px" }}>Quantité</label>
//                 <input type="number" value={comp.quantite} onChange={e => updateRow(i, "quantite", e.target.value)} style={input} min="1" required />
//               </div>
              
//               <div style={{ flex: 1 }}>
//                 <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.onSurfaceVariant, marginBottom: "4px" }}>Unité</label>
//                 <select value={comp.unite} onChange={e => updateRow(i, "unite", e.target.value)} style={input}>
//                   <option value="g">grammes (g)</option>
//                   <option value="ml">millilitres (ml)</option>
//                   <option value="cuillère à soupe">cuillère(s) à soupe</option>
//                 </select>
//               </div>

//           <button type="button" onClick={() => removeRow(i)} style={{ backgroundColor: C.errorContainer, color: C.onErrorContainer, border: "none", borderRadius: "8px", height: "48px", padding: "0 16px", cursor: "pointer" }}>
//             X
//           </button>
//         </div>
//       </div>
//     ))
//   )}

//   {/* Le datalist invisible qui stocke les aliments existants pour l'auto-complétion browser */}
//   <datalist id="liste-aliments-suggestions">
//     {aliments.map(a => <option key={a.id} value={a.nom} />)}
//   </datalist>

//   <button type="button" onClick={addRow} style={{ marginTop: "10px", backgroundColor: C.primary, color: C.onPrimary, border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: 600 }}>
//     + Ajouter un ingrédient
//   </button>
// </div>

//           <div style={{ display: "flex", gap: "12px" }}>
//             <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, height: "52px", backgroundColor: C.surfaceContainer, border: "none", borderRadius: "12px", cursor: "pointer" }}>
//               Annuler
//             </button>
//             <button type="submit" disabled={submitting} style={{ flex: 2, height: "52px", backgroundColor: C.primary, color: C.onPrimary, border: "none", borderRadius: "12px", cursor: "pointer" }}>
//               {submitting ? "Enregistrement..." : "Enregistrer"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  primary: "#0f5238",
  onPrimary: "#ffffff",
  primaryFixed: "#b1f0ce",
  surface: "#f8f9fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f3f4f5",
  surfaceContainer: "#edeeef",
  onSurface: "#191c1d",
  onSurfaceVariant: "#404943",
  outlineVariant: "#bfc9c1",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
};

const DEFAUT_DASHBOARD = "/medecin/repas"; 
const BASE_URL = "http://localhost:8000/api";

export default function MedecinRepas() {
  const navigate = useNavigate();
  const [aliments, setAliments] = useState([]);
  const [loadingAliments, setLoadingAliments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // 1. État initial unifié avec le tableau d'heures
  const [repas, setRepas] = useState({
    nom: "", 
    heures: ["12:00"], 
    age_minimum_mois: 6, 
    cout_estime_fcfa: 0,
    description: "", 
    recette: "",
  });

  // 2. État des compositions adapté à la saisie textuelle libre
  const [compositions, setCompositions] = useState([
    { nomAliment: "", quantite: 100, unite: "g" },
  ]);

  // Chargement initial des aliments existants pour les suggestions
  useEffect(() => {
    const chargerAlimentsDirectement = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/nutrition/aliments/`, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setAliments(data);
        }
      } catch (err) {
        console.error("Erreur de récupération des aliments :", err);
      } finally {
        setLoadingAliments(false);
      }
    };
    chargerAlimentsDirectement();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRepas(prev => ({
      ...prev,
      [name]: ["age_minimum_mois", "cout_estime_fcfa"].includes(name)
        ? parseInt(value, 10) || 0 : value,
    }));
  };

  // Fonctions de gestion des heures dynamiques
  const addHeure = () => setRepas(prev => ({ ...prev, heures: [...prev.heures, "12:00"] }));
  
  const removeHeure = (index) => setRepas(prev => ({
    ...prev,
    heures: prev.heures.filter((_, idx) => idx !== index)
  }));

  const updateHeure = (index, valeur) => setRepas(prev => ({
    ...prev,
    heures: prev.heures.map((h, idx) => idx === index ? valeur : h)
  }));

  // Fonctions de gestion des lignes d'ingrédients
  const addRow = () => setCompositions(p => [...p, { nomAliment: "", quantite: 100, unite: "g" }]);
  const removeRow = (i) => setCompositions(p => p.filter((_, idx) => idx !== i));
  const updateRow = (i, f, v) => setCompositions(p =>
    p.map((r, idx) => idx === i ? { ...r, [f]: f === "quantite" ? parseFloat(v) || 0 : v } : r)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repas.nom.trim()) {
      setError("Le nom du repas est obligatoire.");
      return;
    }

    setSubmitting(true); 
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const headers = { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      };

      // Payload épuré pour correspondre au modèle principal Repas Django (sans le TimeField unique)
      const repasPayload = {
        nom: repas.nom,
        age_minimum_mois: parseInt(repas.age_minimum_mois, 10) || 6,
        cout_estime_fcfa: parseFloat(repas.cout_estime_fcfa) || 0,
        description: repas.description,
        recette: repas.recette
      };

      // Étape 1 : Envoi du repas principal
      const resRepas = await fetch(`${BASE_URL}/nutrition/repas/`, { 
        method: "POST", 
        headers, 
        body: JSON.stringify(repasPayload) 
      });

      if (!resRepas.ok) {
        const errData = await resRepas.json().catch(() => ({}));
        throw new Error(errData.detail || "Le serveur Django a rejeté la création du repas.");
      }

      const repasCree = await resRepas.json();

      // Étape 2 : Traitement en profondeur — Envoi des multiples horaires sur la table dédiée
      for (const h of repas.heures) {
        if (!h) continue;

        const horairePayload = {
          repas: repasCree.id, 
          heure: h 
        };

        const resHoraire = await fetch(`${BASE_URL}/nutrition/horaires-repas/`, {
          method: "POST",
          headers,
          body: JSON.stringify(horairePayload),
        });

        if (!resHoraire.ok) {
          console.error("Erreur lors de l'enregistrement de l'horaire :", h);
        }
      }

      // Étape 3 : Traitement anti-doublon des ingrédients
      for (const comp of compositions) {
        if (!comp.nomAliment || comp.nomAliment.trim() === "" || comp.quantite <= 0) continue;
        
        let alimentId = null;
        const nomNettoye = comp.nomAliment.trim();

        // Vérification si l'aliment existe déjà (insensible à la casse)
        const alimentExistant = aliments.find(
          a => a.nom.toLowerCase() === nomNettoye.toLowerCase()
        );

        if (alimentExistant) {
          alimentId = alimentExistant.id;
        } else {
          // L'aliment est nouveau, création automatique en base de données
          const resNouvelAliment = await fetch(`${BASE_URL}/nutrition/aliments/`, {
            method: "POST",
            headers,
            body: JSON.stringify({ nom: nomNettoye, categorie: "Autre" })
          });

          if (resNouvelAliment.ok) {
            const nouvelAlimentCree = await resNouvelAliment.json();
            alimentId = nouvelAlimentCree.id;
          } else {
            console.error("Impossible de créer l'aliment libre :", nomNettoye);
            continue;
          }
        }

        // Création du lien de composition final
        const composerPayload = { 
          repas: repasCree.id, 
          aliment: parseInt(alimentId, 10), 
          quantite: parseFloat(comp.quantite), 
          unite: comp.unite 
        };

        const resComp = await fetch(`${BASE_URL}/nutrition/composer/`, {
          method: "POST", 
          headers,
          body: JSON.stringify(composerPayload),
        });

        if (!resComp.ok) {
          console.error("Erreur lors de l'enregistrement de la composition pour l'aliment ID:", alimentId);
        }
      }

      setSuccess(true);
      setTimeout(() => navigate(DEFAUT_DASHBOARD), 2000);
    } catch (err) {
      setError(err.message || "Une erreur interne s'est produite.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLocalLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utilisateur");
    navigate("/");
  };

  const input = {
    width: "100%", height: "48px", padding: "0 14px",
    borderRadius: "10px", border: `1px solid ${C.outlineVariant}`,
    backgroundColor: C.surfaceContainerLow, fontSize: "14px",
    outline: "none", boxSizing: "border-box",
  };

  const label = {
    display: "block", fontSize: "13px", fontWeight: 600,
    color: C.onSurfaceVariant, marginBottom: "6px",
  };

  const card = {
    backgroundColor: C.surfaceContainerLowest, borderRadius: "16px",
    padding: "20px", marginBottom: "16px",
    border: `1px solid ${C.outlineVariant}40`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  };

  return (
    <div style={{ backgroundColor: C.surface, minHeight: "100vh", paddingBottom: "32px", fontFamily: "sans-serif" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: C.primary, padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button type="button" onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#A8D8C8", cursor: "pointer", fontSize: "15px", fontWeight: 600 }}>
            ← Retour
          </button>
          <h1 style={{ color: C.onPrimary, fontSize: "18px", fontWeight: 700, margin: 0 }}>Créer un Repas</h1>
        </div>
        <button 
          type="button"
          onClick={handleLocalLogout}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", color: C.onPrimary, padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
        >
          Déconnexion
        </button>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem 1rem" }}>
        <p style={{ color: C.onSurfaceVariant, fontSize: "14px", marginBottom: "24px" }}>
          Espace Médecin — Ajoutez un nouveau repas au catalogue NutriBébéCam
        </p>

        {success && (
          <div style={{ backgroundColor: "#eafaf1", color: "#1a5c2e", padding: "16px", borderRadius: "12px", marginBottom: "16px", fontWeight: 600 }}>
            Repas créé avec succès ! Redirection...
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: C.errorContainer, color: C.onErrorContainer, padding: "16px", borderRadius: "12px", marginBottom: "16px", fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Informations de base */}
          <div style={card}>
            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Nom du repas *</label>
              <input type="text" name="nom" value={repas.nom} onChange={handleChange} placeholder="Ex: Purée de patate douce" required style={input} />
            </div>

            {/* Saisie d'heures multiples (Traitement en profondeur) */}
            <div style={{ ...card, border: `1px solid ${C.outlineVariant}60`, padding: "14px", margin: "14px 0" }}>
              <label style={label}>Heure(s) recommandée(s) de consommation *</label>
              <p style={{ fontSize: "12px", color: C.onSurfaceVariant, marginTop: "-4px", marginBottom: "12px" }}>
                Ajoutez les différents moments de la journée où ce repas peut être consommé.
              </p>

              {repas.heures.map((heure, index) => (
                <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "center" }}>
                  <input 
                    type="time" 
                    value={heure} 
                    onChange={e => updateHeure(index, e.target.value)} 
                    style={{ ...input, flex: 1 }} 
                    required 
                  />
                  
                  {repas.heures.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeHeure(index)} 
                      style={{ 
                        backgroundColor: C.errorContainer, 
                        color: C.onErrorContainer, 
                        border: "none", 
                        borderRadius: "8px", 
                        height: "48px", 
                        padding: "0 14px", 
                        cursor: "pointer" 
                      }}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}

              <button 
                type="button" 
                onClick={addHeure} 
                style={{ 
                  marginTop: "6px", 
                  backgroundColor: C.surfaceContainer, 
                  color: C.primary, 
                  border: `1px solid ${C.primary}40`, 
                  borderRadius: "8px", 
                  padding: "6px 12px", 
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600
                }}
              >
                + Associer un autre horaire
              </button>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Âge minimum (mois)</label>
              <input type="number" name="age_minimum_mois" value={repas.age_minimum_mois} onChange={handleChange} min="4" max="24" style={input} />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Coût estimé (FCFA)</label>
              <input type="number" name="cout_estime_fcfa" value={repas.cout_estime_fcfa} onChange={handleChange} min="0" style={input} />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Description</label>
              <textarea name="description" value={repas.description} onChange={handleChange} placeholder="Description des bienfaits..." rows={3} style={{ ...input, height: "auto", padding: "12px 14px", resize: "vertical" }} />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Recette</label>
              <textarea name="recette" value={repas.recette} onChange={handleChange} placeholder="Instructions de préparation..." rows={4} style={{ ...input, height: "auto", padding: "12px 14px", resize: "vertical" }} />
            </div>
          </div>

          {/* Section Ingrédients Dynamiques (Saisie libre sans doublons) */}
          <div style={card}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.primary, marginBottom: "16px" }}>
              Ingrédients du repas
            </h2>
            
            {loadingAliments ? (
              <p style={{ textAlign: "center", color: C.onSurfaceVariant }}>Chargement des suggestions...</p>
            ) : (
              compositions.map((comp, i) => (
                <div key={i} style={{ backgroundColor: C.surfaceContainerLow, borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
                  
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.onSurfaceVariant, marginBottom: "4px" }}>
                      Nom de l'aliment / ingrédient *
                    </label>
                    <input 
                      type="text"
                      list="liste-aliments-suggestions"
                      value={comp.nomAliment || ""} 
                      onChange={e => updateRow(i, "nomAliment", e.target.value)} 
                      placeholder="Ex: Patate douce, Poulet, Malaxé..." 
                      style={input} 
                      required 
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.onSurfaceVariant, marginBottom: "4px" }}>Quantité</label>
                      <input type="number" value={comp.quantite} onChange={e => updateRow(i, "quantite", e.target.value)} style={input} min="1" required />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: C.onSurfaceVariant, marginBottom: "4px" }}>Unité</label>
                      <select value={comp.unite} onChange={e => updateRow(i, "unite", e.target.value)} style={input}>
                        <option value="g">grammes (g)</option>
                        <option value="ml">millilitres (ml)</option>
                        <option value="cuillère à soupe">cuillère(s) à soupe</option>
                        <option value="unité">unité(s)</option>
                      </select>
                    </div>

                    <button type="button" onClick={() => removeRow(i)} style={{ backgroundColor: C.errorContainer, color: C.onErrorContainer, border: "none", borderRadius: "8px", height: "48px", padding: "0 16px", cursor: "pointer" }}>
                      X
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Datalist lié pour l'auto-complétion navigateur transparente */}
            <datalist id="liste-aliments-suggestions">
              {aliments.map(a => <option key={a.id} value={a.nom} />)}
            </datalist>

            <button type="button" onClick={addRow} style={{ marginTop: "10px", backgroundColor: C.primary, color: C.onPrimary, border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: 600 }}>
              + Ajouter un ingrédient
            </button>
          </div>

          {/* Actions du bas */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, height: "52px", backgroundColor: C.surfaceContainer, color: C.onSurface, border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 600 }}>
              Annuler
            </button>
            <button type="submit" disabled={submitting} style={{ flex: 2, height: "52px", backgroundColor: C.primary, color: C.onPrimary, border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 700 }}>
              {submitting ? "Enregistrement..." : "Enregistrer le Repas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}