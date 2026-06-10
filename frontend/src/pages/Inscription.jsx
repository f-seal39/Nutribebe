// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { inscription } from "../services/api";

// export default function Inscription() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [etape, setEtape] = useState(1);
//   const [chargement, setChargement] = useState(false);
//   const [erreur, setErreur] = useState("");
//   const [voirMotDePasse, setVoirMotDePasse] = useState(false);

//   const [form, setForm] = useState({
//     nom_complet: "",
//     telephone: "",
//     password: "",
//     region: "",
//     adresse: "",
//     profession: "",
//     role: "parent",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSuivant = (e) => {
//     e.preventDefault();
//     if (!form.nom_complet || !form.telephone || !form.password) {
//       setErreur("Veuillez remplir tous les champs.");
//       return;
//     }
//     setErreur("");
//     setEtape(2);
//   };

//   // Nettoie et normalise une chaîne (minuscules, sans accents, caractères alphanumériques + points)
//   const normaliserChaine = (chaine) => {
//     return chaine
//       .toLowerCase()
//       .normalize('NFD')
//       .replace(/[\u0300-\u036f]/g, '')
//       .replace(/[^a-z0-9]/g, '.')
//       .replace(/\.+/g, '.')
//       .replace(/^\.|\.$/g, '');
//   };

//   // Génère un username de base à partir du prénom (premier mot du nom complet)
//   const getBaseUsername = (nomComplet) => {
//     const prenom = nomComplet.trim().split(" ")[0];
//     return normaliserChaine(prenom);
//   };

//   // Essaie d’inscrire l’utilisateur avec un username donné, retourne le résultat ou lève une erreur
//   const tenterInscription = async (username, payloadBase) => {
//     const payload = { ...payloadBase, username };
//     const data = await inscription(payload);
//     return data;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setChargement(true);
//     setErreur("");

//     const prenom = form.nom_complet.trim().split(" ")[0];
//     const baseUsername = getBaseUsername(form.nom_complet);
//     const payloadBase = {
//       first_name: prenom,
//       last_name: form.nom_complet.split(" ").slice(1).join(" "),
//       telephone: form.telephone,
//       password: form.password,
//       role: "parent",
//       ville: form.adresse,
//     };

//     let dernierUsername = baseUsername;
//     let success = false;
//     let data = null;

//     // On essaie avec baseUsername, puis avec suffixe numérique
//     for (let i = 0; i <= 100; i++) {
//       const tentativeUsername = i === 0 ? dernierUsername : `${baseUsername}${i}`;
//       try {
//         data = await tenterInscription(tentativeUsername, payloadBase);
//         success = true;
//         break; // Inscription réussie
//       } catch (err) {
//         if (err.response && err.response.data && err.response.data.username) {
//           const usernameError = err.response.data.username[0];
//           if (usernameError && usernameError.includes("already exists")) {
//             // Conflit, on continue la boucle avec un nouveau suffixe
//             continue;
//           }
//         }
//         // Autre erreur (téléphone déjà utilisé, validation, etc.)
//         throw err;
//       }
//     }

//     if (success && data && data.token) {
//       // Connexion automatique après inscription
//       await login(payloadBase.telephone, payloadBase.password);
//       navigate("/profil-bebe");
//     } else if (!success) {
//       setErreur("Impossible de créer un nom d'utilisateur unique. Contactez le support.");
//     }

//     setChargement(false);
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <div style={styles.header}>
//           <span style={styles.retour} onClick={() => etape === 1 ? navigate("/") : setEtape(1)}>
//             ← Retour
//           </span>
//           <span style={styles.etapeTexte}>Étape {etape} / 2</span>
//         </div>

//         <div style={styles.progressBar}>
//           <div style={{ ...styles.progress, width: etape === 1 ? "50%" : "100%" }} />
//         </div>

//         <h2 style={styles.titre}>
//           {etape === 1 ? "👋 Bienvenue !" : "📍 Votre localisation"}
//         </h2>
//         <p style={styles.sousTitre}>
//           {etape === 1
//             ? "Créez votre compte en quelques secondes"
//             : "Ces informations personnalisent votre expérience"}
//         </p>

//         {erreur && <p style={styles.erreur}>{erreur}</p>}

//         {etape === 1 && (
//           <form onSubmit={handleSuivant}>
//             <div style={styles.champ}>
//               <label style={styles.label}>Nom complet</label>
//               <input style={styles.input} type="text" name="nom_complet"
//                 value={form.nom_complet} onChange={handleChange}
//                 placeholder="Ex: Marie Kamga" required />
//             </div>

