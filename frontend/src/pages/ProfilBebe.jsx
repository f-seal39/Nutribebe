// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createBebe } from "../services/api";

// export default function ProfilBebe() {
//   const [nomComplet, setNomComplet] = useState("");
//   const [dateNaissance, setDateNaissance] = useState("");
//   const [poidsNaissance, setPoidsNaissance] = useState("");
//   const [tailleNaissance, setTailleNaissance] = useState("");
//   const [sexe, setSexe] = useState("M"); // optionnel, par défaut masculin
//   const [erreur, setErreur] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErreur("");
//     setLoading(true);

//     // Validation côté frontend
//     const poids = parseFloat(poidsNaissance);
//     const taille = parseFloat(tailleNaissance);
//     if (isNaN(poids) || poids < 0.5 || poids > 10) {
//       setErreur("Le poids de naissance doit être compris entre 0.5 kg et 10 kg.");
//       setLoading(false);
//       return;
//     }
//     if (isNaN(taille) || taille < 30 || taille > 100) {
//       setErreur("La taille de naissance doit être comprise entre 30 cm et 100 cm.");
//       setLoading(false);
//       return;
//     }
//     if (!dateNaissance) {
//       setErreur("Veuillez renseigner la date de naissance.");
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       nom: nomComplet.trim(),
//       date_naissance: dateNaissance,
//       sexe: sexe, // maintenant paramétrable (ajouter un sélecteur si besoin)
//       poids_naissance: poids,
//       taille_naissance: taille,
//     };

//     try {
//       const response = await createBebe(payload);
//       if (response) {
//         navigate("/dashboard");
//       } else {
//         setErreur("Une erreur est survenue lors de l'enregistrement.");
//       }
//     } 
    
//     // catch (err) {
//     //   console.error(err);
//     //   if (err.response && err.response.data) {
//     //     // Affiche les erreurs champ par champ
//     //     const messages = Object.values(err.response.data).flat();
//     //     setErreur(messages.join(" "));
//     //   } else {
//     //     setErreur("Impossible de joindre le serveur.");
//     //   }
//     // } finally {
//     //   setLoading(false);
//     // }

//         catch (err) {
//       console.error("Erreur complète :", err);
//       if (err.response) {
//         console.error("Détail du backend :", err.response.data);
//         const messages = Object.values(err.response.data).flat();
//         setErreur(messages.join(" "));
//       } else {
//         setErreur("Impossible de joindre le serveur.");
//       }
//     }

//   };

//   return (
//     <div className="bg-background text-on-background min-h-screen flex flex-col items-center font-sans">
//       <header className="w-full top-0 sticky bg-surface dark:bg-surface-dim z-50">
//         <div className="flex items-center justify-between px-4 h-16 w-full max-w-[1200px] mx-auto">
//           <button onClick={() => navigate(-1)} className="hover:bg-surface-container-high p-2 rounded-full active:scale-95" type="button">
//             <span className="material-symbols-outlined text-primary">arrow_back</span>
//           </button>
//           <h1 className="text-xl font-bold text-primary">Profil de l'enfant</h1>
//           <div className="w-10"></div>
//         </div>
//       </header>

//       <main className="w-full max-w-[1200px] px-4 pt-8 pb-32 flex flex-col items-center">
//         <section className="w-full max-w-md text-center mb-10">
//           <div className="relative w-32 h-32 mx-auto mb-6">
//             <div className="absolute inset-0 bg-secondary-container rounded-full opacity-20 animate-pulse"></div>
//             <img alt="Illustration Enfant" className="w-full h-full object-cover rounded-full border-4 border-surface-container-lowest shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2zexLM1gwqIClg1cKaqXax-V8XDiu2ACted-EXeU19EOuW8Nut-IaCcvp9c_GRW9ZiO4oukTwslIBJuy9o1m_rnzGOJYazp1AQhNJLTXl1YoMMw-lvZVe9TgBgjH6LjLEpn8DgjZXcqP8oLfkwIauW-LkQ45DNYurH3gM55XCBFINlLJjxsYer7kj7XtzzdAzhIZK8BvSO9bLkzz1UzLcsiOSoJ_MzWhBHVZZo2LdvGbfwu0kXooNfekL9pjKRIfWmJ3EtFBJskU" />
//             <button type="button" className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg">
//               <span className="material-symbols-outlined text-sm">add_a_photo</span>
//             </button>
//           </div>
//           <h2 className="text-3xl font-bold text-on-surface mb-2">Parlez-nous de votre enfant</h2>
//           <p className="text-base text-on-surface-variant">Nous utiliserons ces données pour personnaliser vos conseils nutritionnels.</p>
//         </section>

