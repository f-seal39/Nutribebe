// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { api, getAliments, creerAliment } from "../services/api";
// import { useAuth } from "../context/AuthContext";

// const COLORS = {
//   primary: "#0f5238",
//   onPrimary: "#ffffff",
//   surface: "#f8f9fa",
//   surfaceContainerLowest: "#ffffff",
//   surfaceContainerLow: "#f3f4f5",
//   outlineVariant: "#bfc9c1",
//   errorContainer: "#ffdad6",
//   onErrorContainer: "#93000a",
//   onSurfaceVariant: "#404943",
// };

// export default function EditRepas() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { logout } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [aliments, setAliments] = useState([]);

//   // État du repas
//   const [repas, setRepas] = useState({
//     nom: "",
//     heures: [],
//     age_minimum_mois: 6,
//     cout_estime_fcfa: 0,
//     description: "",
//     recette: "",
//   });
//   const [compositions, setCompositions] = useState([]);
//   const [imageFile, setImageFile] = useState(null);
//   const [existingImage, setExistingImage] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Charger les aliments pour les suggestions
//         const alimData = await getAliments();
//         setAliments(Array.isArray(alimData) ? alimData : []);
//         // Charger le repas à éditer
//         const repasData = await api.get(`nutrition/repas/${id}/`);
//         const data = repasData.data;
//         setRepas({
//           nom: data.nom,
//           heures: data.horaires?.map(h => h.heure) || [],
//           age_minimum_mois: data.age_minimum_mois,
//           cout_estime_fcfa: data.cout_estime_fcfa,
//           description: data.description || "",
//           recette: data.recette || "",
//         });
//         setExistingImage(data.image);
//         // Transformer les compositions en format du formulaire
//         const comps = data.compositions?.map(c => ({
//           nomAliment: c.nom_aliment,
//           quantite: c.quantite,
//           unite: c.unite,
//           alimentId: c.aliment
//         })) || [];
//         setCompositions(comps);
//       } catch (err) {
//         setError("Impossible de charger le repas.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setRepas(prev => ({
//       ...prev,
//       [name]: ["age_minimum_mois", "cout_estime_fcfa"].includes(name) ? (parseInt(value, 10) || 0) : value,
//     }));
//   };

//   const addHeure = () => setRepas(prev => ({ ...prev, heures: [...prev.heures, "12:00"] }));
//   const removeHeure = (idx) => setRepas(prev => ({ ...prev, heures: prev.heures.filter((_, i) => i !== idx) }));
//   const updateHeure = (idx, val) => setRepas(prev => ({ ...prev, heures: prev.heures.map((h, i) => i === idx ? val : h) }));

//   const addRow = () => setCompositions(prev => [...prev, { nomAliment: "", quantite: 100, unite: "g", alimentId: null }]);
//   const removeRow = (idx) => setCompositions(prev => prev.filter((_, i) => i !== idx));
//   const updateRow = (idx, field, value) => {
//     setCompositions(prev => prev.map((c, i) => i === idx ? { ...c, [field]: field === "quantite" ? parseFloat(value) || 0 : value } : c));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");
//     try {
//       // 1. Créer ou récupérer les aliments (pour les nouveaux noms)
//       const ingredientsAvecId = [];
//       for (const comp of compositions) {
//         if (!comp.nomAliment?.trim() || comp.quantite <= 0) continue;
//         const nomNettoye = comp.nomAliment.trim();
//         let alimentId = comp.alimentId;
//         if (!alimentId) {
//           const existing = aliments.find(a => a.nom.toLowerCase() === nomNettoye.toLowerCase());
//           if (existing) {
//             alimentId = existing.id;
//           } else {
//             const nouvel = await creerAliment({
//               nom: nomNettoye,
//               age_minimum_mois: repas.age_minimum_mois,
//               prix_unitaire_fcfa: 0,
//               description: "",
//             });
//             alimentId = nouvel.id;
//             setAliments(prev => [...prev, nouvel]);
//           }
//         }
//         ingredientsAvecId.push({
//           aliment: alimentId,
//           quantite: comp.quantite,
//           unite: comp.unite,
//         });
//       }