//             <div style={styles.champ}>
//               <label style={styles.label}>Numéro de téléphone</label>
//               <div style={styles.telWrapper}>
//                 <span style={styles.indicatif}>🇨🇲 +237</span>
//                 <input style={styles.inputTel} type="tel" name="telephone"
//                   value={form.telephone} onChange={handleChange}
//                   placeholder="6XX XXX XXX" required />
//               </div>
//               <p style={styles.aide}>Ce numéro servira à vous identifier</p>
//             </div>

//             <div style={styles.champ}>
//               <label style={styles.label}>Mot de passe</label>
//               <div style={styles.passwordWrapper}>
//                 <input style={styles.inputPassword}
//                   type={voirMotDePasse ? "text" : "password"}
//                   name="password" value={form.password}
//                   onChange={handleChange}
//                   placeholder="Choisissez un mot de passe" required />
//                 <span style={styles.oeil}
//                   onClick={() => setVoirMotDePasse(!voirMotDePasse)}>
//                   {voirMotDePasse ? "🙈" : "👁️"}
//                 </span>
//               </div>
//               <p style={styles.aide}>Vous n'aurez plus besoin de le saisir après</p>
//             </div>

//             <button style={styles.bouton} type="submit">Suivant →</button>
//           </form>
//         )}

//         {etape === 2 && (
//           <form onSubmit={handleSubmit}>
//             {[
//               { label: "Région", name: "region", placeholder: "Ex: Ouest, Centre..." },
//               { label: "Quartier / Ville", name: "adresse", placeholder: "Ex: Akwa, Douala" },
//               { label: "Profession (optionnel)", name: "profession", placeholder: "Ex: Commerçante..." },
//             ].map((champ) => (
//               <div key={champ.name} style={styles.champ}>
//                 <label style={styles.label}>{champ.label}</label>
//                 <input style={styles.input} type="text" name={champ.name}
//                   value={form[champ.name]} onChange={handleChange}
//                   placeholder={champ.placeholder} />
//               </div>
//             ))}
//             <button
//               style={chargement ? styles.boutonDisabled : styles.bouton}
//               type="submit" disabled={chargement}>
//               {chargement ? "Création du compte..." : "Créer mon compte 🎉"}
//             </button>

//             <p style={{ ...styles.aide, textAlign: "center", marginTop: "1.25rem" }}>
//               Professionnel de santé ?{" "}
//               <span
//                 onClick={() => navigate("/inscription-medecin")}
//                 style={{ color: "#4CAF82", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
//               >
//                 Inscrivez-vous ici
//               </span>
//             </p>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh", backgroundColor: "#1B3A4B",
//     display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
//   },
//   card: {
//     backgroundColor: "#fff", padding: "1.5rem", borderRadius: "20px",
//     width: "100%", maxWidth: "420px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
//   },
//   header: {
//     display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem",
//   },
//   retour: { color: "#4CAF82", cursor: "pointer", fontSize: "14px", fontWeight: "bold" },
//   etapeTexte: { color: "#5A7A8A", fontSize: "13px" },
//   progressBar: { backgroundColor: "#EAF6F0", borderRadius: "10px", height: "6px", marginBottom: "1.5rem" },
//   progress: { backgroundColor: "#4CAF82", height: "6px", borderRadius: "10px", transition: "width 0.4s ease" },
//   titre: { color: "#1B3A4B", fontSize: "1.4rem", marginBottom: "0.3rem" },
//   sousTitre: { color: "#5A7A8A", fontSize: "13px", marginBottom: "1.5rem" },
//   champ: { marginBottom: "1.2rem" },
//   label: { display: "block", marginBottom: "0.4rem", color: "#1B3A4B", fontWeight: "bold", fontSize: "13px" },
//   input: {
//     width: "100%", padding: "0.8rem", borderRadius: "10px",
//     border: "1.5px solid #e0e0e0", fontSize: "14px", boxSizing: "border-box", outline: "none",
//   },
//   telWrapper: { display: "flex", alignItems: "center", border: "1.5px solid #e0e0e0", borderRadius: "10px", overflow: "hidden" },
//   indicatif: { padding: "0.8rem", backgroundColor: "#EAF6F0", color: "#1B3A4B", fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap" },
//   inputTel: { flex: 1, padding: "0.8rem", border: "none", fontSize: "14px", outline: "none", boxSizing: "border-box" },
//   passwordWrapper: { display: "flex", alignItems: "center", border: "1.5px solid #e0e0e0", borderRadius: "10px", overflow: "hidden" },
//   inputPassword: { flex: 1, padding: "0.8rem", border: "none", fontSize: "14px", outline: "none", boxSizing: "border-box" },
//   oeil: { padding: "0.8rem", cursor: "pointer", fontSize: "1.1rem", backgroundColor: "#fff" },
//   aide: { color: "#5A7A8A", fontSize: "11px", marginTop: "0.4rem" },
//   bouton: {
//     width: "100%", padding: "1rem", backgroundColor: "#4CAF82", color: "#fff",
//     border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "bold",
//     cursor: "pointer", marginTop: "0.5rem",
//   },
//   boutonDisabled: {
//     width: "100%", padding: "1rem", backgroundColor: "#aaa", color: "#fff",
//     border: "none", borderRadius: "12px", fontSize: "1rem", cursor: "not-allowed", marginTop: "0.5rem",
//   },
//   erreur: {
//     color: "#e53e3e", fontSize: "13px", textAlign: "center", marginBottom: "1rem",
//     backgroundColor: "#FFF5F5", padding: "0.6rem", borderRadius: "8px",
//   },
// };


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { inscription } from "../services/api";
import { COLORS } from "../constants/colors";
import { ArrowLeft, Eye, EyeOff, User, Phone, Lock, MapPin, Briefcase, ChevronRight } from "lucide-react";

