// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getAliments,
//   creerAliment,
//   publierRepasAuxFamilles,
//   api, // import direct de l'instance axios
// } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// // import { api } from "../services/api";
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

// export default function MedecinRepas() {
//   const navigate = useNavigate();
//   const { logout, user } = useAuth();
//   const [aliments, setAliments] = useState([]);
//   const [loadingAliments, setLoadingAliments] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [imageFile, setImageFile] = useState(null); // 🆕 état pour l'image

//   const [repas, setRepas] = useState({
//     nom: "",
//     heures: ["12:00"],
//     age_minimum_mois: 6,
//     cout_estime_fcfa: 0,
//     description: "",
//     recette: "",
//   });

//   const [compositions, setCompositions] = useState([
//     { nomAliment: "", quantite: 100, unite: "g" },
//   ]);

//   useEffect(() => {
//     getAliments()
//       .then((data) => setAliments(Array.isArray(data) ? data : []))
//       .catch((err) => console.error("Erreur de récupération des aliments :", err))
//       .finally(() => setLoadingAliments(false));
//   }, []);

//   useEffect(() => {
//     if (user && user.role !== "medecin") {
//       setError("Vous n'avez pas les droits pour créer un repas.");
//       setTimeout(() => navigate(DEFAUT_DASHBOARD), 2000);
//     }
//   }, [user, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setRepas((prev) => ({
//       ...prev,
//       [name]: ["age_minimum_mois", "cout_estime_fcfa"].includes(name)
//         ? parseInt(value, 10) || 0
//         : value,
//     }));
//   };

//   const addHeure = () =>
//     setRepas((prev) => ({ ...prev, heures: [...prev.heures, "12:00"] }));

//   const removeHeure = (index) =>
//     setRepas((prev) => ({
//       ...prev,
//       heures: prev.heures.filter((_, idx) => idx !== index),
//     }));

//   const updateHeure = (index, valeur) =>
//     setRepas((prev) => ({
//       ...prev,
//       heures: prev.heures.map((h, idx) => (idx === index ? valeur : h)),
//     }));

//   const addRow = () =>
//     setCompositions((p) => [...p, { nomAliment: "", quantite: 100, unite: "g" }]);

//   const removeRow = (i) =>
//     setCompositions((p) => p.filter((_, idx) => idx !== i));

//   const updateRow = (i, f, v) =>
//     setCompositions((p) =>
//       p.map((r, idx) =>
//         idx === i
//           ? { ...r, [f]: f === "quantite" ? parseFloat(v) || 0 : v }
//           : r
//       )
//     );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!repas.nom.trim()) {
//       setError("Le nom du repas est obligatoire.");
//       return;
//     }

//     setSubmitting(true);
//     setError("");

//     try {
//       // 1. Créer ou récupérer les aliments (ingrédients) pour avoir leurs IDs
//       const ingredientsAvecId = [];
//       for (const comp of compositions) {
//         if (!comp.nomAliment?.trim() || comp.quantite <= 0) continue;
//         const nomNettoye = comp.nomAliment.trim();
//         let alimentId = aliments.find(
//           (a) => a.nom.toLowerCase() === nomNettoye.toLowerCase()
//         )?.id;

//         if (!alimentId) {
//           const nouvel = await creerAliment({
//             nom: nomNettoye,
//             age_minimum_mois: parseInt(repas.age_minimum_mois, 10) || 6,
//             prix_unitaire_fcfa: 0,
//             description: "",
//           });
//           alimentId = nouvel.id;
//           setAliments((prev) => [...prev, nouvel]);
//         }
//         ingredientsAvecId.push({
//           aliment: alimentId,
//           quantite: parseFloat(comp.quantite),
//           unite: comp.unite,
//         });
//       }

//       // 2. Préparer les horaires
//       const horairesData = repas.heures.filter((h) => h).map((h) => ({ heure: h }));

//       // 3. Construire FormData pour envoyer l'image et les données
//       const formData = new FormData();
//       formData.append("nom", repas.nom.trim());
//       formData.append("age_minimum_mois", parseInt(repas.age_minimum_mois, 10) || 6);
//       formData.append("cout_estime_fcfa", parseFloat(repas.cout_estime_fcfa) || 0);
//       formData.append("description", repas.description);
//       formData.append("recette", repas.recette);
//       if (imageFile) {
//         // formData.append("image", imageFile);
//         const extension = imageFile.name.split('.').pop();
//         const shortName = `repas_${Date.now()}.${extension}`;
//         const renamedFile = new File([imageFile], shortName, { type: imageFile.type });
//         formData.append("image", renamedFile);
//       }
//       // Les tableaux complexes doivent être stringifiés
//       formData.append("horaires_data", JSON.stringify(horairesData));
//       formData.append("compositions_data", JSON.stringify(ingredientsAvecId));