//       // 2. Construire le payload
//       const formData = new FormData();
//       formData.append("nom", repas.nom);
//       formData.append("age_minimum_mois", repas.age_minimum_mois);
//       formData.append("cout_estime_fcfa", repas.cout_estime_fcfa);
//       formData.append("description", repas.description);
//       formData.append("recette", repas.recette);
//       if (imageFile) formData.append("image", imageFile);
//       formData.append("horaires_data", JSON.stringify(repas.heures.filter(h => h).map(h => ({ heure: h }))));
//       formData.append("compositions_data", JSON.stringify(ingredientsAvecId));

//       // 3. Requête PUT (mise à jour complète)
//       await api.put(`nutrition/repas/${id}/`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setSuccess(true);
//       setTimeout(() => {
//         navigate("/medecin/dashboard");
//       }, 1500);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.detail || "Erreur lors de la mise à jour.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Styles (réutilisés du formulaire de création)
//   const input = {
//     width: "100%", height: "48px", padding: "0 14px", borderRadius: "10px",
//     border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow,
//     fontSize: "14px", outline: "none", boxSizing: "border-box",
//   };
//   const label = { display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.onSurfaceVariant, marginBottom: "6px" };
//   const card = { backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "16px", padding: "20px", marginBottom: "16px", border: `1px solid ${COLORS.outlineVariant}40`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" };

//   if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Chargement...</div>;

