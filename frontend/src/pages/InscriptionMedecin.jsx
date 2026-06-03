

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { inscription } from "../services/api";

// const COLORS = {
//   primary: "#0f5238",
//   onPrimary: "#ffffff",
//   primaryContainer: "#2d6a4f",
//   onPrimaryContainer: "#a8e7c5",
//   primaryFixed: "#b1f0ce",
//   primaryFixedDim: "#95d4b3",
//   secondary: "#8e4e14",
//   secondaryContainer: "#ffab69",
//   onSecondaryContainer: "#783d01",
//   secondaryFixed: "#ffdcc4",
//   tertiary: "#004b77",
//   tertiaryFixed: "#cee5ff",
//   surface: "#f8f9fa",
//   surfaceContainerLowest: "#ffffff",
//   surfaceContainerLow: "#f3f4f5",
//   surfaceContainer: "#edeeef",
//   surfaceContainerHigh: "#e7e8e9",
//   surfaceVariant: "#e1e3e4",
//   onSurface: "#191c1d",
//   onSurfaceVariant: "#404943",
//   outline: "#707973",
//   outlineVariant: "#bfc9c1",
//   background: "#f8f9fa",
//   onBackground: "#191c1d",
//   errorContainer: "#ffdad6",
//   onErrorContainer: "#93000a",
// };

// const specialites = [
//   { icone: "medical_services", label: "Médecin" },
//   { icone: "nutrition", label: "Nutritionniste" },
//   { icone: "child_care", label: "Pédiatre" },
//   { icone: "more_horiz", label: "Autre" },
// ];

// const etapesNav = [
//   { id: "personal", icone: "person_edit", label: "Personal" },
//   { id: "specialty", icone: "medical_services", label: "Specialty" },
//   { id: "verify", icone: "verified_user", label: "Verify" },
// ];

// export default function InscriptionMedecin() {
//   const navigate = useNavigate();
//   const [etape, setEtape] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [specialiteChoisie, setSpecialiteChoisie] = useState("");
//   const [fichierDiplome, setFichierDiplome] = useState(null); // Stocke le fichier
//   const [isDragging, setIsDragging] = useState(false); // Effet visuel drag & drop
//   const [form, setForm] = useState({
//     first_name: "", last_name: "", email: "", telephone: "",
//     password: "", numero_ordre: "", hopital_cabinet: "", ville: "",
//     disponibilite: true,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
//   };

//   // Gestion de la sélection du fichier via explorateur
//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setFichierDiplome(e.target.files[0]);
//     }
//   };

//   // Gestion du Drag & Drop
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setFichierDiplome(e.dataTransfer.files[0]);
//     }
//   };

//   const handleSuivant = () => {
//     if (etape === 0 && (!form.first_name || !form.last_name || !form.telephone || !form.password || !form.numero_ordre || !form.ville)) {
//       setError("Veuillez remplir tous les champs obligatoires (*)."); return;
//     }
//     if (etape === 1 && !specialiteChoisie) {
//       setError("Veuillez choisir une spécialité."); return;
//     }
//     setError(""); setEtape(etape + 1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // if (!fichierDiplome) {
//     //   setError("Veuillez téléverser un justificatif (diplôme ou certification) pour vérification.");
//     //   return;
//     // }

//     setLoading(true); setError("");

//     try {
//       // Utilisation obligatoire de FormData pour envoyer un fichier joint
//       const formData = new FormData();
//       formData.append("username", form.telephone);
//       formData.append("first_name", form.first_name);
//       formData.append("last_name", form.last_name);
//       formData.append("email", form.email);
//       formData.append("telephone", form.telephone);
//       formData.append("password", form.password);
//       formData.append("role", "medecin");
//       formData.append("numero_ordre", form.numero_ordre);
//       formData.append("specialite", specialiteChoisie);
//       formData.append("hopital_cabinet", form.hopital_cabinet);
//       formData.append("ville", form.ville);
//       formData.append("disponibilite", form.disponibilite);
      
//       // Envoi du fichier brut
//       if (fichierDiplome) {
//         formData.append("diplome", fichierDiplome);
//       }

//       const res = await inscription(formData);
      
//       if (res.token) {
//         navigate("/dashboard");
//       } else {
//         setError("Erreur lors de la création du compte.");
//       }
//     } catch (erreursBackend) { 
//       console.log("Erreurs reçues dans le composant :", erreursBackend);
//       // Si le backend renvoie un message d'erreur précis sous forme de chaîne ou d'objet
//       if (typeof erreursBackend === "string") {
//         setError(erreursBackend);
//       } else if (typeof erreursBackend === "object" && erreursBackend !== null) {
//         // Affiche la première erreur trouvée dans le JSON retourné par Django
//         const premiereCle = Object.keys(erreursBackend)[0];
//         const premierMessage = erreursBackend[premiereCle];
//         setError(`${premiereCle} : ${Array.isArray(premierMessage) ? premierMessage[0] : premierMessage}`);
//       } else {
//         setError("Erreur lors de la communication avec le serveur."); 
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{ backgroundColor: COLORS.background, color: COLORS.onBackground, minHeight: "100vh", paddingBottom: "80px", fontFamily: "'Atkinson Hyperlegible Next', sans-serif" }}>