export default function Inscription() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [etape, setEtape] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nom_complet: "",
    telephone: "",
    password: "",
    region: "",
    adresse: "",
    profession: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSuivant = (e) => {
    e.preventDefault();
    if (!form.nom_complet || !form.telephone || !form.password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    setError("");
    setEtape(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const nomParts = form.nom_complet.trim().split(" ");
    const prenom = nomParts[0];
    const nom = nomParts.slice(1).join(" ");

    const payload = {
      username: form.telephone,
      first_name: prenom,
      last_name: nom,
      telephone: form.telephone,
      password: form.password,
      role: "parent",
      ville: form.adresse,
    };

    try {
      const data = await inscription(payload);
      if (data.token) {
        await login(form.telephone, form.password);
        navigate("/profil-bebe");
      } else {
        setError("Erreur lors de l'inscription.");
      }
    } catch (err) {
      if (err.response?.data?.telephone) setError("Téléphone déjà utilisé.");
      else if (err.response?.data?.username) setError("Ce téléphone est déjà pris.");
      else setError("Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: `1px solid ${COLORS.outlineVariant}30` }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none" }}>
            <ArrowLeft size={24} color={COLORS.primary} />
          </button>
          <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>Inscription</span>
        </header>

        <main style={{ flex: 1, padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700 }}>{etape === 1 ? "👋 Créez votre compte" : "📍 Où habitez‑vous ?"}</h2>
            <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant }}>Étape {etape}/2</p>
          </div>

          {error && <div style={{ backgroundColor: COLORS.errorContainer, padding: "12px", borderRadius: "16px", marginBottom: "16px", color: COLORS.onErrorContainer, fontSize: "12px" }}>{error}</div>}

          {etape === 1 && (
            <form onSubmit={handleSuivant}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Nom complet</label>
                <input name="nom_complet" value={form.nom_complet} onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Téléphone</label>
                <input name="telephone" value={form.telephone} onChange={handleChange} required placeholder="6XX XXX XXX" style={{ width: "100%", padding: "12px 16px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Mot de passe</label>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none" }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button type="submit" style={{ width: "100%", backgroundColor: COLORS.primary, color: "white", border: "none", borderRadius: "40px", padding: "14px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                Suivant <ChevronRight size={18} />
              </button>
            </form>
          )}

          {etape === 2 && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Région</label>
                <input name="region" value={form.region} onChange={handleChange} placeholder="Ex: Centre, Littoral..." style={{ width: "100%", padding: "12px 16px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Quartier / Ville</label>
                <input name="adresse" value={form.adresse} onChange={handleChange} placeholder="Ex: Akwa, Douala" style={{ width: "100%", padding: "12px 16px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Profession (optionnel)</label>
                <input name="profession" value={form.profession} onChange={handleChange} placeholder="Ex: Enseignant" style={{ width: "100%", padding: "12px 16px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
              </div>
              <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: COLORS.primary, color: "white", border: "none", borderRadius: "40px", padding: "14px", fontWeight: 700 }}>
                {loading ? "Création..." : "Créer mon compte"}
              </button>
            </form>
          )}
          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "12px" }}>
            Déjà un compte ? <button onClick={() => navigate("/connexion")} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 600, cursor: "pointer" }}>Connectez-vous</button>
          </div>
        </main>
      </div>
    </div>
  );
}