//   return (
//     <div style={{ backgroundColor: COLORS.surface, minHeight: "100vh", paddingBottom: "32px" }}>
//       <header style={{ backgroundColor: COLORS.primary, padding: "1rem", display: "flex", justifyContent: "space-between" }}>
//         <h1 style={{ color: COLORS.onPrimary }}>Modifier le repas</h1>
//         <button onClick={() => { logout(); navigate("/"); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: COLORS.onPrimary, padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}>Déconnexion</button>
//       </header>
//       <main style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem" }}>
//         {success && <div style={{ backgroundColor: "#eafaf1", color: "#1a5c2e", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>Repas modifié avec succès ! Redirection...</div>}
//         {error && <div style={{ backgroundColor: COLORS.errorContainer, color: COLORS.onErrorContainer, padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div style={card}>
//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Nom du repas *</label>
//               <input type="text" name="nom" value={repas.nom} onChange={handleChange} required style={input} />
//             </div>
//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Heure(s) *</label>
//               {repas.heures.map((h, idx) => (
//                 <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
//                   <input type="time" value={h} onChange={e => updateHeure(idx, e.target.value)} style={{ ...input, flex: 1 }} required />
//                   {repas.heures.length > 1 && <button type="button" onClick={() => removeHeure(idx)} style={{ backgroundColor: COLORS.errorContainer, border: "none", borderRadius: "8px", padding: "0 12px", cursor: "pointer" }}>X</button>}
//                 </div>
//               ))}
//               <button type="button" onClick={addHeure} style={{ marginTop: "8px", backgroundColor: COLORS.surfaceContainer, border: `1px solid ${COLORS.primary}40`, borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}>+ Ajouter un horaire</button>
//             </div>
//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Âge minimum (mois)</label>
//               <input type="number" name="age_minimum_mois" value={repas.age_minimum_mois} onChange={handleChange} style={input} />
//             </div>
//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Coût (FCFA)</label>
//               <input type="number" name="cout_estime_fcfa" value={repas.cout_estime_fcfa} onChange={handleChange} style={input} />
//             </div>
//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Description</label>
//               <textarea name="description" value={repas.description} onChange={handleChange} rows={3} style={{ ...input, height: "auto", resize: "vertical" }} />
//             </div>
//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Recette</label>
//               <textarea name="recette" value={repas.recette} onChange={handleChange} rows={4} style={{ ...input, height: "auto", resize: "vertical" }} />
//             </div>
//             <div style={{ marginBottom: "14px" }}>
//               <label style={label}>Image actuelle</label>
//               {existingImage && <img src={existingImage} alt="actuel" style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />}
//               <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ ...input, padding: "8px" }} />
//             </div>
//           </div>
//           <div style={card}>
//             <h3>Ingrédients</h3>
//             {compositions.map((comp, idx) => (
//               <div key={idx} style={{ backgroundColor: COLORS.surfaceContainerLow, borderRadius: "12px", padding: "12px", marginBottom: "10px" }}>
//                 <input type="text" placeholder="Nom de l'aliment" value={comp.nomAliment} onChange={e => updateRow(idx, "nomAliment", e.target.value)} style={input} required />
//                 <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
//                   <input type="number" placeholder="Quantité" value={comp.quantite} onChange={e => updateRow(idx, "quantite", e.target.value)} style={{ ...input, flex: 1 }} required />
//                   <select value={comp.unite} onChange={e => updateRow(idx, "unite", e.target.value)} style={{ ...input, flex: 1 }}>
//                     <option value="g">g</option><option value="ml">ml</option><option value="cuillère à soupe">cuillère</option><option value="unité">unité</option>
//                   </select>
//                   <button type="button" onClick={() => removeRow(idx)} style={{ backgroundColor: COLORS.errorContainer, border: "none", borderRadius: "8px", padding: "0 12px", cursor: "pointer" }}>X</button>
//                 </div>
//               </div>
//             ))}
//             <button type="button" onClick={addRow} style={{ backgroundColor: COLORS.primary, color: COLORS.onPrimary, border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" }}>+ Ajouter un ingrédient</button>
//           </div>
//           <div style={{ display: "flex", gap: "12px" }}>
//             <button type="button" onClick={() => navigate("/medecin/dashboard")} style={{ flex: 1, height: "52px", backgroundColor: COLORS.surfaceContainer, border: "none", borderRadius: "12px", cursor: "pointer" }}>Annuler</button>
//             <button type="submit" disabled={submitting} style={{ flex: 2, height: "52px", backgroundColor: COLORS.primary, color: COLORS.onPrimary, border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 700 }}>{submitting ? "Enregistrement..." : "Enregistrer les modifications"}</button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getAliments, creerAliment } from "../services/api";
import { useAuth } from "../context/AuthContext";

const COLORS = {
  primary: "#0f5238",
  onPrimary: "#ffffff",
  surface: "#f8f9fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f3f4f5",
  outlineVariant: "#bfc9c1",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  onSurfaceVariant: "#404943",
};