//       {/* Header */}
//       <header style={{
//         position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center",
//         padding: "0 1rem", height: "64px",
//         backgroundColor: "rgba(248,249,250,0.85)", backdropFilter: "blur(8px)",
//         borderBottom: `1px solid ${COLORS.outlineVariant}`,
//       }}>
//         <button
//           onClick={() => etape === 0 ? navigate("/") : setEtape(etape - 1)}
//           style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.primary, padding: "8px", display: "flex", alignItems: "center" }}
//         >
//           <span className="material-symbols-outlined">arrow_back</span>
//         </button>
//         <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: COLORS.primary, marginLeft: "8px" }}>
//           Inscription Médecin
//         </h1>
//       </header>

//       <main style={{ maxWidth: "560px", margin: "0 auto", padding: "0 1rem" }}>

//         {/* Hero */}
//         <section style={{ textAlign: "center", marginTop: "24px", marginBottom: "32px" }}>
//           <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", fontWeight: 700, color: COLORS.onBackground, marginBottom: "8px", letterSpacing: "-0.02em" }}>
//             Rejoignez l'équipe
//           </h2>
//           <p style={{ fontSize: "16px", color: COLORS.onSurfaceVariant, lineHeight: "24px" }}>
//             Prêtez votre expertise pour accompagner les parents dans leur parcours de santé.
//           </p>
//         </section>

//         {/* Erreur */}
//         {error && (
//           <div style={{ backgroundColor: COLORS.errorContainer, color: COLORS.onErrorContainer, padding: "12px 16px", borderRadius: "12px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
//             <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>error</span>
//             {error}
//           </div>
//         )}

