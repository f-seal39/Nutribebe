// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const COLORS = {
//   primary: "#0f5238",
//   onPrimary: "#ffffff",
//   primaryFixed: "#b1f0ce",
//   primaryFixedDim: "#95d4b3",
//   onPrimaryFixed: "#002114",
//   secondary: "#8e4e14",
//   secondaryContainer: "#ffab69",
//   onSecondaryContainer: "#783d01",
//   secondaryFixed: "#ffdcc4",
//   tertiary: "#004b77",
//   tertiaryContainer: "#1e6396",
//   surface: "#f8f9fa",
//   surfaceContainerLowest: "#ffffff",
//   surfaceContainerLow: "#f3f4f5",
//   surfaceContainer: "#edeeef",
//   surfaceVariant: "#e1e3e4",
//   onSurface: "#191c1d",
//   onSurfaceVariant: "#404943",
//   background: "#f8f9fa",
//   onBackground: "#191c1d",
//   outline: "#707973",
//   outlineVariant: "#bfc9c1",
// };

// const Logo = () => (
//   <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
//     <circle cx="50" cy="50" r="48" fill={COLORS.primaryFixed} opacity="0.4"/>
//     <rect x="35" y="28" width="30" height="46" rx="15" fill={COLORS.primary}/>
//     <rect x="42" y="16" width="16" height="14" rx="8" fill={COLORS.primaryFixedDim}/>
//     <line x1="38" y1="46" x2="46" y2="46" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
//     <line x1="38" y1="56" x2="46" y2="56" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
//     <line x1="38" y1="66" x2="46" y2="66" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
//     <path d="M65 40 Q78 30 76 46 Q72 52 65 48Z" fill={COLORS.primaryFixedDim}/>
//   </svg>
// );

// const features = [
//   {
//     icone: "restaurant_menu",
//     titre: "Plans alimentaires locaux",
//     desc: "Recettes camerounaises adaptées à l'âge de votre bébé, validées par des nutritionnistes.",
//     bg: COLORS.surfaceContainer,
//     color: COLORS.primary,
//     iconBg: "#2d6a4f",
//     iconColor: "#a8e7c5",
//   },
//   {
//     icone: "monitoring",
//     titre: "Suivi de croissance OMS",
//     desc: "Visualisez l'évolution du poids et de la taille selon les normes internationales.",
//     bg: "#1e6396",
//     color: "#ffffff",
//     iconBg: "rgba(255,255,255,0.15)",
//     iconColor: "#ffffff",
//   },
//   {
//     icone: "videocam",
//     titre: "Téléconsultation 24/7",
//     desc: "Accédez instantanément à des pédiatres et spécialistes, où que vous soyez.",
//     bg: COLORS.secondaryFixed,
//     color: COLORS.onSurface,
//     iconBg: "rgba(142,78,20,0.1)",
//     iconColor: COLORS.secondary,
//   },
// ];

// export default function Splash() {
//   const navigate = useNavigate();
//   const [estConnecte, setEstConnecte] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const utilisateur = localStorage.getItem("utilisateur");
//     if (token && utilisateur) {
//       setEstConnecte(true);
//       navigate("/dashboard");
//     }
//   }, []);

//   return (
//     <div style={{
//       backgroundColor: "#1B3A4B",
//       minHeight: "100vh",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "1rem",
//       fontFamily: "'Plus Jakarta Sans', 'Atkinson Hyperlegible Next', sans-serif",
//     }}>

//       {/* Conteneur format téléphone */}
//       <div style={{
//         width: "100%",
//         maxWidth: "412px",
//         minHeight: "100vh",
//         backgroundColor: COLORS.background,
//         borderRadius: "0",
//         display: "flex",
//         flexDirection: "column",
//         overflowY: "auto",
//         position: "relative",
//       }}>

//         {/* Header */}
//         <header style={{
//           position: "sticky", top: 0, zIndex: 40,
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//           padding: "0 20px", height: "64px",
//           backgroundColor: "rgba(248,249,250,0.92)", backdropFilter: "blur(8px)",
//           borderBottom: `1px solid ${COLORS.outlineVariant}30`,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <span className="material-symbols-outlined" style={{ color: COLORS.primary, fontSize: "24px" }}>child_care</span>
//             <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary, letterSpacing: "-0.5px" }}>
//               NutriBébéCam
//             </span>
//           </div>
//           <button
//             onClick={() => navigate("/connexion")}
//             style={{
//               backgroundColor: COLORS.primary, color: COLORS.onPrimary,
//               border: "none", borderRadius: "9999px", padding: "8px 16px",
//               fontSize: "12px", fontWeight: 700, cursor: "pointer",
//             }}
//           >
//             Connexion
//           </button>
//         </header>

