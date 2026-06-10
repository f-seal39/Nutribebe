// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { inscription } from "../services/api";
// import { useAuth } from "../context/AuthContext";

// const C = {
//   primary: "#0f5238",
//   onPrimary: "#ffffff",
//   surface: "#f8f9fa",
//   surfaceContainerLowest: "#ffffff",
//   surfaceContainerLow: "#f3f4f5",
//   onSurface: "#191c1d",
//   onSurfaceVariant: "#404943",
//   outlineVariant: "#bfc9c1",
//   errorContainer: "#ffdad6",
//   onErrorContainer: "#93000a",
// };

// export default function InscriptionMedecin() {
//   const navigate = useNavigate();
//   const { enregistrerSession, getHomeRouteForRole } = useAuth();
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const [formData, setFormData] = useState({
//     username: "",
//     first_name: "",
//     last_name: "",
//     email: "",
//     telephone: "",
//     password: "",
//     numero_ordre: "",
//     specialite: "",
//     hopital_cabinet: "",
//     ville: "",
//   });

//   const [diplomeFile, setDiplomeFile] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setDiplomeFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");

//     // Validation simple
//     if (!formData.username || !formData.password || !formData.email || !formData.telephone || !formData.numero_ordre || !formData.specialite || !formData.ville) {
//       setError("Tous les champs obligatoires doivent être remplis.");
//       setSubmitting(false);
//       return;
//     }
//     if (!diplomeFile) {
//       setError("Veuillez joindre votre diplôme.");
//       setSubmitting(false);
//       return;
//     }

//     const payload = new FormData();
//     payload.append("username", formData.username);
//     payload.append("first_name", formData.first_name);
//     payload.append("last_name", formData.last_name);
//     payload.append("email", formData.email);
//     payload.append("telephone", formData.telephone);
//     payload.append("password", formData.password);
//     payload.append("role", "medecin");
//     payload.append("numero_ordre", formData.numero_ordre);
//     payload.append("specialite", formData.specialite);
//     payload.append("hopital_cabinet", formData.hopital_cabinet);
//     payload.append("ville", formData.ville);
//     payload.append("diplome", diplomeFile);

//     try {
//       const data = await inscription(payload); // la fonction inscription accepte FormData
//       if (data.token) {
//         // Stocker la session
//         enregistrerSession(data);
//         // Redirection vers le dashboard médecin
//         navigate("/medecin/dashboard");
//       } else {
//         setError("Erreur d'inscription. Vérifiez les informations.");
//       }
//     } catch (err) {
//       console.error(err);
//       let msg = "Erreur lors de l'inscription.";
//       if (err.response && err.response.data) {
//         const errorData = err.response.data;
//         if (errorData.username) msg = errorData.username[0];
//         else if (errorData.email) msg = errorData.email[0];
//         else if (errorData.telephone) msg = errorData.telephone[0];
//         else msg = JSON.stringify(errorData);
//       }
//       setError(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const inputStyle = {
//     width: "100%",
//     height: "46px",
//     padding: "0 14px",
//     borderRadius: "10px",
//     border: `1px solid ${C.outlineVariant}`,
//     backgroundColor: C.surfaceContainerLow,
//     fontSize: "14px",
//     outline: "none",
//     boxSizing: "border-box",
//   };

//   const labelStyle = {
//     display: "block",
//     fontSize: "13px",
//     fontWeight: 600,
//     color: C.onSurfaceVariant,
//     marginBottom: "6px",
//   };

//   const cardStyle = {
//     backgroundColor: C.surfaceContainerLowest,
//     borderRadius: "16px",
//     padding: "20px",
//     marginBottom: "16px",
//     border: `1px solid ${C.outlineVariant}40`,
//     boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//   };

//   return (
//     <div style={{ backgroundColor: C.surface, minHeight: "100vh", fontFamily: "sans-serif" }}>
//       <div style={{ backgroundColor: C.primary, padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "10px" }}>
//         <button type="button" onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#A8D8C8", cursor: "pointer", fontSize: "14px" }}>
//           ← Retour
//         </button>
//         <h1 style={{ color: C.onPrimary, fontSize: "18px", fontWeight: 700, margin: 0 }}>Inscription Médecin</h1>
//       </div>

//       <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem 1rem" }}>
//         <p style={{ color: C.onSurfaceVariant, fontSize: "14px", marginBottom: "20px" }}>
//           Créez votre compte professionnel pour rejoindre la plateforme NutriBébéCam.
//         </p>

//         {success && (
//           <div style={{ backgroundColor: "#eafaf1", color: "#1a5c2e", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
//             Compte créé avec succès. Redirection...
//           </div>
//         )}

//         {error && (
//           <div style={{ backgroundColor: C.errorContainer, color: C.onErrorContainer, padding: "16px", borderRadius: "12px", marginBottom: "16px", fontSize: "14px" }}>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {/* Identifiants */}
//           <div style={cardStyle}>
//             <h2 style={{ fontSize: "15px", color: C.primary, marginTop: 0, marginBottom: "14px", fontWeight: 700 }}>
//               1. Informations de connexion
//             </h2>
//             <div style={{ marginBottom: "12px" }}>
//               <label style={labelStyle}>Nom d'utilisateur *</label>
//               <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Ex: dr_traore" style={inputStyle} />
//             </div>
//             <div style={{ marginBottom: "12px" }}>
//               <label style={labelStyle}>Mot de passe *</label>
//               <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" style={inputStyle} />
//             </div>
//           </div>

//           {/* Personnelles */}
//           <div style={cardStyle}>
//             <h2 style={{ fontSize: "15px", color: C.primary, marginTop: 0, marginBottom: "14px", fontWeight: 700 }}>
//               2. Informations personnelles
//             </h2>
//             <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
//               <div style={{ flex: 1 }}>
//                 <label style={labelStyle}>Prénom *</label>
//                 <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="Jean" style={inputStyle} />
//               </div>
//               <div style={{ flex: 1 }}>
//                 <label style={labelStyle}>Nom *</label>
//                 <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Traoré" style={inputStyle} />
//               </div>
//             </div>
//             <div style={{ marginBottom: "12px" }}>
//               <label style={labelStyle}>Email *</label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="dr.traore@exemple.com" style={inputStyle} />
//             </div>
//             <div style={{ marginBottom: "12px" }}>
//               <label style={labelStyle}>Téléphone *</label>
//               <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required placeholder="+2376XXXXXXXX" style={inputStyle} />
//             </div>
//           </div>

//           {/* Médical */}
//           <div style={cardStyle}>
//             <h2 style={{ fontSize: "15px", color: C.primary, marginTop: 0, marginBottom: "14px", fontWeight: 700 }}>
//               3. Validation du profil médical
//             </h2>
//             <div style={{ marginBottom: "12px" }}>
//               <label style={labelStyle}>Numéro d'ordre *</label>
//               <input type="text" name="numero_ordre" value={formData.numero_ordre} onChange={handleChange} required placeholder="Ex: ONMC-9843" style={inputStyle} />
//             </div>
//             <div style={{ marginBottom: "12px" }}>
//               <label style={labelStyle}>Spécialité *</label>
//               <input type="text" name="specialite" value={formData.specialite} onChange={handleChange} required placeholder="Ex: Pédiatre" style={inputStyle} />
//             </div>
//             <div style={{ marginBottom: "12px" }}>
//               <label style={labelStyle}>Hôpital / Cabinet</label>
//               <input type="text" name="hopital_cabinet" value={formData.hopital_cabinet} onChange={handleChange} placeholder="Ex: Hôpital Central" style={inputStyle} />
//             </div>
//             <div style={{ marginBottom: "12px" }}>
//               <label style={labelStyle}>Ville *</label>
//               <input type="text" name="ville" value={formData.ville} onChange={handleChange} required placeholder="Ex: Yaoundé" style={inputStyle} />
//             </div>
//             <div style={{ marginBottom: "4px" }}>
//               <label style={labelStyle}>Diplôme (fichier) *</label>
//               <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} required style={{ ...inputStyle, padding: "10px 14px" }} />
//             </div>
//           </div>

//           <button type="submit" disabled={submitting} style={{
//             width: "100%", height: "50px", backgroundColor: C.primary, color: C.onPrimary,
//             border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 600,
//             cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1,
//             marginTop: "10px", marginBottom: "12px"
//           }}>
//             {submitting ? "Inscription en cours..." : "Finaliser l'inscription"}
//           </button>

//           <p style={{ fontSize: "13px", color: C.onSurfaceVariant, textAlign: "center", marginBottom: "20px" }}>
//             Vous êtes parent ?{" "}
//             <span onClick={() => navigate("/inscription")} style={{ color: C.primary, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
//               Créer un compte parent
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { inscription } from "../services/api";
import { COLORS } from "../constants/colors";
import { ArrowLeft, Eye, EyeOff, User, Mail, Phone, Lock, Stethoscope, MapPin, Building, FileText, ChevronRight } from "lucide-react";

export default function InscriptionMedecin() {
  const navigate = useNavigate();
  const { enregistrerSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
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
  const [diplome, setDiplome] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setDiplome(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diplome) {
      setError("Veuillez joindre votre diplôme.");
      return;
    }
    setLoading(true);
    setError("");

    const payload = new FormData();
    Object.keys(form).forEach(k => payload.append(k, form[k]));
    payload.append("role", "medecin");
    payload.append("diplome", diplome);

    try {
      const data = await inscription(payload);
      if (data.token) {
        enregistrerSession(data);
        navigate("/medecin/dashboard");
      } else {
        setError("Erreur lors de l'inscription.");
      }
    } catch (err) {
      if (err.response?.data?.username) setError("Nom d'utilisateur déjà pris.");
      else if (err.response?.data?.email) setError("Email déjà utilisé.");
      else setError("Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: `1px solid ${COLORS.outlineVariant}30` }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none" }}><ArrowLeft size={24} color={COLORS.primary} /></button>
          <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>Inscription médecin</span>
        </header>

        <main style={{ flex: 1, padding: "20px", paddingBottom: "40px" }}>
          {error && <div style={{ backgroundColor: COLORS.errorContainer, padding: "12px", borderRadius: "16px", marginBottom: "16px", color: COLORS.onErrorContainer, fontSize: "12px" }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Nom d'utilisateur *</label>
              <input name="username" value={form.username} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Prénom *</label>
                <input name="first_name" value={form.first_name} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Nom *</label>
                <input name="last_name" value={form.last_name} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Téléphone *</label>
              <input name="telephone" value={form.telephone} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Mot de passe *</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required style={inputStyle} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>N° d'ordre *</label>
              <input name="numero_ordre" value={form.numero_ordre} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Spécialité *</label>
              <input name="specialite" value={form.specialite} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Hôpital / Cabinet</label>
              <input name="hopital_cabinet" value={form.hopital_cabinet} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Ville *</label>
              <input name="ville" value={form.ville} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Diplôme (PDF/Image) *</label>
              <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: COLORS.primary, color: "white", border: "none", borderRadius: "40px", padding: "14px", fontWeight: 700 }}>
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>
          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "12px" }}>
            Déjà un compte ? <button onClick={() => navigate("/connexion")} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 600, cursor: "pointer" }}>Connectez-vous</button>
          </div>
        </main>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "40px",
  border: `1px solid ${COLORS.outlineVariant}`,
  backgroundColor: COLORS.surfaceContainerLow,
  fontSize: "14px",
};

const eyeButtonStyle = {
  position: "absolute",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
};