//         {/* ÉTAPE 0 — Informations personnelles */}
//         {etape === 0 && (
//           <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.outlineVariant}40`, marginBottom: "24px" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
//               <span className="material-symbols-outlined" style={{ color: COLORS.secondary, fontVariationSettings: "'FILL' 1" }}>person</span>
//               <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: COLORS.onSurface }}>
//                 Informations Personnelles
//               </h3>
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               {[
//                 { label: "Prénom *", name: "first_name", placeholder: "Ex: Paul", type: "text" },
//                 { label: "Nom *", name: "last_name", placeholder: "Ex: Nkomo", type: "text" },
//                 { label: "Téléphone *", name: "telephone", placeholder: "6XX XXX XXX", type: "tel" },
//                 { label: "Email professionnel", name: "email", placeholder: "paul.nkomo@sante.cm", type: "email" },
//                 { label: "Numéro d'ordre *", name: "numero_ordre", placeholder: "CM-PED-XXXX", type: "text" },
//                 { label: "Hôpital / Cabinet", name: "hopital_cabinet", placeholder: "Ex: Hôpital Général de Douala", type: "text" },
//                 { label: "Ville *", name: "ville", placeholder: "Ex: Douala", type: "text" },
//                 { label: "Mot de passe *", name: "password", placeholder: "Mot de passe sécurisé", type: "password" },
//               ].map(champ => (
//                 <div key={champ.name}>
//                   <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLORS.onSurfaceVariant, marginBottom: "4px", marginLeft: "4px", letterSpacing: "0.01em" }}>
//                     {champ.label}
//                   </label>
//                   <input
//                     type={champ.type} name={champ.name}
//                     value={form[champ.name]} onChange={handleChange}
//                     placeholder={champ.placeholder}
//                     style={{
//                       width: "100%", height: "48px", padding: "0 16px",
//                       borderRadius: "8px", border: "none",
//                       borderBottom: `2px solid ${COLORS.outlineVariant}`,
//                       backgroundColor: COLORS.surfaceContainerLow,
//                       fontSize: "16px", outline: "none", boxSizing: "border-box",
//                       transition: "border-color 0.2s",
//                     }}
//                     onFocus={e => e.target.style.borderBottomColor = COLORS.primary}
//                     onBlur={e => e.target.style.borderBottomColor = COLORS.outlineVariant}
//                   />
//                 </div>
//               ))}
//               <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
//                 <input type="checkbox" name="disponibilite" checked={form.disponibilite} onChange={handleChange}
//                   style={{ width: "16px", height: "16px", accentColor: COLORS.primary }} />
//                 <label style={{ fontSize: "14px", color: COLORS.onSurfaceVariant }}>Disponible pour les consultations</label>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ÉTAPE 1 — Spécialité */}
//         {etape === 1 && (
//           <div style={{ marginBottom: "24px" }}>
//             <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: COLORS.onSurface, textAlign: "center", marginBottom: "20px" }}>
//               Choisissez votre spécialité
//             </h3>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
//               {specialites.map(spec => (
//                 <button key={spec.label} onClick={() => setSpecialiteChoisie(spec.label)}
//                   style={{
//                     display: "flex", flexDirection: "column", alignItems: "center",
//                     justifyContent: "center", padding: "24px 16px", borderRadius: "12px",
//                     border: `2px solid ${specialiteChoisie === spec.label ? COLORS.secondary : "transparent"}`,
//                     backgroundColor: specialiteChoisie === spec.label ? `${COLORS.secondaryFixed}50` : COLORS.surfaceContainerLowest,
//                     cursor: "pointer", transition: "all 0.2s",
//                     boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//                   }}>
//                   <span className="material-symbols-outlined" style={{ fontSize: "36px", color: COLORS.secondary, marginBottom: "8px" }}>
//                     {spec.icone}
//                   </span>
//                   <span style={{ fontSize: "14px", fontWeight: 600, color: COLORS.onSurface }}>{spec.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ÉTAPE 2 — Vérification */}
//         {etape === 2 && (
//           <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.outlineVariant}40`, marginBottom: "24px" }}>
            
//             {/* Zone Drag and Drop Dynamique */}
//             <div 
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}
//               onClick={() => document.getElementById("fileInput").click()}
//               style={{
//                 textAlign: "center", padding: "32px 16px",
//                 border: `2px dashed ${isDragging ? COLORS.primary : COLORS.outlineVariant}`, 
//                 borderRadius: "12px",
//                 backgroundColor: isDragging ? `${COLORS.primaryFixed}30` : COLORS.surfaceContainerLow, 
//                 cursor: "pointer",
//                 transition: "all 0.2s"
//               }}
//             >
//               {/* input HTML masqué, déclenché par le clic sur la boîte */}
//               <input 
//                 id="fileInput"
//                 type="file" 
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={handleFileChange}
//                 style={{ display: "none" }}
//               />

//               <div style={{
//                 width: "64px", height: "64px", backgroundColor: fichierDiplome ? COLORS.primaryFixedDim : COLORS.primaryFixed,
//                 borderRadius: "50%", display: "flex", alignItems: "center",
//                 justifyContent: "center", margin: "0 auto 16px",
//                 transition: "background-color 0.3s"
//               }}>
//                 <span className="material-symbols-outlined" style={{ fontSize: "32px", color: COLORS.primary }}>
//                   {fichierDiplome ? "task" : "cloud_upload"}
//                 </span>
//               </div>
              
//               <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: COLORS.onSurface, marginBottom: "8px" }}>
//                 {fichierDiplome ? "Document chargé avec succès !" : "Diplômes & Certifications"}
//               </h4>
              
//               <p style={{ fontSize: "14px", color: COLORS.onSurfaceVariant }}>
//                 {fichierDiplome ? (
//                   <span style={{ color: COLORS.primary, fontWeight: 700 }}>{fichierDiplome.name}</span>
//                 ) : (
//                   <>Glissez votre fichier ici ou <span style={{ color: COLORS.primary, fontWeight: 700 }}>parcourez</span></>
//                 )}
//               </p>
//               <p style={{ fontSize: "10px", color: COLORS.outline, marginTop: "16px" }}>PDF, JPG ou PNG (Max 10MB)</p>
//             </div>

//             <div style={{
//               marginTop: "20px", display: "flex", alignItems: "flex-start", gap: "12px",
//               padding: "16px", backgroundColor: `${COLORS.tertiaryFixed}50`, borderRadius: "10px",
//             }}>
//               <span className="material-symbols-outlined" style={{ color: COLORS.tertiary, fontSize: "20px", flexShrink: 0 }}>verified</span>
//               <p style={{ fontSize: "12px", color: COLORS.tertiary, lineHeight: "16px" }}>
//                 La vérification manuelle par notre équipe médicale prend généralement 24 à 48 heures ouvrées.
//               </p>
//             </div>

//             <div style={{ marginTop: "20px", padding: "16px", backgroundColor: COLORS.surfaceContainer, borderRadius: "10px" }}>
//               <h4 style={{ fontSize: "14px", fontWeight: 700, color: COLORS.onSurface, marginBottom: "10px" }}>Récapitulatif</h4>
//               {[
//                 ["Nom", `${form.first_name} ${form.last_name}`],
//                 ["Téléphone", form.telephone],
//                 ["Spécialité", specialiteChoisie],
//                 ["Ville", form.ville],
//                 ["Justificatif", fichierDiplome ? fichierDiplome.name : "Manquant ❌"],
//               ].map(([label, val]) => (
//                 <p key={label} style={{ fontSize: "13px", color: COLORS.onSurfaceVariant, marginBottom: "4px" }}>
//                   <b>{label} :</b> {val}
//                 </p>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Bouton principal */}
//         <div style={{ marginTop: "8px", marginBottom: "16px" }}>
//           <button
//             onClick={etape < 2 ? handleSuivant : handleSubmit}
//             disabled={loading}
//             style={{
//               width: "100%", height: "56px", backgroundColor: COLORS.primary,
//               color: COLORS.onPrimary, borderRadius: "9999px", border: "none",
//               fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 600,
//               display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//               cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
//               boxShadow: "0 4px 12px rgba(15,82,56,0.3)", transition: "all 0.2s",
//             }}
//           >
//             <span>{etape < 2 ? "Continuer" : (loading ? "Validation..." : "S'inscrire maintenant")}</span>
//             <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
//               {etape < 2 ? "arrow_forward" : "check_circle"}
//             </span>
//           </button>
//         </div>

//       </main>

//       {/* Fond décoratif */}
//       <div style={{ position: "fixed", top: 0, right: 0, zIndex: -1, opacity: 0.4, filter: "blur(64px)", pointerEvents: "none" }}>
//         <div style={{ width: "384px", height: "384px", backgroundColor: COLORS.primaryFixedDim, borderRadius: "50%" }} />
//       </div>
//       <div style={{ position: "fixed", bottom: "80px", left: 0, zIndex: -1, opacity: 0.3, filter: "blur(64px)", pointerEvents: "none" }}>
//         <div style={{ width: "320px", height: "320px", backgroundColor: COLORS.secondaryFixed, borderRadius: "50%" }} />
//       </div>

//       {/* Navbar étapes */}
//       <nav style={{
//         position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 50,
//         display: "flex", justifyContent: "space-around", alignItems: "center",
//         padding: "12px 16px", backgroundColor: COLORS.surface,
//         boxShadow: "0 -1px 4px rgba(0,0,0,0.06)", borderTop: `1px solid ${COLORS.outlineVariant}30`,
//       }}>
//         {etapesNav.map((nav, i) => (
//           <div key={nav.id} style={{
//             display: "flex", flexDirection: "column", alignItems: "center",
//             justifyContent: "center", padding: etape === i ? "4px 16px" : "8px",
//             borderRadius: etape === i ? "9999px" : "8px",
//             backgroundColor: etape === i ? COLORS.primaryContainer : "transparent",
//             color: etape === i ? COLORS.onPrimaryContainer : COLORS.onSurfaceVariant,
//             transition: "all 0.3s",
//           }}>
//             <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>{nav.icone}</span>
//             <span style={{ fontSize: "12px", fontWeight: 500, marginTop: "2px" }}>{nav.label}</span>
//           </div>
//         ))}
//       </nav>

//     </div>
//   );
// }


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { inscription } from "../services/api";

// const COLORS = {
//   primary: "#0f5238",
//   onPrimary: "#ffffff",
//   primaryContainer: "#2d6a4f",
//   onPrimaryContainer: "#a8e7c5",
//   primaryFixed: "#b1f0ce",
//   primaryFixedDim: "#95d4b3",
//   secondary: "#8e4e14",
//   secondaryContainer: "#ffab69",
//   onSecondaryContainer: "#783d01",
//   secondaryFixed: "#ffdcc4",
//   tertiary: "#004b77",
//   tertiaryFixed: "#cee5ff",
//   surface: "#f8f9fa",
//   surfaceContainerLowest: "#ffffff",
//   surfaceContainerLow: "#f3f4f5",
//   surfaceContainer: "#edeeef",
//   surfaceContainerHigh: "#e7e8e9",
//   surfaceVariant: "#e1e3e4",
//   onSurface: "#191c1d",
//   onSurfaceVariant: "#404943",
//   outline: "#707973",
//   outlineVariant: "#bfc9c1",
//   background: "#f8f9fa",
//   onBackground: "#191c1d",
//   errorContainer: "#ffdad6",
//   onErrorContainer: "#93000a",
// };

// const specialites = [
//   { icone: "medical_services", label: "Médecin" },
//   { icone: "nutrition", label: "Nutritionniste" },
//   { icone: "child_care", label: "Pédiatre" },
//   { icone: "more_horiz", label: "Autre" },
// ];

// const etapesNav = [
//   { id: "personal", icone: "person_edit", label: "Personal" },
//   { id: "specialty", icone: "medical_services", label: "Specialty" },
//   { id: "verify", icone: "verified_user", label: "Verify" },
// ];

// const BASE_URL = "http://localhost:8000/api";

// export default function InscriptionMedecin() {

//   const navigate = useNavigate();
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   //const navigate = useNavigate();
//   const [etape, setEtape] = useState(0);
//   const [loading, setLoading] = useState(false);
//   //const [error, setError] = useState("");
//   const [specialiteChoisie, setSpecialiteChoisie] = useState("");
//   const [fichierDiplome, setFichierDiplome] = useState(null); // Stocke le fichier
//   const [isDragging, setIsDragging] = useState(false); // Effet visuel drag & drop
//   const [form, setForm] = useState({
//     first_name: "", last_name: "", email: "", telephone: "",
//     password: "", numero_ordre: "", hopital_cabinet: "", ville: "",
//     disponibilite: true,
//   });

//   const [diplomeFile, setDiplomeFile] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
//   };

//   // Gestion de la sélection du fichier via explorateur
//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       DiplomeFile(e.target.files[0]);
//     }
//   };

//   // Gestion du Drag & Drop
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setFichierDiplome(e.dataTransfer.files[0]);
//     }
//   };

//   const handleSuivant = () => {
//     if (etape === 0 && (!form.first_name || !form.last_name || !form.telephone || !form.password || !form.numero_ordre || !form.ville)) {
//       setError("Veuillez remplir tous les champs obligatoires (*)."); return;
//     }
//     if (etape === 1 && !specialiteChoisie) {
//       setError("Veuillez choisir une spécialité."); return;
//     }
//     setError(""); setEtape(etape + 1);
//   };

//   const handleSubmit = async (e) => {
//     //e.preventDefault();
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");
//     // if (!fichierDiplome) {
//     //   setError("Veuillez téléverser un justificatif (diplôme ou certification) pour vérification.");
//     //   return;
//     // }

//     //setLoading(true);

//     try {
//       // Utilisation obligatoire de FormData pour envoyer un fichier joint
//       const formData = new FormData();
//       formData.append("username", form.telephone);
//       formData.append("first_name", form.first_name);
//       formData.append("last_name", form.last_name);
//       formData.append("email", form.email);
//       formData.append("telephone", form.telephone);
//       formData.append("password", form.password);
//       formData.append("role", "medecin");
//       formData.append("numero_ordre", form.numero_ordre);
//       formData.append("specialite", specialiteChoisie);
//       formData.append("hopital_cabinet", form.hopital_cabinet);
//       formData.append("ville", form.ville);
//       formData.append("disponibilite", form.disponibilite);
      
//       // Envoi du fichier brut
//       if (diplomeFile) {
//         formData.append("diplome", diplomeFile);
//       }

//       const res = await inscription(formData);
      
//       if (res.token) {
//         localStorage.setItem("token", res.token);
//         localStorage.setItem("utilisateur", JSON.stringify(res.utilisateur));
//         navigate("/dashboard");
//       } else {
//         setError("Erreur lors de la création du compte.");
//       }
//     } catch (erreursBackend) { 
//       console.log("Erreurs reçues dans le composant :", erreursBackend);
//       if (typeof erreursBackend === "string") {
//         setError(erreursBackend);
//       } else if (typeof erreursBackend === "object" && erreursBackend !== null) {
//         const premiereCle = Object.keys(erreursBackend)[0];
//         const premierMessage = erreursBackend[premiereCle];
//         setError(`${premiereCle} : ${Array.isArray(premierMessage) ? premierMessage[0] : premierMessage}`);
//       } else {
//         setError("Erreur lors de la communication avec le serveur."); 
//       }
//     }
//     setSubmitting(false);
//   };

//   return (
//     <div style={{ backgroundColor: COLORS.background, color: COLORS.onBackground, minHeight: "100vh", paddingBottom: "80px", fontFamily: "'Atkinson Hyperlegible Next', sans-serif" }}>

//       {/* Header */}
//       <header style={{
//         position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center",
//         padding: "0 1rem", height: "64px",
//         backgroundColor: "rgba(248,249,250,0.85)", backdropFilter: "blur(8px)",
//         borderBottom: `1px solid ${COLORS.outlineVariant}`,
//       }}>
//         <button
//           onClick={() => etape === 0 ? navigate("/") : setEtape(etape - 1)}
//           style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.primary, padding: "8px", display: "flex", alignItems: "center" }}
//         >
//           <span className="material-symbols-outlined">arrow_back</span>
//         </button>
//         <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: COLORS.primary, marginLeft: "8px" }}>
//           Inscription Médecin
//         </h1>
//       </header>

//       <main style={{ maxWidth: "560px", margin: "0 auto", padding: "0 1rem" }}>

//         {/* Hero */}
//         <section style={{ textAlign: "center", marginTop: "24px", marginBottom: "32px" }}>
//           <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", fontWeight: 700, color: COLORS.onBackground, marginBottom: "8px", letterSpacing: "-0.02em" }}>
//             Rejoignez l'équipe
//           </h2>
//           <p style={{ fontSize: "16px", color: COLORS.onSurfaceVariant, lineHeight: "24px" }}>
//             Prêtez votre expertise pour accompagner les parents dans leur parcours de santé.
//           </p>
//         </section>

//         {/* Erreur */}
//         {error && (
//           <div style={{ backgroundColor: COLORS.errorContainer, color: COLORS.onErrorContainer, padding: "12px 16px", borderRadius: "12px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
//             <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>error</span>
//             {error}
//           </div>
//         )}

//         {/* ÉTAPE 0 — Informations personnelles */}
//         {etape === 0 && (
//           <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.outlineVariant}40`, marginBottom: "24px" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
//               <span className="material-symbols-outlined" style={{ color: COLORS.secondary, fontVariationSettings: "'FILL' 1" }}>person</span>
//               <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: COLORS.onSurface }}>
//                 Informations Personnelles
//               </h3>
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               {[
//                 { label: "Prénom *", name: "first_name", placeholder: "Ex: Paul", type: "text" },
//                 { label: "Nom *", name: "last_name", placeholder: "Ex: Nkomo", type: "text" },
//                 { label: "Téléphone *", name: "telephone", placeholder: "6XX XXX XXX", type: "tel" },
//                 { label: "Email professionnel", name: "email", placeholder: "paul.nkomo@sante.cm", type: "email" },
//                 { label: "Numéro d'ordre *", name: "numero_ordre", placeholder: "CM-PED-XXXX", type: "text" },
//                 { label: "Hôpital / Cabinet", name: "hopital_cabinet", placeholder: "Ex: Hôpital Général de Douala", type: "text" },
//                 { label: "Ville *", name: "ville", placeholder: "Ex: Douala", type: "text" },
//                 { label: "Mot de passe *", name: "password", placeholder: "Mot de passe sécurisé", type: "password" },
//               ].map(champ => (
//                 <div key={champ.name}>
//                   <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLORS.onSurfaceVariant, marginBottom: "4px", marginLeft: "4px", letterSpacing: "0.01em" }}>
//                     {champ.label}
//                   </label>
//                   <input
//                     type={champ.type} name={champ.name}
//                     value={form[champ.name]} onChange={handleChange}
//                     placeholder={champ.placeholder}
//                     style={{
//                       width: "100%", height: "48px", padding: "0 16px",
//                       borderRadius: "8px", border: "none",
//                       borderBottom: `2px solid ${COLORS.outlineVariant}`,
//                       backgroundColor: COLORS.surfaceContainerLow,
//                       fontSize: "16px", outline: "none", boxSizing: "border-box",
//                       transition: "border-color 0.2s",
//                     }}
//                     onFocus={e => e.target.style.borderBottomColor = COLORS.primary}
//                     onBlur={e => e.target.style.borderBottomColor = COLORS.outlineVariant}
//                   />
//                 </div>
//               ))}
//               <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
//                 <input type="checkbox" name="disponibilite" checked={form.disponibilite} onChange={handleChange}
//                   style={{ width: "16px", height: "16px", accentColor: COLORS.primary }} />
//                 <label style={{ fontSize: "14px", color: COLORS.onSurfaceVariant }}>Disponible pour les consultations</label>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ÉTAPE 1 — Spécialité */}
//         {etape === 1 && (
//           <div style={{ marginBottom: "24px" }}>
//             <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: COLORS.onSurface, textAlign: "center", marginBottom: "20px" }}>
//               Choisissez votre spécialité
//             </h3>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
//               {specialites.map(spec => (
//                 <button key={spec.label} onClick={() => setSpecialiteChoisie(spec.label)}
//                   style={{
//                     display: "flex", flexDirection: "column", alignItems: "center",
//                     justifyContent: "center", padding: "24px 16px", borderRadius: "12px",
//                     border: `2px solid ${specialiteChoisie === spec.label ? COLORS.secondary : "transparent"}`,
//                     backgroundColor: specialiteChoisie === spec.label ? `${COLORS.secondaryFixed}50` : COLORS.surfaceContainerLowest,
//                     cursor: "pointer", transition: "all 0.2s",
//                     boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//                   }}>
//                   <span className="material-symbols-outlined" style={{ fontSize: "36px", color: COLORS.secondary, marginBottom: "8px" }}>
//                     {spec.icone}
//                   </span>
//                   <span style={{ fontSize: "14px", fontWeight: 600, color: COLORS.onSurface }}>{spec.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ÉTAPE 2 — Vérification */}
//         {etape === 2 && (
//           <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.outlineVariant}40`, marginBottom: "24px" }}>
            
//             {/* Zone Drag and Drop Dynamique */}
//             <div 
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}
//               onClick={() => document.getElementById("fileInput").click()}
//               style={{
//                 textAlign: "center", padding: "32px 16px",
//                 border: `2px dashed ${isDragging ? COLORS.primary : COLORS.outlineVariant}`, 
//                 borderRadius: "12px",
//                 backgroundColor: isDragging ? `${COLORS.primaryFixed}30` : COLORS.surfaceContainerLow, 
//                 cursor: "pointer",
//                 transition: "all 0.2s"
//               }}
//             >
//               {/* input HTML masqué, déclenché par le clic sur la boîte */}
//               <input 
//                 id="fileInput"
//                 type="file" 
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={handleFileChange}
//                 style={{ display: "none" }}
//               />

//               <div style={{
//                 width: "64px", height: "64px", backgroundColor: fichierDiplome ? COLORS.primaryFixedDim : COLORS.primaryFixed,
//                 borderRadius: "50%", display: "flex", alignItems: "center",
//                 justifyContent: "center", margin: "0 auto 16px",
//                 transition: "background-color 0.3s"
//               }}>
//                 <span className="material-symbols-outlined" style={{ fontSize: "32px", color: COLORS.primary }}>
//                   {fichierDiplome ? "task" : "cloud_upload"}
//                 </span>
//               </div>
              
//               <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: COLORS.onSurface, marginBottom: "8px" }}>
//                 {fichierDiplome ? "Document chargé avec succès !" : "Diplômes & Certifications"}
//               </h4>
              
//               <p style={{ fontSize: "14px", color: COLORS.onSurfaceVariant }}>
//                 {fichierDiplome ? (
//                   <span style={{ color: COLORS.primary, fontWeight: 700 }}>{fichierDiplome.name}</span>
//                 ) : (
//                   <>Glissez votre fichier ici ou <span style={{ color: COLORS.primary, fontWeight: 700 }}>parcourez</span></>
//                 )}
//               </p>
//               <p style={{ fontSize: "10px", color: COLORS.outline, marginTop: "16px" }}>PDF, JPG ou PNG (Max 10MB)</p>
//             </div>

//             <div style={{
//               marginTop: "20px", display: "flex", alignItems: "flex-start", gap: "12px",
//               padding: "16px", backgroundColor: `${COLORS.tertiaryFixed}50`, borderRadius: "10px",
//             }}>
//               <span className="material-symbols-outlined" style={{ color: COLORS.tertiary, fontSize: "20px", flexShrink: 0 }}>verified</span>
//               <p style={{ fontSize: "12px", color: COLORS.tertiary, lineHeight: "16px" }}>
//                 La vérification manuelle par notre équipe médicale prend généralement 24 à 48 heures ouvrées.
//               </p>
//             </div>

//             <div style={{ marginTop: "20px", padding: "16px", backgroundColor: COLORS.surfaceContainer, borderRadius: "10px" }}>
//               <h4 style={{ fontSize: "14px", fontWeight: 700, color: COLORS.onSurface, marginBottom: "10px" }}>Récapitulatif</h4>
//               {[
//                 ["Nom", `${form.first_name} ${form.last_name}`],
//                 ["Téléphone", form.telephone],
//                 ["Spécialité", specialiteChoisie],
//                 ["Ville", form.ville],
//                 ["Justificatif", fichierDiplome ? fichierDiplome.name : "Manquant ❌"],
//               ].map(([label, val]) => (
//                 <p key={label} style={{ fontSize: "13px", color: COLORS.onSurfaceVariant, marginBottom: "4px" }}>
//                   <b>{label} :</b> {val}
//                 </p>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Bouton principal */}
//         <div style={{ marginTop: "8px", marginBottom: "16px" }}>
//           <button
//             onClick={etape < 2 ? handleSuivant : handleSubmit}
//             disabled={loading}
//             style={{
//               width: "100%", height: "56px", backgroundColor: COLORS.primary,
//               color: COLORS.onPrimary, borderRadius: "9999px", border: "none",
//               fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 600,
//               display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//               cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
//               boxShadow: "0 4px 12px rgba(15,82,56,0.3)", transition: "all 0.2s",
//             }}
//           >
//             <span>{etape < 2 ? "Continuer" : (loading ? "Validation..." : "S'inscrire maintenant")}</span>
//             <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
//               {etape < 2 ? "arrow_forward" : "check_circle"}
//             </span>
//           </button>
//         </div>

//       </main>

//       {/* Fond décoratif */}
//       <div style={{ position: "fixed", top: 0, right: 0, zIndex: -1, opacity: 0.4, filter: "blur(64px)", pointerEvents: "none" }}>
//         <div style={{ width: "384px", height: "384px", backgroundColor: COLORS.primaryFixedDim, borderRadius: "50%" }} />
//       </div>
//       <div style={{ position: "fixed", bottom: "80px", left: 0, zIndex: -1, opacity: 0.3, filter: "blur(64px)", pointerEvents: "none" }}>
//         <div style={{ width: "320px", height: "320px", backgroundColor: COLORS.secondaryFixed, borderRadius: "50%" }} />
//       </div>

//       {/* Navbar étapes */}
//       <nav style={{
//         position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 50,
//         display: "flex", justifyContent: "space-around", alignItems: "center",
//         padding: "12px 16px", backgroundColor: COLORS.surface,
//         boxShadow: "0 -1px 4px rgba(0,0,0,0.06)", borderTop: `1px solid ${COLORS.outlineVariant}30`,
//       }}>
//         {etapesNav.map((nav, i) => (
//           <div key={nav.id} style={{
//             display: "flex", flexDirection: "column", alignItems: "center",
//             justifyContent: "center", padding: etape === i ? "4px 16px" : "8px",
//             borderRadius: etape === i ? "9999px" : "8px",
//             backgroundColor: etape === i ? COLORS.primaryContainer : "transparent",
//             color: etape === i ? COLORS.onPrimaryContainer : COLORS.onSurfaceVariant,
//             transition: "all 0.3s",
//           }}>
//             <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>{nav.icone}</span>
//             <span style={{ fontSize: "12px", fontWeight: 500, marginTop: "2px" }}>{nav.label}</span>
//           </div>
//         ))}
//       </nav>

//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', first_name: '', last_name: '',
    role: 'parent', numero_ordre: '', specialite: '', ville: '', hopital_cabinet: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Inscription réussie ! Connectez-vous.");
        // Redirection vers le login
      } else {
        const errors = await response.json();
        console.error(errors);
      }
    } catch (error) {
      console.error("Erreur réseau", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Création de compte</h2>
      
      {/* Champs Communs */}
      <input type="text" name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
      <input type="text" name="first_name" placeholder="Prénom" onChange={handleChange} required />
      <input type="text" name="last_name" placeholder="Nom" onChange={handleChange} required />

      {/* CHOIX DU RÔLE */}
      <div className="role-selection">
        <label>Vous êtes :</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="parent">Parent</option>
          <option value="medecin">Médecin / Professionnel de santé</option>
        </select>
      </div>

      {/* CHAMPS EXTENSIBLES CONDITIONNELS POUR MÉDECIN */}
      {formData.role === 'medecin' && (
        <div className="medecin-fields">
          <h3>Informations Professionnelles</h3>
          <input type="text" name="numero_ordre" placeholder="N° d'ordre des Médecins" onChange={handleChange} required />
          <input type="text" name="specialite" placeholder="Spécialité (ex: Pédiatre)" onChange={handleChange} required />
          <input type="text" name="ville" placeholder="Ville d'exercice" onChange={handleChange} required />
          <input type="text" name="hopital_cabinet" placeholder="Hôpital ou Cabinet Clinique" onChange={handleChange} />
        </div>
      )}

      <button type="submit">S'inscrire</button>
    </form>
  );
}