//         {/* Contenu principal */}
//         <main style={{ flex: 1, paddingBottom: "80px" }}>

//           {/* Hero */}
//           <section style={{ padding: "32px 20px 40px", position: "relative", overflow: "hidden" }}>
//             <div style={{
//               position: "absolute", top: "-40px", right: "-40px",
//               width: "160px", height: "160px",
//               backgroundColor: COLORS.primaryFixed, borderRadius: "50%",
//               filter: "blur(40px)", opacity: 0.3, pointerEvents: "none",
//             }}/>

//             <div style={{ textAlign: "center" }}>
//               {/* Badge */}
//               <span style={{
//                 display: "inline-block", padding: "4px 12px", borderRadius: "9999px",
//                 backgroundColor: COLORS.primaryFixed, color: COLORS.onPrimaryFixed,
//                 fontSize: "12px", fontWeight: 700, marginBottom: "16px",
//                 letterSpacing: "0.05em",
//               }}>
//                 Bienvenue chez NutriBébéCam
//               </span>

//               {/* Logo */}
//               <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
//                 <Logo />
//               </div>

//               {/* Titre */}
//               <h1 style={{
//                 fontSize: "28px", fontWeight: 800, color: COLORS.onSurface,
//                 lineHeight: "1.2", letterSpacing: "-0.5px", marginBottom: "12px",
//                 padding: "0 8px",
//               }}>
//                 Nourrissez le futur de votre enfant
//               </h1>

//               {/* Description */}
//               <p style={{
//                 fontSize: "14px", color: COLORS.onSurfaceVariant,
//                 lineHeight: "1.6", marginBottom: "28px", padding: "0 8px",
//               }}>
//                 L'application tout-en-un pour des menus équilibrés et un suivi de santé
//                 pédiatrique en temps réel, adaptée au contexte camerounais.
//               </p>

//               {/* Boutons */}
//               <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 8px" }}>
//                 <button
//                   onClick={() => navigate("/inscription")}
//                   style={{
//                     width: "100%", height: "56px",
//                     backgroundColor: COLORS.primary, color: COLORS.onPrimary,
//                     border: "none", borderRadius: "9999px",
//                     fontSize: "15px", fontWeight: 700, cursor: "pointer",
//                     display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//                     boxShadow: "0 4px 16px rgba(15,82,56,0.3)",
//                   }}
//                 >
//                   Commencer l'aventure
//                   <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
//                 </button>

//                 <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant, textAlign: "center" }}>
//                   Professionnel de santé ?{" "}
//                   <span
//                     onClick={() => navigate("/inscription-medecin")}
//                     style={{ color: COLORS.primary, fontWeight: 700, cursor: "pointer" }}
//                   >
//                     Inscrivez-vous ici
//                     <span className="material-symbols-outlined" style={{ fontSize: "14px", verticalAlign: "middle", marginLeft: "2px" }}>
//                       medical_services
//                     </span>
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* Carte illustration */}
//             <div style={{ marginTop: "32px", position: "relative" }}>
//               <div style={{
//                 position: "absolute", inset: "-8px",
//                 backgroundColor: COLORS.primaryFixed,
//                 borderRadius: "2rem", filter: "blur(20px)", opacity: 0.2,
//               }}/>
//               <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
//                 <img
//                   alt="Parent et enfant"
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgaUcRUHkqaFOiY7fbGxdxaNwTUHpIkksqBBQh-ZTJe8H6D8iEoz1dEKflaukxZlqr569gF_vWI07KmhoW84zpcRrWfWxq2kGoSFcUj4dXsI8pWCdwenF41DtxkepU_lCTy3QbyWA9-B_3o972kpvrKm-aLVJHP1YozNEQgep_WPusw7IQNk1iViVDCFaBE1ps9Vm3DgfaZg6gKWqSMocBsvX126PpkR5yyK1LVFRl0u8dLGUp_I0gdkryj3lxXwM4azU5leZbfog"
//                   style={{ width: "100%", height: "260px", objectFit: "cover" }}
//                 />
//                 <div style={{
//                   position: "absolute", bottom: "16px", left: "16px", right: "16px",
//                   backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
//                   border: "1px solid rgba(255,255,255,0.4)",
//                   padding: "16px", borderRadius: "14px",
//                   display: "flex", alignItems: "center", gap: "14px",
//                   boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//                 }}>
//                   <div style={{
//                     backgroundColor: COLORS.secondaryContainer, padding: "10px",
//                     borderRadius: "50%", color: COLORS.onSecondaryContainer,
//                     display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//                   }}>
//                     <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>restaurant</span>
//                   </div>
//                   <div>
//                     <p style={{ fontSize: "12px", fontWeight: 700, color: COLORS.onSurface, margin: 0 }}>
//                       Menu du jour prêt
//                     </p>
//                     <p style={{ fontSize: "11px", color: COLORS.onSurfaceVariant, margin: "2px 0 0" }}>
//                       Bouillie de maïs et soja
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Fonctionnalités */}
//           <section style={{
//             padding: "32px 20px",
//             backgroundColor: COLORS.surfaceContainerLowest,
//             borderTop: `1px solid ${COLORS.outlineVariant}30`,
//           }}>
//             <div style={{ textAlign: "center", marginBottom: "24px" }}>
//               <h2 style={{ fontSize: "22px", fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.3px" }}>
//                 Fonctionnalités Clés
//               </h2>
//               <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant, marginTop: "6px", lineHeight: "1.5" }}>
//                 Conçu pour simplifier votre quotidien de parent camerounais.
//               </p>
//             </div>

