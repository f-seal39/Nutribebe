import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../services/api";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then((data) => {
      if (Array.isArray(data)) setNotifications(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  // Mappage des icônes selon le type enregistré en base de données
  const icones = {
    rappel_repas: "restaurant",
    rappel_rdv: "calendar_month",
    anomalie_croissance: "warning",
    message: "chat",
    invitation: "mail",
  };

  // Mappage des couleurs d'accompagnement Tailwind (Material Design 3)
  const classesCouleurs = {
    rappel_repas: "bg-[#b1f0ce]/20 text-[#0f5238] border-[#b1f0ce]/40",
    rappel_rdv: "bg-[#cee5ff]/30 text-[#004b77] border-[#cee5ff]/50",
    anomalie_croissance: "bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]",
    message: "bg-[#edeeef] text-[#191c1d] border-[#bfc9c1]",
    invitation: "bg-[#ffdcc4]/30 text-[#8e4e14] border-[#ffdcc4]/50",
  };

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
            Notifications
          </h1>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-12 gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
            <p className="text-sm font-medium">Chargement des alertes...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-outline/50">notifications_off</span>
            <p className="text-base text-on-surface-variant font-medium">Aucune notification pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl border flex gap-4 items-start transition-all ${
                  classesCouleurs[notif.type] || "bg-surface-container-low border-outline-variant/20"
                } ${notif.lu ? "opacity-50 grayscale-[20%]" : "shadow-sm"}`}
              >
                {/* Icône du type d'alerte */}
                <div className="p-2 rounded-full bg-surface-container-lowest/80 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-xl">
                    {icones[notif.type] || "notifications"}
                  </span>
                </div>
                
                {/* Corps de la notification */}
                <div className="flex-grow flex flex-col gap-1">
                  <h3 className="font-bold text-sm tracking-tight leading-snug">
                    {notif.titre}
                  </h3>
                  <p className="text-xs leading-relaxed opacity-90">
                    {notif.contenu}
                  </p>
                  <span className="text-[10px] font-semibold opacity-60 mt-1 block">
                    {new Date(notif.date_envoi).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>

                {/* Pastille de non-lecture */}
                {!notif.lu && (
                  <span className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 mt-1 animate-pulse" />
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
        ].map((item, i) => {
          // Utilisation du chemin courant (ici cette page correspond logiquement aux notifications, 
          // ou on peut vérifier si l'item correspond à l'élément actif)
          const isCurrent = item.path === "/notifications"; 
          
          return (
            <button 
              key={i} 
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-full transition-all active:scale-95 ${
                isCurrent 
                  ? "text-primary font-bold" 
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-xl">{item.icone}</span>
              <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}