//       // 4. Appel direct à l'API (multipart) - contourne creerRepas qui attend du JSON
//       const response = await api.post("nutrition/repas/", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       const repasCree = response.data;

//       // 5. Publier aux familles
//       const pub = await publierRepasAuxFamilles(repasCree.id);

//       setSuccess(true);
//       setTimeout(() => {
//         alert(
//           `Repas enregistré. ${pub.programmes_crees ?? 0} créneau(x) ajouté(s) au planning des familles pour aujourd'hui.`
//         );
//         navigate(DEFAUT_DASHBOARD);
//       }, 800);
//     } catch (err) {
//       console.error("Erreur détaillée :", err);
//       let message = "Erreur lors de l'enregistrement du repas.";
//       if (err.response?.data?.detail) message = err.response.data.detail;
//       else if (err.response?.data?.error) message = err.response.data.error;
//       else if (err.message) message = err.message;
//       if (err.response?.data?.trace) console.error(err.response.data.trace);
//       setError(message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleLocalLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const input = {
//     width: "100%",
//     height: "48px",
//     padding: "0 14px",
//     borderRadius: "10px",
//     border: `1px solid ${C.outlineVariant}`,
//     backgroundColor: C.surfaceContainerLow,
//     fontSize: "14px",
//     outline: "none",
//     boxSizing: "border-box",
//   };

//   const label = {
//     display: "block",
//     fontSize: "13px",
//     fontWeight: 600,
//     color: C.onSurfaceVariant,
//     marginBottom: "6px",
//   };

//   const card = {
//     backgroundColor: C.surfaceContainerLowest,
//     borderRadius: "16px",
//     padding: "20px",
//     marginBottom: "16px",
//     border: `1px solid ${C.outlineVariant}40`,
//     boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: C.surface,
//         minHeight: "100vh",
//         paddingBottom: "32px",
//         fontFamily: "sans-serif",
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: C.primary,
//           padding: "1rem 1.2rem",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             style={{
//               background: "none",
//               border: "none",
//               color: "#A8D8C8",
//               cursor: "pointer",
//               fontSize: "15px",
//               fontWeight: 600,
//             }}
//           >
//             ← Retour
//           </button>
//           <h1
//             style={{
//               color: C.onPrimary,
//               fontSize: "18px",
//               fontWeight: 700,
//               margin: 0,
//             }}
//           >
//             Créer un Repas
//           </h1>
//         </div>
//         <button
//           type="button"
//           onClick={handleLocalLogout}
//           style={{
//             background: "rgba(255,255,255,0.15)",
//             border: "none",
//             color: C.onPrimary,
//             padding: "6px 14px",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontSize: "13px",
//             fontWeight: 600,
//           }}
//         >
//           Déconnexion
//         </button>
//       </div>

//       <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem 1rem" }}>
//         <p
//           style={{
//             color: C.onSurfaceVariant,
//             fontSize: "14px",
//             marginBottom: "24px",
//           }}
//         >
//           Espace Médecin — Ajoutez un nouveau repas au catalogue NutriBébéCam
//         </p>

//         {success && (
//           <div
//             style={{
//               backgroundColor: "#eafaf1",
//               color: "#1a5c2e",
//               padding: "16px",
//               borderRadius: "12px",
//               marginBottom: "16px",
//               fontWeight: 600,
//             }}
//           >
//             Repas créé avec succès ! Redirection...
//           </div>
//         )}

//         {error && (
//           <div
//             style={{
//               backgroundColor: C.errorContainer,
//               color: C.onErrorContainer,
//               padding: "16px",
//               borderRadius: "12px",
//               marginBottom: "16px",
//               fontWeight: 600,
//             }}
//           >
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div style={card}>
//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Nom du repas *</label>
//               <input
//                 type="text"
//                 name="nom"
//                 value={repas.nom}
//                 onChange={handleChange}
//                 placeholder="Ex: Purée de patate douce"
//                 required
//                 style={input}
//               />
//             </div>