//             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               {features.map((f, i) => (
//                 <div key={i} style={{
//                   backgroundColor: f.bg, padding: "20px", borderRadius: "20px",
//                   display: "flex", flexDirection: "column", gap: "12px",
//                   boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//                 }}>
//                   <div style={{
//                     width: "48px", height: "48px", backgroundColor: f.iconBg,
//                     borderRadius: "14px", display: "flex", alignItems: "center",
//                     justifyContent: "center", flexShrink: 0,
//                   }}>
//                     <span className="material-symbols-outlined" style={{ fontSize: "24px", color: f.iconColor }}>
//                       {f.icone}
//                     </span>
//                   </div>
//                   <div>
//                     <h3 style={{ fontSize: "15px", fontWeight: 700, color: f.color, marginBottom: "4px" }}>
//                       {f.titre}
//                     </h3>
//                     <p style={{ fontSize: "12px", color: f.color, opacity: 0.8, lineHeight: "1.5" }}>
//                       {f.desc}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* CTA */}
//           <section style={{
//             margin: "20px", padding: "28px 20px",
//             backgroundColor: COLORS.primary, borderRadius: "24px",
//             textAlign: "center", boxShadow: "0 4px 20px rgba(15,82,56,0.3)",
//           }}>
//             <h2 style={{ fontSize: "18px", fontWeight: 700, color: COLORS.onPrimary, marginBottom: "8px", lineHeight: "1.3" }}>
//               Prêt à transformer la nutrition de votre enfant ?
//             </h2>
//             <p style={{ fontSize: "12px", color: COLORS.onPrimary, opacity: 0.85, marginBottom: "20px", lineHeight: "1.5" }}>
//               Rejoignez des milliers de parents qui font confiance à NutriBébéCam.
//             </p>
//             <button
//               onClick={() => navigate("/inscription")}
//               style={{
//                 width: "100%", height: "52px",
//                 backgroundColor: COLORS.primaryFixed, color: COLORS.onPrimaryFixed,
//                 border: "none", borderRadius: "9999px",
//                 fontSize: "14px", fontWeight: 700, cursor: "pointer",
//               }}
//             >
//               Commencer maintenant
//             </button>
//           </section>

//           {/* Footer */}
//           <footer style={{
//             padding: "24px 20px 16px",
//             backgroundColor: COLORS.surfaceContainerLow,
//             borderTop: `1px solid ${COLORS.outlineVariant}20`,
//             textAlign: "center",
//           }}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
//               <span className="material-symbols-outlined" style={{ color: COLORS.primary, fontSize: "18px" }}>child_care</span>
//               <span style={{ fontSize: "13px", fontWeight: 700, color: COLORS.primary }}>NutriBébéCam</span>
//             </div>
//             <p style={{ fontSize: "11px", color: COLORS.onSurfaceVariant, lineHeight: "1.5", padding: "0 16px" }}>
//               Accompagner les parents camerounais dans chaque étape du développement de l'enfant.
//             </p>
//             <p style={{ fontSize: "10px", color: COLORS.onSurfaceVariant, opacity: 0.5, marginTop: "10px" }}>
//               © 2026 NutriBébéCam · IUT Fotso Victor de Bandjoun
//             </p>
//           </footer>