//         <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
//           {erreur && (
//             <div className="bg-error-container text-on-error-container text-sm p-4 rounded-xl flex items-center gap-2">
//               <span className="material-symbols-outlined text-lg">error</span>
//               <span>{erreur}</span>
//             </div>
//           )}

//           <div className="group">
//             <label className="text-sm font-semibold text-on-surface-variant ml-1 mb-2 block">Nom Complet</label>
//             <div className="relative flex items-center bg-surface-container-low rounded-xl border-b-2 border-transparent focus-within:border-primary p-1">
//               <div className="flex items-center justify-center w-12 text-on-surface-variant">
//                 <span className="material-symbols-outlined">person</span>
//               </div>
//               <input className="w-full bg-transparent border-none focus:ring-0 py-3 text-base outline-none" type="text" placeholder="Entrez le nom de l'enfant" required value={nomComplet} onChange={(e) => setNomComplet(e.target.value)} />
//             </div>
//           </div>

//           <div className="group">
//             <label className="text-sm font-semibold text-on-surface-variant ml-1 mb-2 block">Sexe</label>
//             <div className="flex gap-4">
//               <label className="flex items-center gap-2">
//                 <input type="radio" name="sexe" value="M" checked={sexe === "M"} onChange={(e) => setSexe(e.target.value)} /> Masculin
//               </label>
//               <label className="flex items-center gap-2">
//                 <input type="radio" name="sexe" value="F" checked={sexe === "F"} onChange={(e) => setSexe(e.target.value)} /> Féminin
//               </label>
//             </div>
//           </div>

//           <div className="group">
//             <label className="text-sm font-semibold text-on-surface-variant ml-1 mb-2 block">Date de Naissance</label>
//             <div className="relative flex items-center bg-surface-container-low rounded-xl border-b-2 border-transparent focus-within:border-primary p-1">
//               <div className="flex items-center justify-center w-12 text-on-surface-variant">
//                 <span className="material-symbols-outlined">calendar_today</span>
//               </div>
//               <input className="w-full bg-transparent border-none focus:ring-0 py-3 text-base outline-none" type="date" required value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="group">
//               <label className="text-sm font-semibold text-on-surface-variant ml-1 mb-2 block">Poids (kg)</label>
//               <div className="relative flex items-center bg-surface-container-low rounded-xl border-b-2 border-transparent focus-within:border-primary p-1">
//                 <div className="flex items-center justify-center w-10 text-on-surface-variant">
//                   <span className="material-symbols-outlined">monitor_weight</span>
//                 </div>
//                 <input className="w-full bg-transparent border-none focus:ring-0 py-3 text-base text-center outline-none" type="number" step="0.01" placeholder="0.0" value={poidsNaissance} onChange={(e) => setPoidsNaissance(e.target.value)} required />
//                 <span className="text-sm font-semibold text-on-surface-variant pr-4">kg</span>
//               </div>
//             </div>

//             <div className="group">
//               <label className="text-sm font-semibold text-on-surface-variant ml-1 mb-2 block">Taille (cm)</label>
//               <div className="relative flex items-center bg-surface-container-low rounded-xl border-b-2 border-transparent focus-within:border-primary p-1">
//                 <div className="flex items-center justify-center w-10 text-on-surface-variant">
//                   <span className="material-symbols-outlined">straighten</span>
//                 </div>
//                 <input className="w-full bg-transparent border-none focus:ring-0 py-3 text-base text-center outline-none" type="number" step="0.1" placeholder="0" value={tailleNaissance} onChange={(e) => setTailleNaissance(e.target.value)} required />
//                 <span className="text-sm font-semibold text-on-surface-variant pr-4">cm</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-tertiary-fixed text-on-tertiary-fixed p-4 rounded-xl flex gap-3 mt-4">
//             <span className="material-symbols-outlined text-primary">info</span>
//             <p className="text-xs font-medium">Poids entre 0.5 et 10 kg, taille entre 30 et 100 cm.</p>
//           </div>