//             <div
//               style={{
//                 ...card,
//                 border: `1px solid ${C.outlineVariant}60`,
//                 padding: "14px",
//                 margin: "14px 0",
//               }}
//             >
//               <label style={label}>Heure(s) recommandée(s) de consommation *</label>
//               <p
//                 style={{
//                   fontSize: "12px",
//                   color: C.onSurfaceVariant,
//                   marginTop: "-4px",
//                   marginBottom: "12px",
//                 }}
//               >
//                 Ajoutez les différents moments de la journée où ce repas peut être consommé.
//               </p>

//               {repas.heures.map((heure, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     display: "flex",
//                     gap: "10px",
//                     marginBottom: "8px",
//                     alignItems: "center",
//                   }}
//                 >
//                   <input
//                     type="time"
//                     value={heure}
//                     onChange={(e) => updateHeure(index, e.target.value)}
//                     style={{ ...input, flex: 1 }}
//                     required
//                   />
//                   {repas.heures.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeHeure(index)}
//                       style={{
//                         backgroundColor: C.errorContainer,
//                         color: C.onErrorContainer,
//                         border: "none",
//                         borderRadius: "8px",
//                         height: "48px",
//                         padding: "0 14px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       X
//                     </button>
//                   )}
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={addHeure}
//                 style={{
//                   marginTop: "6px",
//                   backgroundColor: C.surfaceContainer,
//                   color: C.primary,
//                   border: `1px solid ${C.primary}40`,
//                   borderRadius: "8px",
//                   padding: "6px 12px",
//                   cursor: "pointer",
//                   fontSize: "13px",
//                   fontWeight: 600,
//                 }}
//               >
//                 + Associer un autre horaire
//               </button>
//             </div>

//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Âge minimum (mois)</label>
//               <input
//                 type="number"
//                 name="age_minimum_mois"
//                 value={repas.age_minimum_mois}
//                 onChange={handleChange}
//                 min="4"
//                 max="24"
//                 style={input}
//               />
//             </div>

//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Coût estimé (FCFA)</label>
//               <input
//                 type="number"
//                 name="cout_estime_fcfa"
//                 value={repas.cout_estime_fcfa}
//                 onChange={handleChange}
//                 min="0"
//                 style={input}
//               />
//             </div>

//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Description</label>
//               <textarea
//                 name="description"
//                 value={repas.description}
//                 onChange={handleChange}
//                 placeholder="Description des bienfaits..."
//                 rows={3}
//                 style={{ ...input, height: "auto", padding: "12px 14px", resize: "vertical" }}
//               />
//             </div>

//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Recette</label>
//               <textarea
//                 name="recette"
//                 value={repas.recette}
//                 onChange={handleChange}
//                 placeholder="Instructions de préparation..."
//                 rows={4}
//                 style={{ ...input, height: "auto", padding: "12px 14px", resize: "vertical" }}
//               />
//             </div>

//             {/* 🆕 Champ image */}
//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Image du repas (optionnel)</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setImageFile(e.target.files[0])}
//                 style={{ ...input, padding: "8px 14px" }}
//               />
//             </div>
//           </div>

//           <div style={card}>
//             <h2
//               style={{
//                 fontSize: "16px",
//                 fontWeight: 700,
//                 color: C.primary,
//                 marginBottom: "16px",
//               }}
//             >
//               Ingrédients du repas
//             </h2>

//             {loadingAliments ? (
//               <p style={{ textAlign: "center", color: C.onSurfaceVariant }}>
//                 Chargement des suggestions...
//               </p>
//             ) : (
//               compositions.map((comp, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     backgroundColor: C.surfaceContainerLow,
//                     borderRadius: "12px",
//                     padding: "14px",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <div style={{ marginBottom: "10px" }}>
//                     <label
//                       style={{
//                         display: "block",
//                         fontSize: "12px",
//                         fontWeight: 600,
//                         color: C.onSurfaceVariant,
//                         marginBottom: "4px",
//                       }}
//                     >
//                       Nom de l'aliment / ingrédient *
//                     </label>
//                     <input
//                       type="text"
//                       list="liste-aliments-suggestions"
//                       value={comp.nomAliment || ""}
//                       onChange={(e) => updateRow(i, "nomAliment", e.target.value)}
//                       placeholder="Ex: Patate douce, Poulet, Malaxé..."
//                       style={input}
//                       required
//                     />
//                   </div>