//         </main>

//         {/* Navbar */}
//         <nav style={{
//           position: "sticky", bottom: 0, width: "100%", zIndex: 50,
//           display: "flex", justifyContent: "space-around", alignItems: "center",
//           padding: "10px 16px",
//           backgroundColor: "rgba(248,249,250,0.95)", backdropFilter: "blur(8px)",
//           borderTop: `1px solid ${COLORS.outlineVariant}30`,
//           boxShadow: "0 -2px 12px rgba(0,0,0,0.05)",
//         }}>
//           {[
//             { icone: "home", label: "Accueil", path: "/" },
//             { icone: "favorite", label: "Santé", path: "/croissance" },
//             { icone: "restaurant", label: "Repas", path: "/menu" },
//           ].map((item, i) => (
//             <button key={i} onClick={() => navigate(item.path)}
//               style={{
//                 display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
//                 border: "none", background: "none", cursor: "pointer",
//                 color: item.path === "/" ? COLORS.primary : COLORS.onSurfaceVariant,
//                 padding: "4px 8px",
//               }}>
//               <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{item.icone}</span>
//               <span style={{ fontSize: "10px", fontWeight: item.path === "/" ? 700 : 500 }}>{item.label}</span>
//             </button>
//           ))}
//         </nav>

//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  primary: "#0f5238",
  onPrimary: "#ffffff",
  primaryFixed: "#b1f0ce",
  primaryFixedDim: "#95d4b3",
  onPrimaryFixed: "#002114",
  secondary: "#8e4e14",
  secondaryContainer: "#ffab69",
  onSecondaryContainer: "#783d01",
  secondaryFixed: "#ffdcc4",
  tertiary: "#004b77",
  tertiaryContainer: "#1e6396",
  surface: "#f8f9fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f3f4f5",
  surfaceContainer: "#edeeef",
  surfaceVariant: "#e1e3e4",
  onSurface: "#191c1d",
  onSurfaceVariant: "#404943",
  background: "#f8f9fa",
  onBackground: "#191c1d",
  outline: "#707973",
  outlineVariant: "#bfc9c1",
};

const Logo = () => (
  <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="48" fill={COLORS.primaryFixed} opacity="0.4"/>
    <rect x="35" y="28" width="30" height="46" rx="15" fill={COLORS.primary}/>
    <rect x="42" y="16" width="16" height="14" rx="8" fill={COLORS.primaryFixedDim}/>
    <line x1="38" y1="46" x2="46" y2="46" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="38" y1="56" x2="46" y2="56" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="38" y1="66" x2="46" y2="66" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M65 40 Q78 30 76 46 Q72 52 65 48Z" fill={COLORS.primaryFixedDim}/>
  </svg>
);

const features = [
  {
    icone: "restaurant_menu",
    titre: "Plans alimentaires locaux",
    desc: "Recettes camerounaises adaptées à l'âge de votre bébé, validées par des nutritionnistes.",
    bg: COLORS.surfaceContainer,
    color: COLORS.primary,
    iconBg: "#2d6a4f",
    iconColor: "#a8e7c5",
  },
  {
    icone: "monitoring",
    titre: "Suivi de croissance OMS",
    desc: "Visualisez l'évolution du poids et de la taille selon les normes internationales.",
    bg: "#1e6396",
    color: "#ffffff",
    iconBg: "rgba(255,255,255,0.15)",
    iconColor: "#ffffff",
  },
  {
    icone: "videocam",
    titre: "Téléconsultation 24/7",
    desc: "Accédez instantanément à des pédiatres et spécialistes, où que vous soyez.",
    bg: COLORS.secondaryFixed,
    color: COLORS.onSurface,
    iconBg: "rgba(142,78,20,0.1)",
    iconColor: COLORS.secondary,
  },
];

