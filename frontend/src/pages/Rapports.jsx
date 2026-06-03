import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRapports } from "../services/api";

export default function Rapports() {
  const navigate = useNavigate();
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRapports()
      .then((data) => {
        if (Array.isArray(data)) setRapports(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-background text-on-background pb-24 font-body-md flex flex-col">
      
      {/* TopAppBar */}
      <header className="w-full top-0 sticky bg-surface dark:bg-surface-dim z-50 border-b border-outline-variant/10">
        <div className="flex items-center px-4 h-16 gap-4 w-full">
          <button 
            onClick={() => navigate("/dashboard")}
            className="hover:bg-surface-container-high dark:hover:bg-surface-variant p-2 rounded-full active:scale-95 transition-transform duration-200 flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-primary dark:text-on-surface">
            Rapports PDF
          </h1>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-12 gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
            <p className="text-sm font-medium">Chargement des documents...</p>
          </div>
        ) : rapports.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-outline/50">description</span>
            <p className="text-base text-on-surface-variant font-medium">Aucun rapport disponible</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rapports.map((rapport, i) => (
              <div 
                key={i} 
                className="p-4 rounded-xl border border-outline-variant/20 bg-surface-container-low flex items-center gap-4 shadow-sm"
              >
                {/* Icône de type PDF / Document */}
                <div className="p-3 rounded-xl bg-error-container text-on-error-container flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                </div>
                
                {/* Métadonnées du rapport */}
                <div className="flex-grow flex flex-col gap-0.5">
                  <h3 className="font-bold text-sm text-on-surface tracking-tight leading-snug">
                    Rapport {rapport.type}
                  </h3>
                  <span className="text-[11px] font-medium text-on-surface-variant opacity-80">
                    {new Date(rapport.date_generation).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>

                {/* Bouton d'ouverture du fichier */}
                {rapport.fichier_pdf && (
                  <a 
                    href={rapport.fichier_pdf} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-primary text-on-primary font-semibold text-xs rounded-lg px-4 py-2 hover:bg-primary-container active:scale-95 transition-all shadow-sm"
                  >
                    Ouvrir
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex justify-around items-center h-20 px-2 bg-surface-container-lowest dark:bg-inverse-surface shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-50 rounded-t-xl border-t border-outline-variant/10">
        {[
          { icone: "home", label: "Accueil", path: "/dashboard" },
          { icone: "restaurant", label: "Repas", path: "/repas" },
          { icone: "monitoring", label: "Santé", path: "/croissance" },
          { icone: "medical_services", label: "Médecin", path: "/teleconsultation" },
          { icone: "person", label: "Profil", path: "/profil" },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">{item.icone}</span>
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}