const C = {
  primary: "#0f5238",
  onPrimary: "#ffffff",
  surface: "#f8f9fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f3f4f5",
  onSurface: "#191c1d",
  onSurfaceVariant: "#404943",
  outlineVariant: "#bfc9c1",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
};

const BASE_URL = "http://localhost:8000/api";

export default function InscriptionMedecin() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    telephone: "",
    password: "",
    numero_ordre: "",
    specialite: "",
    hopital_cabinet: "",
    ville: "",
  });

  const [diplomeFile, setDiplomeFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDiplomeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Utilisation obligatoire de FormData à cause de serializers.FileField(diplome)
      const data = new FormData();
      
      data.append("username", formData.username.trim());
      data.append("first_name", formData.first_name.trim());
      data.append("last_name", formData.last_name.trim());
      data.append("email", formData.email.trim());
      data.append("telephone", formData.telephone.trim());
      data.append("password", formData.password);
      data.append("role", "medecin"); 
      data.append("numero_ordre", formData.numero_ordre.trim());
      data.append("specialite", formData.specialite.trim());
      data.append("hopital_cabinet", formData.hopital_cabinet.trim());
      data.append("ville", formData.ville.trim());

      if (diplomeFile) {
        data.append("diplome", diplomeFile);
      }

      const res = await fetch(`${BASE_URL}/auth/inscription/`, {
        method: "POST",
        body: data, 
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (responseData.email) throw new Error(responseData.email);
        if (responseData.telephone) throw new Error(responseData.telephone);
        if (responseData.username) throw new Error(responseData.username);
        throw new Error("Échec de l'inscription. Vérifiez les informations fournies.");
      }

      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("utilisateur", JSON.stringify(responseData.utilisateur));
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/medecin/repas"); 
      }, 2000);
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    height: "46px",
    padding: "0 14px",
    borderRadius: "10px",
    border: `1px solid ${C.outlineVariant}`,
    backgroundColor: C.surfaceContainerLow,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: C.onSurfaceVariant,
    marginBottom: "6px",
  };

  const cardStyle = {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    border: `1px solid ${C.outlineVariant}40`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  };

  return (
    <div style={{ backgroundColor: C.surface, minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: C.primary, padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "10px" }}>
        <button type="button" onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#A8D8C8", cursor: "pointer", fontSize: "14px" }}>
          Retour
        </button>
        <h1 style={{ color: C.onPrimary, fontSize: "18px", fontWeight: 700, margin: 0 }}>Inscription Médecin</h1>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem 1rem" }}>
        <p style={{ color: C.onSurfaceVariant, fontSize: "14px", marginBottom: "20px" }}>
          Créez votre compte professionnel pour rejoindre la plateforme NutriBébéCam.
        </p>

        {success && (
          <div style={{ backgroundColor: "#eafaf1", color: "#1a5c2e", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
            Compte créé avec succès ! Préparation de votre espace...
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: C.errorContainer, color: C.onErrorContainer, padding: "16px", borderRadius: "12px", marginBottom: "16px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section Identifiants Compte */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "15px", color: C.primary, marginTop: 0, marginBottom: "14px", fontWeight: 700 }}>
              1. Informations de connexion
            </h2>
            
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Nom d'utilisateur (Identifiant unique) *</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Ex: dr_traore" style={inputStyle} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Mot de passe *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" style={inputStyle} />
            </div>
          </div>

          {/* Section Informations Personnelles */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "15px", color: C.primary, marginTop: 0, marginBottom: "14px", fontWeight: 700 }}>
              2. Informations personnelles
            </h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Prénom *</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="Jean" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Nom *</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Traoré" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Adresse Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="dr.traore@exemple.com" style={inputStyle} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Numéro de Téléphone *</label>
              <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required placeholder="Ex: +2376XXXXXXXX" style={inputStyle} />
            </div>
          </div>

          {/* Section Profil Médical */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "15px", color: C.primary, marginTop: 0, marginBottom: "14px", fontWeight: 700 }}>
              3. Validation du profil médical
            </h2>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Numéro d'ordre des médecins *</label>
              <input type="text" name="numero_ordre" value={formData.numero_ordre} onChange={handleChange} required placeholder="Ex: ONMC-9843" style={inputStyle} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Spécialité *</label>
              <input type="text" name="specialite" value={formData.specialite} onChange={handleChange} required placeholder="Ex: Pédiatre, Nutritionniste" style={inputStyle} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Hôpital / Cabinet médical</label>
              <input type="text" name="hopital_cabinet" value={formData.hopital_cabinet} onChange={handleChange} placeholder="Ex: Hôpital Central" style={inputStyle} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Ville *</label>
              <input type="text" name="ville" value={formData.ville} onChange={handleChange} required placeholder="Ex: Yaoundé" style={inputStyle} />
            </div>

            <div style={{ marginBottom: "4px" }}>
              <label style={labelStyle}>Justificatif / Diplôme (Fichier) *</label>
              <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} required style={{ ...inputStyle, padding: "10px 14px" }} />
            </div>
          </div>

          <button type="submit" disabled={submitting} style={{ width: "100%", height: "50px", backgroundColor: C.primary, color: C.onPrimary, border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer", marginTop: "10px", marginBottom: "20px" }}>
            {submitting ? "Traitement de l'inscription..." : "Finaliser l'inscription du Médecin"}
          </button>
        </form>
      </div>
    </div>
  );
}