export default function Splash() {
  const navigate = useNavigate();
  const [estConnecte, setEstConnecte] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const utilisateur = localStorage.getItem("utilisateur");
    if (token && utilisateur) {
      setEstConnecte(true);
      // 💡 Redirection vers le module actif plutôt que vers le Dashboard commenté
      navigate("/medecin/repas"); 
    }
  }, [navigate]);

  return (
    <div style={{
      backgroundColor: "#1B3A4B",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily: "'Plus Jakarta Sans', 'Atkinson Hyperlegible Next', sans-serif",
    }}>

      {/* Conteneur format téléphone */}
      <div style={{
        width: "100%",
        maxWidth: "412px",
        minHeight: "100vh",
        backgroundColor: COLORS.background,
        borderRadius: "0",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        position: "relative",
      }}>

        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 20px", height: "64px",
          backgroundColor: "rgba(248,249,250,0.92)", backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${COLORS.outlineVariant}30`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: COLORS.primary, fontSize: "24px" }}>child_care</span>
            <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary, letterSpacing: "-0.5px" }}>
              NutriBébéCam
            </span>
          </div>
          <button
            onClick={() => navigate("/connexion")}
            style={{
              backgroundColor: COLORS.primary, color: COLORS.onPrimary,
              border: "none", borderRadius: "9999px", padding: "8px 16px",
              fontSize: "12px", fontWeight: 700, cursor: "pointer",
            }}
          >
            Connexion
          </button>
        </header>

        {/* Contenu principal */}
        <main style={{ flex: 1, paddingBottom: "80px" }}>

          {/* Hero */}
          <section style={{ padding: "32px 20px 40px", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "160px", height: "160px",
              backgroundColor: COLORS.primaryFixed, borderRadius: "50%",
              filter: "blur(40px)", opacity: 0.3, pointerEvents: "none",
            }}/>

            <div style={{ textAlign: "center" }}>
              {/* Badge */}
              <span style={{
                display: "inline-block", padding: "4px 12px", borderRadius: "9999px",
                backgroundColor: COLORS.primaryFixed, color: COLORS.onPrimaryFixed,
                fontSize: "12px", fontWeight: 700, marginBottom: "16px",
                letterSpacing: "0.05em",
              }}>
                Bienvenue chez NutriBébéCam
              </span>

              {/* Logo */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <Logo />
              </div>

              {/* Titre */}
              <h1 style={{
                fontSize: "28px", fontWeight: 800, color: COLORS.onSurface,
                lineHeight: "1.2", letterSpacing: "-0.5px", marginBottom: "12px",
                padding: "0 8px",
              }}>
                Nourrissez le futur de votre enfant
              </h1>

              {/* Description */}
              <p style={{
                fontSize: "14px", color: COLORS.onSurfaceVariant,
                lineHeight: "1.6", marginBottom: "28px", padding: "0 8px",
              }}>
                L'application tout-en-un pour des menus équilibrés et un suivi de santé
                pédiatrique en temps réel, adaptée au contexte camerounais.
              </p>

              {/* Boutons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 8px" }}>
                <button
                  onClick={() => navigate("/inscription")}
                  style={{
                    width: "100%", height: "56px",
                    backgroundColor: COLORS.primary, color: COLORS.onPrimary,
                    border: "none", borderRadius: "9999px",
                    fontSize: "15px", fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    boxShadow: "0 4px 16px rgba(15,82,56,0.3)",
                  }}
                >
                  Commencer l'aventure
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                </button>

                <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant, textAlign: "center" }}>
                  Professionnel de santé ?{" "}
                  <span
                    onClick={() => navigate("/inscription-medecin")}
                    style={{ color: COLORS.primary, fontWeight: 700, cursor: "pointer" }}
                  >
                    Inscrivez-vous ici
                    <span className="material-symbols-outlined" style={{ fontSize: "14px", verticalAlign: "middle", marginLeft: "2px" }}>
                      medical_services
                    </span>
                  </span>
                </p>
              </div>
            </div>

            {/* Carte illustration */}
            <div style={{ marginTop: "32px", position: "relative" }}>
              <div style={{
                position: "absolute", inset: "-8px",
                backgroundColor: COLORS.primaryFixed,
                borderRadius: "2rem", filter: "blur(20px)", opacity: 0.2,
              }}/>
              <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
                <img
                  alt="Parent et enfant"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgaUcRUHkqaFOiY7fbGxdxaNwTUHpIkksqBBQh-ZTJe8H6D8iEoz1dEKflaukxZlqr569gF_vWI07KmhoW84zpcRrWfWxq2kGoSFcUj4dXsI8pWCdwenF41DtxkepU_lCTy3QbyWA9-B_3o972kpvrKm-aLVJHP1YozNEQgep_WPusw7IQNk1iViVDCFaBE1ps9Vm3DgfaZg6gKWqSMocBsvX126PpkR5yyK1LVFRl0u8dLGUp_I0gdkryj3lxXwM4azU5leZbfog"
                  style={{ width: "100%", height: "260px", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", bottom: "16px", left: "16px", right: "16px",
                  backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  padding: "16px", borderRadius: "14px",
                  display: "flex", alignItems: "center", gap: "14px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}>
                  <div style={{
                    backgroundColor: COLORS.secondaryContainer, padding: "10px",
                    borderRadius: "50%", color: COLORS.onSecondaryContainer,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>restaurant</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: COLORS.onSurface, margin: 0 }}>
                      Menu du jour prêt
                    </p>
                    <p style={{ fontSize: "11px", color: COLORS.onSurfaceVariant, margin: "2px 0 0" }}>
                      Bouillie de maïs et soja
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Fonctionnalités */}
          <section style={{
            padding: "32px 20px",
            backgroundColor: COLORS.surfaceContainerLowest,
            borderTop: `1px solid ${COLORS.outlineVariant}30`,
          }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.3px" }}>
                Fonctionnalités Clés
              </h2>
              <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant, marginTop: "6px", lineHeight: "1.5" }}>
                Conçu pour simplifier votre quotidien de parent camerounais.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {features.map((f, i) => (
                <div key={i} style={{
                  backgroundColor: f.bg, padding: "20px", borderRadius: "20px",
                  display: "flex", flexDirection: "column", gap: "12px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <div style={{
                    width: "48px", height: "48px", backgroundColor: f.iconBg,
                    borderRadius: "14px", display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "24px", color: f.iconColor }}>
                      {f.icone}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: f.color, marginBottom: "4px" }}>
                      {f.titre}
                    </h3>
                    <p style={{ fontSize: "12px", color: f.color, opacity: 0.8, lineHeight: "1.5" }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{
            margin: "20px", padding: "28px 20px",
            backgroundColor: COLORS.primary, borderRadius: "24px",
            textAlign: "center", boxShadow: "0 4px 20px rgba(15,82,56,0.3)",
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: COLORS.onPrimary, marginBottom: "8px", lineHeight: "1.3" }}>
              Prêt à transformer la nutrition de votre enfant ?
            </h2>
            <p style={{ fontSize: "12px", color: COLORS.onPrimary, opacity: 0.85, marginBottom: "20px", lineHeight: "1.5" }}>
              Rejoignez des thousands de parents qui font confiance à NutriBébéCam.
            </p>
            <button
              onClick={() => navigate("/inscription")}
              style={{
                width: "100%", height: "52px",
                backgroundColor: COLORS.primaryFixed, color: COLORS.onPrimaryFixed,
                border: "none", borderRadius: "9999px",
                fontSize: "14px", fontWeight: 700, cursor: "pointer",
              }}
            >
              Commencer maintenant
            </button>
          </section>

          {/* Footer */}
          <footer style={{
            padding: "24px 20px 16px",
            backgroundColor: COLORS.surfaceContainerLow,
            borderTop: `1px solid ${COLORS.outlineVariant}20`,
            textAlign: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
              <span className="material-symbols-outlined" style={{ color: COLORS.primary, fontSize: "18px" }}>child_care</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: COLORS.primary }}>NutriBébéCam</span>
            </div>
            <p style={{ fontSize: "11px", color: COLORS.onSurfaceVariant, lineHeight: "1.5", padding: "0 16px" }}>
              Accompagner les parents camerounais dans chaque étape du développement de l'enfant.
            </p>
            <p style={{ fontSize: "10px", color: COLORS.onSurfaceVariant, opacity: 0.5, marginTop: "10px" }}>
              © 2026 NutriBébéCam · IUT Fotso Victor de Bandjoun
            </p>
          </footer>

        </main>

        {/* Navbar */}
        <nav style={{
          position: "sticky", bottom: 0, width: "100%", zIndex: 50,
          display: "flex", justifyContent: "space-around", alignItems: "center",
          padding: "10px 16px",
          backgroundColor: "rgba(248,249,250,0.95)", backdropFilter: "blur(8px)",
          borderTop: `1px solid ${COLORS.outlineVariant}30`,
          boxShadow: "0 -2px 12px rgba(0,0,0,0.05)",
        }}>
          {[
            { icone: "home", label: "Accueil", path: "/" },
            { icone: "favorite", label: "Santé", path: "/croissance" },
            { icone: "restaurant", label: "Repas", path: "/repas" },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.path)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                border: "none", background: "none", cursor: "pointer",
                color: item.path === "/" ? COLORS.primary : COLORS.onSurfaceVariant,
                padding: "4px 8px",
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{item.icone}</span>
              <span style={{ fontSize: "10px", fontWeight: item.path === "/" ? 700 : 500 }}>{item.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </div>
  );
}