//           <button className="w-full bg-primary text-on-primary py-4 rounded-full font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6" type="submit" disabled={loading}>
//             {loading ? <><span className="material-symbols-outlined animate-spin">progress_activity</span> Enregistrement...</> : <>Enregistrer et continuer <span className="material-symbols-outlined">chevron_right</span></>}
//           </button>
//         </form>
//       </main>

//       <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 bg-surface-container-lowest shadow-[0_-4px_12px_rgba(0,0,0,0.02)] z-50 rounded-t-xl">
//         <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1" type="button">
//           <span className="material-symbols-outlined">home</span>
//           <span className="text-xs font-medium">Accueil</span>
//         </button>
//         <button onClick={() => navigate("/repas")} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1" type="button">
//           <span className="material-symbols-outlined">restaurant</span>
//           <span className="text-xs font-medium">Repas</span>
//         </button>
//         <button onClick={() => navigate("/croissance")} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1" type="button">
//           <span className="material-symbols-outlined">monitoring</span>
//           <span className="text-xs font-medium">Croissance</span>
//         </button>
//         <button onClick={() => navigate("/profil")} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1" type="button">
//           <span className="material-symbols-outlined">person</span>
//           <span className="text-xs font-medium">Profil</span>
//         </button>
//       </nav>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBebe } from "../services/api";
import { COLORS } from "../constants/colors";
import { ArrowLeft, User, Calendar, Weight, Ruler, Info, ChevronRight } from "lucide-react";

export default function ProfilBebe() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [poids, setPoids] = useState("");
  const [taille, setTaille] = useState("");
  const [sexe, setSexe] = useState("M");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom || !dateNaissance || !poids || !taille) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    setLoading(true);
    try {
      await createBebe({
        nom,
        date_naissance: dateNaissance,
        sexe,
        poids_naissance: parseFloat(poids),
        taille_naissance: parseFloat(taille),
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          display: "flex", alignItems: "center", gap: "12px",
          padding: "0 20px", height: "64px",
          backgroundColor: "rgba(248,249,250,0.92)", backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${COLORS.outlineVariant}30`,
        }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={24} color={COLORS.primary} />
          </button>
          <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>Profil du bébé</span>
        </header>

        <main style={{ flex: 1, padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <img src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=120&h=120&fit=crop" alt="bébé" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", margin: "0 auto", border: `3px solid ${COLORS.primary}` }} />
            <h2 style={{ fontSize: "18px", fontWeight: 700, marginTop: "12px" }}>Ajoutez votre enfant</h2>
            <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant }}>Ces données personnaliseront les repas et le suivi.</p>
          </div>

          {error && <div style={{ backgroundColor: COLORS.errorContainer, padding: "12px", borderRadius: "12px", marginBottom: "16px", color: COLORS.onErrorContainer, fontSize: "12px" }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Nom complet</label>
              <input type="text" value={nom} onChange={e => setNom(e.target.value)} required style={{ width: "100%", padding: "12px 16px", borderRadius: "20px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Date de naissance</label>
              <input type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} required style={{ width: "100%", padding: "12px 16px", borderRadius: "20px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Sexe</label>
              <select value={sexe} onChange={e => setSexe(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "20px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }}>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Poids de naissance (kg)</label>
              <input type="number" step="0.1" value={poids} onChange={e => setPoids(e.target.value)} required style={{ width: "100%", padding: "12px 16px", borderRadius: "20px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", display: "block" }}>Taille de naissance (cm)</label>
              <input type="number" step="1" value={taille} onChange={e => setTaille(e.target.value)} required style={{ width: "100%", padding: "12px 16px", borderRadius: "20px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }} />
            </div>
            <button type="submit" disabled={loading} style={{ backgroundColor: COLORS.primary, color: "white", border: "none", borderRadius: "999px", padding: "14px", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
              {loading ? "Enregistrement..." : "Enregistrer"} <ChevronRight size={18} />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}