export default function EditRepas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [aliments, setAliments] = useState([]);

  // État initial par défaut (évite undefined)
  const [repas, setRepas] = useState({
    nom: "",
    heures: ["12:00"],
    age_minimum_mois: 6,
    cout_estime_fcfa: 0,
    description: "",
    recette: "",
  });
  const [compositions, setCompositions] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alimData = await getAliments();
        setAliments(Array.isArray(alimData) ? alimData : []);
        const response = await api.get(`nutrition/repas/${id}/`);
        const data = response.data;
        setRepas({
          nom: data.nom || "",
          heures: data.horaires?.map(h => h.heure) || ["12:00"],
          age_minimum_mois: data.age_minimum_mois || 6,
          cout_estime_fcfa: data.cout_estime_fcfa || 0,
          description: data.description || "",
          recette: data.recette || "",
        });
        setExistingImage(data.image || null);
        const comps = data.compositions?.map(c => ({
          nomAliment: c.nom_aliment,
          quantite: c.quantite,
          unite: c.unite,
          alimentId: c.aliment
        })) || [];
        setCompositions(comps);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le repas.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
    else setError("ID du repas manquant.");
  }, [id]);

  // Gestionnaires
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRepas(prev => ({
      ...prev,
      [name]: ["age_minimum_mois", "cout_estime_fcfa"].includes(name) ? (parseInt(value, 10) || 0) : value,
    }));
  };

  const addHeure = () => setRepas(prev => ({ ...prev, heures: [...prev.heures, "12:00"] }));
  const removeHeure = (idx) => setRepas(prev => ({ ...prev, heures: prev.heures.filter((_, i) => i !== idx) }));
  const updateHeure = (idx, val) => setRepas(prev => ({ ...prev, heures: prev.heures.map((h, i) => i === idx ? val : h) }));

  const addRow = () => setCompositions(prev => [...prev, { nomAliment: "", quantite: 100, unite: "g", alimentId: null }]);
  const removeRow = (idx) => setCompositions(prev => prev.filter((_, i) => i !== idx));
  const updateRow = (idx, field, value) => {
    setCompositions(prev => prev.map((c, i) => i === idx ? { ...c, [field]: field === "quantite" ? parseFloat(value) || 0 : value } : c));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // Préparer les ingrédients avec IDs
      const ingredientsAvecId = [];
      for (const comp of compositions) {
        if (!comp.nomAliment?.trim() || comp.quantite <= 0) continue;
        const nomNettoye = comp.nomAliment.trim();
        let alimentId = comp.alimentId;
        if (!alimentId) {
          const existing = aliments.find(a => a.nom.toLowerCase() === nomNettoye.toLowerCase());
          if (existing) alimentId = existing.id;
          else {
            const nouvel = await creerAliment({
              nom: nomNettoye,
              age_minimum_mois: repas.age_minimum_mois,
              prix_unitaire_fcfa: 0,
              description: "",
            });
            alimentId = nouvel.id;
            setAliments(prev => [...prev, nouvel]);
          }
        }
        ingredientsAvecId.push({
          aliment: alimentId,
          quantite: comp.quantite,
          unite: comp.unite,
        });
      }

      const formData = new FormData();
      formData.append("nom", repas.nom);
      formData.append("age_minimum_mois", repas.age_minimum_mois);
      formData.append("cout_estime_fcfa", repas.cout_estime_fcfa);
      formData.append("description", repas.description);
      formData.append("recette", repas.recette);
      if (imageFile) formData.append("image", imageFile);
      formData.append("horaires_data", JSON.stringify(repas.heures.filter(h => h).map(h => ({ heure: h }))));
      formData.append("compositions_data", JSON.stringify(ingredientsAvecId));

      await api.put(`nutrition/repas/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setTimeout(() => navigate("/medecin/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de la mise à jour.");
    } finally {
      setSubmitting(false);
    }
  };

  const input = {
    width: "100%", height: "48px", padding: "0 14px", borderRadius: "10px",
    border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow,
    fontSize: "14px", outline: "none", boxSizing: "border-box",
  };
  const label = { display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.onSurfaceVariant, marginBottom: "6px" };
  const card = { backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "16px", padding: "20px", marginBottom: "16px", border: `1px solid ${COLORS.outlineVariant}40`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Chargement...</div>;

  return (
    <div style={{ backgroundColor: COLORS.surface, minHeight: "100vh", paddingBottom: "32px" }}>
      <header style={{ backgroundColor: COLORS.primary, padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: COLORS.onPrimary, fontSize: "1.25rem", margin: 0 }}>Modifier le repas</h1>
        <button onClick={() => { logout(); navigate("/"); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: COLORS.onPrimary, padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}>Déconnexion</button>
      </header>
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem" }}>
        {success && <div style={{ backgroundColor: "#eafaf1", color: "#1a5c2e", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>Repas modifié avec succès ! Redirection...</div>}
        {error && <div style={{ backgroundColor: COLORS.errorContainer, color: COLORS.onErrorContainer, padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={card}>
            <div><label style={label}>Nom du repas *</label><input type="text" name="nom" value={repas.nom} onChange={handleChange} required style={input} /></div>
            <div style={{ marginTop: "14px" }}>
              <label style={label}>Heure(s) *</label>
              {repas.heures.map((h, idx) => (
                <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input type="time" value={h} onChange={e => updateHeure(idx, e.target.value)} style={{ ...input, flex: 1 }} required />
                  {repas.heures.length > 1 && <button type="button" onClick={() => removeHeure(idx)} style={{ backgroundColor: COLORS.errorContainer, border: "none", borderRadius: "8px", padding: "0 12px", cursor: "pointer" }}>X</button>}
                </div>
              ))}
              <button type="button" onClick={addHeure} style={{ marginTop: "8px", backgroundColor: COLORS.surfaceContainer, border: `1px solid ${COLORS.primary}40`, borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}>+ Ajouter un horaire</button>
            </div>
            <div style={{ marginTop: "14px" }}><label style={label}>Âge minimum (mois)</label><input type="number" name="age_minimum_mois" value={repas.age_minimum_mois} onChange={handleChange} style={input} /></div>
            <div style={{ marginTop: "14px" }}><label style={label}>Coût (FCFA)</label><input type="number" name="cout_estime_fcfa" value={repas.cout_estime_fcfa} onChange={handleChange} style={input} /></div>
            <div style={{ marginTop: "14px" }}><label style={label}>Description</label><textarea name="description" value={repas.description} onChange={handleChange} rows={3} style={{ ...input, height: "auto", resize: "vertical" }} /></div>
            <div style={{ marginTop: "14px" }}><label style={label}>Recette</label><textarea name="recette" value={repas.recette} onChange={handleChange} rows={4} style={{ ...input, height: "auto", resize: "vertical" }} /></div>
            <div style={{ marginTop: "14px" }}>
              <label style={label}>Image actuelle</label>
              {existingImage && <img src={existingImage} alt="actuel" style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />}
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ ...input, padding: "8px" }} />
            </div>
          </div>
          <div style={card}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: COLORS.primary }}>Ingrédients</h3>
            {compositions.map((comp, idx) => (
              <div key={idx} style={{ backgroundColor: COLORS.surfaceContainerLow, borderRadius: "12px", padding: "12px", marginBottom: "10px" }}>
                <input type="text" placeholder="Nom de l'aliment" value={comp.nomAliment || ""} onChange={e => updateRow(idx, "nomAliment", e.target.value)} style={input} required />
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <input type="number" placeholder="Quantité" value={comp.quantite || 0} onChange={e => updateRow(idx, "quantite", e.target.value)} style={{ ...input, flex: 1 }} required />
                  <select value={comp.unite || "g"} onChange={e => updateRow(idx, "unite", e.target.value)} style={{ ...input, flex: 1 }}>
                    <option value="g">g</option><option value="ml">ml</option><option value="cuillère à soupe">cuillère</option><option value="unité">unité</option>
                  </select>
                  <button type="button" onClick={() => removeRow(idx)} style={{ backgroundColor: COLORS.errorContainer, border: "none", borderRadius: "8px", padding: "0 12px", cursor: "pointer" }}>X</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addRow} style={{ backgroundColor: COLORS.primary, color: COLORS.onPrimary, border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" }}>+ Ajouter un ingrédient</button>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button type="button" onClick={() => navigate("/medecin/dashboard")} style={{ flex: 1, height: "52px", backgroundColor: COLORS.surfaceContainer, border: "none", borderRadius: "12px", cursor: "pointer" }}>Annuler</button>
            <button type="submit" disabled={submitting} style={{ flex: 2, height: "52px", backgroundColor: COLORS.primary, color: COLORS.onPrimary, border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 700 }}>{submitting ? "Enregistrement..." : "Enregistrer les modifications"}</button>
          </div>
        </form>
      </main>
    </div>
  );
}