// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { jwtDecode } from "jwt-decode";

// const COLORS = {
//   primary: "#0f5238",
//   onPrimary: "#ffffff",
//   primaryFixed: "#b1f0ce",
//   onPrimaryFixed: "#002114",
//   secondary: "#8e4e14",
//   secondaryFixed: "#ffdcc4",
//   surface: "#f8f9fa",
//   surfaceContainerLowest: "#ffffff",
//   surfaceContainerLow: "#f3f4f5",
//   surfaceContainer: "#edeeef",
//   surfaceVariant: "#e1e3e4",
//   onSurface: "#191c1d",
//   onSurfaceVariant: "#404943",
//   onBackground: "#191c1d",
//   outlineVariant: "#bfc9c1",
//   errorContainer: "#ffdad6",
//   onErrorContainer: "#93000a",
// };

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [erreur, setErreur] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErreur("");

//     if (!username.trim() || !password.trim()) {
//       setErreur("Veuillez saisir votre identifiant et votre mot de passe.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await login(username.trim(), password);
//       if (result.succes) {
//         const token = localStorage.getItem("token");
//         if (token) {
//           const decoded = jwtDecode(token);
//           const role = decoded.role;
//           if (role === "medecin") navigate("/medecin/dashboard");
//           else if (role === "parent") navigate("/dashboard");
//           else if (role === "admin") navigate("/admin/dashboard");
//           else navigate("/dashboard");
//         } else {
//           navigate("/dashboard");
//         }
//       } else {
//         setErreur(result.erreur || "Nom d'utilisateur ou mot de passe incorrect.");
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response && err.response.data && err.response.data.error) {
//         setErreur(err.response.data.error);
//       } else if (err.message) {
//         setErreur(err.message);
//       } else {
//         setErreur("Erreur de connexion. Vérifiez votre réseau.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       minHeight: "100vh", display: "flex", flexDirection: "column",
//       fontFamily: "'Atkinson Hyperlegible Next', 'Plus Jakarta Sans', sans-serif",
//       backgroundColor: COLORS.surface, position: "relative", overflow: "hidden",
//       backgroundImage: `radial-gradient(at 0% 0%, rgba(177,240,206,0.15) 0px, transparent 50%),
//                         radial-gradient(at 100% 100%, rgba(255,220,196,0.15) 0px, transparent 50%)`,
//     }}>
//       <header style={{
//         position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50,
//         display: "flex", justifyContent: "center", alignItems: "center",
//         height: "80px", padding: "0 1rem", background: "transparent",
//       }}>
//         <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
//           <span className="material-symbols-outlined" style={{ color: COLORS.primary, fontSize: "28px" }}>child_care</span>
//           <span style={{ fontSize: "20px", fontWeight: 700, color: COLORS.primary, letterSpacing: "-0.5px" }}>NutriBébéCam</span>
//         </div>
//       </header>

//       <main style={{
//         flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
//         padding: "96px 16px 48px", position: "relative", zIndex: 10,
//       }}>
//         <div style={{ width: "100%", maxWidth: "440px" }}>
//           <div style={{
//             backgroundColor: COLORS.surfaceContainerLowest,
//             borderRadius: "12px", padding: "32px 40px",
//             boxShadow: "0 4px 20px -2px rgba(15,82,56,0.05)",
//             border: `1px solid ${COLORS.surfaceVariant}80`,
//           }}>
//             <div style={{ textAlign: "center", marginBottom: "32px" }}>
//               <h1 style={{ fontSize: "32px", fontWeight: 700, color: COLORS.onBackground, marginBottom: "8px" }}>Bon retour !</h1>
//               <p style={{ fontSize: "16px", color: COLORS.onSurfaceVariant }}>Accédez à votre tableau de bord familial.</p>
//             </div>

//             {erreur && (
//               <div style={{
//                 backgroundColor: COLORS.errorContainer, color: COLORS.onErrorContainer,
//                 fontSize: "14px", padding: "16px", borderRadius: "12px", marginBottom: "24px",
//                 display: "flex", alignItems: "center", gap: "8px",
//               }}>
//                 <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>error</span>
//                 <span>{erreur}</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
//               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//                 <label style={{ fontSize: "14px", fontWeight: 600, color: COLORS.onSurfaceVariant }}>Nom d'utilisateur</label>
//                 <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{
//                   width: "100%", height: "56px", padding: "0 16px", borderRadius: "8px", border: "none",
//                   borderBottom: `2px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow,
//                   fontSize: "16px", outline: "none", boxSizing: "border-box",
//                 }} />
//               </div>

//               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between" }}>
//                   <label style={{ fontSize: "14px", fontWeight: 600, color: COLORS.onSurfaceVariant }}>Mot de passe</label>
//                   <span style={{ fontSize: "12px", fontWeight: 600, color: COLORS.secondary, cursor: "pointer" }}>Mot de passe oublié ?</span>
//                 </div>
//                 <div style={{ position: "relative" }}>
//                   <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required style={{
//                     width: "100%", height: "56px", padding: "0 48px 0 16px", borderRadius: "8px", border: "none",
//                     borderBottom: `2px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow,
//                     fontSize: "16px", outline: "none", boxSizing: "border-box",
//                   }} />
//                   <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
//                     position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
//                     background: "none", border: "none", cursor: "pointer", color: COLORS.onSurfaceVariant,
//                   }}>
//                     <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
//                   </button>
//                 </div>
//               </div>

//               <button type="submit" disabled={loading} style={{
//                 width: "100%", height: "56px", backgroundColor: loading ? COLORS.surfaceContainer : COLORS.primary,
//                 color: loading ? COLORS.onSurfaceVariant : COLORS.onPrimary, border: "none", borderRadius: "9999px",
//                 fontSize: "16px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//                 boxShadow: loading ? "none" : "0 4px 16px rgba(15,82,56,0.2)",
//               }}>
//                 {loading ? "Connexion en cours..." : "Se connecter"}
//                 {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
//               </button>
//             </form>

//             <div style={{ display: "flex", alignItems: "center", margin: "32px 0" }}>
//               <div style={{ flex: 1, height: "1px", backgroundColor: `${COLORS.outlineVariant}50` }} />
//               <span style={{ margin: "0 16px", fontSize: "12px", color: COLORS.onSurfaceVariant }}>Ou continuer avec</span>
//               <div style={{ flex: 1, height: "1px", backgroundColor: `${COLORS.outlineVariant}50` }} />
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
//               {[
//                 { label: "Google", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjVaOwz49KAjuBjPSntZa0k8vYf7pyV7ewW0zeT3olGIZ4qd6C4dtepTt1Rw05SM-Lya_iZFqD82rMu3EfgcYoSYzhdZG1Npb6La_2GGCVJCjXNC4rx0D9Pf-YetURfQllWo_KBOVwT9yqkvFuLht3IyMwNGf1FAVXCMQvHp9FqaNk5HVLDVPrETn44p42DeAmhbdsWwBXepCLjavoKvLAlXV8vmrKwGUYOh6dk6E1voU-htzkedRR8kIw0CxgGyh32YQ48UtOl7M" },
//                 { label: "Apple", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcWu8eYiDE1CdCwuJ5yIOflhEFlWN8VYCJJcx26T20pK3009YRML8AVp8enU9zHT1kzJhG_LLar2y_4uDJB6KpZZ6kEY7pjBP3O0HV2mi0-YDeHPIAaTt25Ghz3hZ8EClWiOe-g9gzjJMXYWSnS8LBxFOIMIXehrRvNYgRzCZROmioAIPf7mTD4HHhadf9jOjGAT6RiX66XJGiAPHxVWi7Ic1nC14as6oT37_Sz0BFJ9412GSQMR0ON1ko-8zjsFv1p0i9nYpjQNM" },
//               ].map((btn) => (
//                 <button key={btn.label} style={{
//                   display: "flex", alignItems: "center", justifyContent: "center", height: "48px", borderRadius: "8px",
//                   border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLowest,
//                   gap: "12px", padding: "0 16px", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: COLORS.onSurfaceVariant,
//                 }}>
//                   <img alt={btn.label} src={btn.src} style={{ width: "20px", height: "20px" }} />
//                   <span>{btn.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div style={{ textAlign: "center", marginTop: "32px" }}>
//             <p style={{ fontSize: "16px", color: COLORS.onSurfaceVariant }}>
//               Nouveau ici ?{" "}
//               <span onClick={() => navigate("/inscription")} style={{ fontSize: "14px", fontWeight: 600, color: COLORS.primary, cursor: "pointer", textDecoration: "underline" }}>
//                 Commencer l'aventure
//               </span>
//             </p>
//             <p style={{ fontSize: "13px", color: COLORS.onSurfaceVariant, marginTop: "12px" }}>
//               Professionnel de santé ?{" "}
//               <span onClick={() => navigate("/inscription-medecin")} style={{ fontSize: "13px", fontWeight: 600, color: COLORS.primary, cursor: "pointer", textDecoration: "underline" }}>
//                 Inscrivez-vous ici
//               </span>
//             </p>
//           </div>
//         </div>
//       </main>

//       <div style={{ position: "fixed", bottom: "-80px", left: "-80px", width: "320px", height: "320px", backgroundColor: COLORS.primaryFixed, borderRadius: "50%", filter: "blur(64px)", opacity: 0.2, zIndex: -1, pointerEvents: "none" }} />
//       <div style={{ position: "fixed", top: "25%", right: "-40px", width: "256px", height: "256px", backgroundColor: COLORS.secondaryFixed, borderRadius: "50%", filter: "blur(64px)", opacity: 0.2, zIndex: -1, pointerEvents: "none" }} />

//       <footer style={{
//         width: "100%", padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
//         borderTop: `1px solid ${COLORS.surfaceVariant}30`, backgroundColor: "rgba(255,255,255,0.5)", backdropFilter: "blur(4px)",
//       }}>
//         <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant, opacity: 0.7 }}>© 2026 NutriBébéCam · IUT Fotso Victor de Bandjoun</p>
//         <div style={{ display: "flex", gap: "24px" }}>
//           {["Aide", "Confidentialité", "Conditions"].map(lien => <span key={lien} style={{ fontSize: "12px", color: COLORS.onSurfaceVariant, cursor: "pointer" }}>{lien}</span>)}
//         </div>
//       </footer>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";
import { Eye, EyeOff, LogIn, ArrowRight, Baby } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.succes) {
        const stored = JSON.parse(localStorage.getItem("utilisateur"));
        navigate(stored?.role === "parent" ? "/dashboard" : stored?.role === "medecin" ? "/medecin/dashboard" : "/admin/dashboard");
      } else {
        setError("Identifiants incorrects.");
      }
    } catch (err) {
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "20px", textAlign: "center" }}>
          <Baby size={48} color={COLORS.primary} />
          <h1 style={{ fontSize: "24px", fontWeight: 800, marginTop: "8px" }}>NutriBébéCam</h1>
        </header>
        <main style={{ flex: 1, padding: "20px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: "14px 16px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: "14px 16px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none" }}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <div style={{ color: COLORS.onErrorContainer, backgroundColor: COLORS.errorContainer, padding: "10px", borderRadius: "16px", fontSize: "12px" }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ backgroundColor: COLORS.primary, color: "white", border: "none", borderRadius: "40px", padding: "14px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {loading ? "Connexion..." : "Se connecter"} <ArrowRight size={18} />
            </button>
          </form>
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <p>Nouveau ? <button onClick={() => navigate("/inscription")} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 600, cursor: "pointer" }}>Créer un compte parent</button></p>
            <p>Médecin ? <button onClick={() => navigate("/inscription-medecin")} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 600, cursor: "pointer" }}>Inscription professionnelle</button></p>
          </div>
        </main>
      </div>
    </div>
  );
}