//                   <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
//                     <div style={{ flex: 1 }}>
//                       <label
//                         style={{
//                           display: "block",
//                           fontSize: "12px",
//                           fontWeight: 600,
//                           color: C.onSurfaceVariant,
//                           marginBottom: "4px",
//                         }}
//                       >
//                         Quantité
//                       </label>
//                       <input
//                         type="number"
//                         value={comp.quantite}
//                         onChange={(e) => updateRow(i, "quantite", e.target.value)}
//                         style={input}
//                         min="1"
//                         required
//                       />
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <label
//                         style={{
//                           display: "block",
//                           fontSize: "12px",
//                           fontWeight: 600,
//                           color: C.onSurfaceVariant,
//                           marginBottom: "4px",
//                         }}
//                       >
//                         Unité
//                       </label>
//                       <select
//                         value={comp.unite}
//                         onChange={(e) => updateRow(i, "unite", e.target.value)}
//                         style={input}
//                       >
//                         <option value="g">grammes (g)</option>
//                         <option value="ml">millilitres (ml)</option>
//                         <option value="cuillère à soupe">cuillère(s) à soupe</option>
//                         <option value="unité">unité(s)</option>
//                       </select>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeRow(i)}
//                       style={{
//                         backgroundColor: C.errorContainer,
//                         color: C.onErrorContainer,
//                         border: "none",
//                         borderRadius: "8px",
//                         height: "48px",
//                         padding: "0 16px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       X
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}

//             <datalist id="liste-aliments-suggestions">
//               {aliments.map((a) => (
//                 <option key={a.id} value={a.nom} />
//               ))}
//             </datalist>

//             <button
//               type="button"
//               onClick={addRow}
//               style={{
//                 marginTop: "10px",
//                 backgroundColor: C.primary,
//                 color: C.onPrimary,
//                 border: "none",
//                 borderRadius: "8px",
//                 padding: "8px 14px",
//                 cursor: "pointer",
//                 fontWeight: 600,
//               }}
//             >
//               + Ajouter un ingrédient
//             </button>
//           </div>

//           <div style={{ display: "flex", gap: "12px" }}>
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               style={{
//                 flex: 1,
//                 height: "52px",
//                 backgroundColor: C.surfaceContainer,
//                 color: C.onSurface,
//                 border: "none",
//                 borderRadius: "12px",
//                 cursor: "pointer",
//                 fontWeight: 600,
//               }}
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               disabled={submitting}
//               style={{
//                 flex: 2,
//                 height: "52px",
//                 backgroundColor: C.primary,
//                 color: C.onPrimary,
//                 border: "none",
//                 borderRadius: "12px",
//                 cursor: "pointer",
//                 fontWeight: 700,
//               }}
//             >
//               {submitting ? "Enregistrement..." : "Enregistrer le Repas"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAliments,
  creerAliment,
  api,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

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

const DEFAUT_DASHBOARD = "/medecin/dashboard";

export default function MedecinRepas() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [aliments, setAliments] = useState([]);
  const [loadingAliments, setLoadingAliments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [repas, setRepas] = useState({
    nom: "",
    heures: ["12:00"],
    age_minimum_mois: 6,
    cout_estime_fcfa: 0,
    description: "",
    recette: "",
  });

  const [compositions, setCompositions] = useState([
    { nomAliment: "", quantite: 100, unite: "g" },
  ]);

  useEffect(() => {
    getAliments()
      .then((data) => setAliments(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erreur de récupération des aliments :", err))
      .finally(() => setLoadingAliments(false));
  }, []);

  useEffect(() => {
    if (user && user.role !== "medecin") {
      setError("Vous n'avez pas les droits pour créer un repas.");
      setTimeout(() => navigate(DEFAUT_DASHBOARD), 2000);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRepas((prev) => ({
      ...prev,
      [name]: ["age_minimum_mois", "cout_estime_fcfa"].includes(name)
        ? parseInt(value, 10) || 0
        : value,
    }));
  };

  const addHeure = () =>
    setRepas((prev) => ({ ...prev, heures: [...prev.heures, "12:00"] }));

  const removeHeure = (index) =>
    setRepas((prev) => ({
      ...prev,
      heures: prev.heures.filter((_, idx) => idx !== index),
    }));

  const updateHeure = (index, valeur) =>
    setRepas((prev) => ({
      ...prev,
      heures: prev.heures.map((h, idx) => (idx === index ? valeur : h)),
    }));

  const addRow = () =>
    setCompositions((p) => [...p, { nomAliment: "", quantite: 100, unite: "g" }]);

  const removeRow = (i) =>
    setCompositions((p) => p.filter((_, idx) => idx !== i));

  const updateRow = (i, f, v) =>
    setCompositions((p) =>
      p.map((r, idx) =>
        idx === i
          ? { ...r, [f]: f === "quantite" ? parseFloat(v) || 0 : v }
          : r
      )
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
      // 1. Créer ou récupérer les aliments (ingrédients) pour avoir leurs IDs
      const ingredientsAvecId = [];
      for (const comp of compositions) {
        if (!comp.nomAliment?.trim() || comp.quantite <= 0) continue;
        const nomNettoye = comp.nomAliment.trim();
        let alimentId = aliments.find(
          (a) => a.nom.toLowerCase() === nomNettoye.toLowerCase()
        )?.id;

        if (!alimentId) {
          const nouvel = await creerAliment({
            nom: nomNettoye,
            age_minimum_mois: parseInt(repas.age_minimum_mois, 10) || 6,
            prix_unitaire_fcfa: 0,
            description: "",
          });
          alimentId = nouvel.id;
          setAliments((prev) => [...prev, nouvel]);
        }
        ingredientsAvecId.push({
          aliment: alimentId,
          quantite: parseFloat(comp.quantite),
          unite: comp.unite,
        });
      }

      // 2. Préparer les horaires
      const horairesData = repas.heures.filter((h) => h).map((h) => ({ heure: h }));

      // 3. Construire FormData pour envoyer l'image et les données
      const formData = new FormData();
      formData.append("nom", repas.nom.trim());
      formData.append("age_minimum_mois", parseInt(repas.age_minimum_mois, 10) || 6);
      formData.append("cout_estime_fcfa", parseFloat(repas.cout_estime_fcfa) || 0);
      formData.append("description", repas.description);
      formData.append("recette", repas.recette);
      if (imageFile) {
        const extension = imageFile.name.split('.').pop();
        const shortName = `repas_${Date.now()}.${extension}`;
        const renamedFile = new File([imageFile], shortName, { type: imageFile.type });
        formData.append("image", renamedFile);
      }
      formData.append("horaires_data", JSON.stringify(horairesData));
      formData.append("compositions_data", JSON.stringify(ingredientsAvecId));

      // 4. Appel direct à l'API (multipart)
      const response = await api.post("nutrition/repas/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const repasCree = response.data;

      // 5. NE PAS PUBLIER AUTOMATIQUEMENT – seul le médecin décide via le dashboard
      // La publication se fait via le bouton "Publier aujourd'hui" dans MedecinDashboard

      setSuccess(true);
      setTimeout(() => {
        alert(`Repas "${repasCree.nom}" enregistré dans le catalogue.`);
        navigate(DEFAUT_DASHBOARD);
      }, 800);
    } catch (err) {
      console.error("Erreur détaillée :", err);
      let message = "Erreur lors de l'enregistrement du repas.";
      if (err.response?.data?.detail) message = err.response.data.detail;
      else if (err.response?.data?.error) message = err.response.data.error;
      else if (err.message) message = err.message;
      if (err.response?.data?.trace) console.error(err.response.data.trace);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLocalLogout = () => {
    logout();
    navigate("/");
  };

  const input = {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    borderRadius: "10px",
    border: `1px solid ${C.outlineVariant}`,
    backgroundColor: C.surfaceContainerLow,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const label = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: C.onSurfaceVariant,
    marginBottom: "6px",
  };

  const card = {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    border: `1px solid ${C.outlineVariant}40`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  };

  return (
    <div
      style={{
        backgroundColor: C.surface,
        minHeight: "100vh",
        paddingBottom: "32px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: C.primary,
          padding: "1rem 1.2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "#A8D8C8",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            ← Retour
          </button>
          <h1
            style={{
              color: C.onPrimary,
              fontSize: "18px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Créer un Repas
          </h1>
        </div>
        <button
          type="button"
          onClick={handleLocalLogout}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: C.onPrimary,
            padding: "6px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          Déconnexion
        </button>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem 1rem" }}>
        <p
          style={{
            color: C.onSurfaceVariant,
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          Espace Médecin — Ajoutez un nouveau repas au catalogue NutriBébéCam
        </p>

        {success && (
          <div
            style={{
              backgroundColor: "#eafaf1",
              color: "#1a5c2e",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            Repas créé avec succès ! Redirection...
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: C.errorContainer,
              color: C.onErrorContainer,
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={card}>
            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Nom du repas *</label>
              <input
                type="text"
                name="nom"
                value={repas.nom}
                onChange={handleChange}
                placeholder="Ex: Purée de patate douce"
                required
                style={input}
              />
            </div>

            <div
              style={{
                ...card,
                border: `1px solid ${C.outlineVariant}60`,
                padding: "14px",
                margin: "14px 0",
              }}
            >
              <label style={label}>Heure(s) recommandée(s) de consommation *</label>
              <p
                style={{
                  fontSize: "12px",
                  color: C.onSurfaceVariant,
                  marginTop: "-4px",
                  marginBottom: "12px",
                }}
              >
                Ajoutez les différents moments de la journée où ce repas peut être consommé.
              </p>

              {repas.heures.map((heure, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "8px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="time"
                    value={heure}
                    onChange={(e) => updateHeure(index, e.target.value)}
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
                        cursor: "pointer",
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
                  fontWeight: 600,
                }}
              >
                + Associer un autre horaire
              </button>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Âge minimum (mois)</label>
              <input
                type="number"
                name="age_minimum_mois"
                value={repas.age_minimum_mois}
                onChange={handleChange}
                min="4"
                max="24"
                style={input}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Coût estimé (FCFA)</label>
              <input
                type="number"
                name="cout_estime_fcfa"
                value={repas.cout_estime_fcfa}
                onChange={handleChange}
                min="0"
                style={input}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Description</label>
              <textarea
                name="description"
                value={repas.description}
                onChange={handleChange}
                placeholder="Description des bienfaits..."
                rows={3}
                style={{ ...input, height: "auto", padding: "12px 14px", resize: "vertical" }}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Recette</label>
              <textarea
                name="recette"
                value={repas.recette}
                onChange={handleChange}
                placeholder="Instructions de préparation..."
                rows={4}
                style={{ ...input, height: "auto", padding: "12px 14px", resize: "vertical" }}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={label}>Image du repas (optionnel)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{ ...input, padding: "8px 14px" }}
              />
            </div>
          </div>

          <div style={card}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: C.primary,
                marginBottom: "16px",
              }}
            >
              Ingrédients du repas
            </h2>

            {loadingAliments ? (
              <p style={{ textAlign: "center", color: C.onSurfaceVariant }}>
                Chargement des suggestions...
              </p>
            ) : (
              compositions.map((comp, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: C.surfaceContainerLow,
                    borderRadius: "12px",
                    padding: "14px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ marginBottom: "10px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: C.onSurfaceVariant,
                        marginBottom: "4px",
                      }}
                    >
                      Nom de l'aliment / ingrédient *
                    </label>
                    <input
                      type="text"
                      list="liste-aliments-suggestions"
                      value={comp.nomAliment || ""}
                      onChange={(e) => updateRow(i, "nomAliment", e.target.value)}
                      placeholder="Ex: Patate douce, Poulet, Malaxé..."
                      style={input}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: C.onSurfaceVariant,
                          marginBottom: "4px",
                        }}
                      >
                        Quantité
                      </label>
                      <input
                        type="number"
                        value={comp.quantite}
                        onChange={(e) => updateRow(i, "quantite", e.target.value)}
                        style={input}
                        min="1"
                        required
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: C.onSurfaceVariant,
                          marginBottom: "4px",
                        }}
                      >
                        Unité
                      </label>
                      <select
                        value={comp.unite}
                        onChange={(e) => updateRow(i, "unite", e.target.value)}
                        style={input}
                      >
                        <option value="g">grammes (g)</option>
                        <option value="ml">millilitres (ml)</option>
                        <option value="cuillère à soupe">cuillère(s) à soupe</option>
                        <option value="unité">unité(s)</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      style={{
                        backgroundColor: C.errorContainer,
                        color: C.onErrorContainer,
                        border: "none",
                        borderRadius: "8px",
                        height: "48px",
                        padding: "0 16px",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))
            )}

            <datalist id="liste-aliments-suggestions">
              {aliments.map((a) => (
                <option key={a.id} value={a.nom} />
              ))}
            </datalist>

            <button
              type="button"
              onClick={addRow}
              style={{
                marginTop: "10px",
                backgroundColor: C.primary,
                color: C.onPrimary,
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              + Ajouter un ingrédient
            </button>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                flex: 1,
                height: "52px",
                backgroundColor: C.surfaceContainer,
                color: C.onSurface,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                height: "52px",
                backgroundColor: C.primary,
                color: C.onPrimary,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {submitting ? "Enregistrement..." : "Enregistrer le Repas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}