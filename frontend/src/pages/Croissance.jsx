import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { obtenirMesuresCroissance } from "../services/api"; // Ton lien vers Django si disponible
import RepasModule from "../components/RepasModule";

export default function Croissance() {
  const navigate = useNavigate();
  const [periode, setPeriode] = useState("Week"); // État pour filtrer (Week, Month, Year)
  const [mesures, setMesures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à ton API Django ou simulation
    // obtenirMesuresCroissance().then(data => ... )
    setLoading(false);
  }, [periode]);

  return (
    <div className="text-on-surface bg-background min-h-screen pb-24">
      
      {/* TopAppBar */}
      <header className="w-full sticky top-0 z-40 bg-surface dark:bg-background">
        <div className="flex items-center justify-between px-4 py-2 w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <h1 className="font-headline-lg-mobile text-xl font-bold text-primary dark:text-primary-fixed-dim">NutriBébé</h1>
          </div>
          <button 
            onClick={() => navigate("/notifications")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-primary">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-4 space-y-6 max-w-4xl mx-auto">
        
        {/* Section Titre & Filtres */}
        <section>
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-on-surface-variant">Statut de santé de l'enfant</p>
              <h2 className="text-2xl font-bold text-primary headline-font">Progression de Léo</h2>
            </div>
            <div className="bg-surface-container rounded-full p-1 flex">
              {["Week", "Month", "Year"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriode(p)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    periode === p 
                      ? "bg-white shadow-sm text-primary" 
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                  type="button"
                >
                  {p === "Week" ? "Semaine" : p === "Month" ? "Mois" : "Année"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Grid - Métriques clés */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Graphique Évolution du Poids */}
          <div className="md:col-span-8 bg-white rounded-xl p-6 shadow-sm border border-surface-container-highest">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-primary headline-font">Évolution du Poids</h3>
                <p className="text-sm text-on-surface-variant">Croissance régulière sur 4 semaines</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-primary headline-font">12.4 kg</span>
                <span className="text-xs font-semibold text-surface-tint flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +0.2 kg
                </span>
              </div>
            </div>

            {/* Zone Graphique Visuel */}
            <div className="h-48 w-full relative flex items-end justify-between pt-4 chart-gradient rounded-lg">
              <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-10">
                <div className="border-t border-primary w-full"></div>
                <div className="border-t border-primary w-full"></div>
                <div className="border-t border-primary w-full"></div>
              </div>
              {/* Barres de croissance dynamiques ou simulées */}
              <div className="w-[12%] bg-primary-fixed-dim rounded-t-full h-2/3 transition-all hover:bg-primary"></div>
              <div className="w-[12%] bg-primary-fixed-dim rounded-t-full h-3/4 transition-all hover:bg-primary"></div>
              <div className="w-[12%] bg-primary-fixed-dim rounded-t-full h-[70%] transition-all hover:bg-primary"></div>
              <div className="w-[12%] bg-primary-fixed-dim rounded-t-full h-[85%] transition-all hover:bg-primary"></div>
              <div className="w-[12%] bg-primary-fixed-dim rounded-t-full h-4/5 transition-all hover:bg-primary"></div>
              <div className="w-[12%] bg-primary-fixed-dim rounded-t-full h-[95%] transition-all hover:bg-primary"></div>
              <div className="w-[12%] bg-primary rounded-t-full h-full transition-all"></div>
            </div>
            <div className="flex justify-between mt-4 text-xs text-on-surface-variant font-medium">
              <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
            </div>
          </div>

          {/* Indicateurs de Croissance à droite */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="bg-primary text-on-primary rounded-xl p-6 flex-1 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary-fixed">straighten</span>
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-[10px] uppercase font-bold">Percentile 85</span>
              </div>
              <div className="mt-4">
                <p className="text-xs opacity-80">Taille Actuelle</p>
                <h3 className="text-xl font-bold headline-font">86.4 cm</h3>
              </div>
            </div>

            <div className="bg-secondary-container text-on-secondary-container rounded-xl p-6 flex-1 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined">analytics</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Stable</span>
              </div>
              <div className="mt-4">
                <p className="text-xs opacity-80">Statut IMC</p>
                <h3 className="text-xl font-bold headline-font">Zone Normale</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Équilibre Nutritionnel (Anneaux de progression) */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-surface-container-highest">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-primary headline-font">Équilibre Nutritionnel</h3>
            <p className="text-sm text-on-surface-variant">Apports quotidiens vs Objectifs recommandés</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Protéines */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-high" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-primary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" stroke-dashoffset="62.8" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">75%</div>
              </div>
              <span className="text-xs font-semibold">Protéines</span>
            </div>
            {/* Glucides */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-high" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-secondary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" stroke-dashoffset="100.48" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">60%</div>
              </div>
              <span className="text-xs font-semibold">Glucides</span>
            </div>
            {/* Fibres */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-high" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-tertiary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" stroke-dashoffset="25.12" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">90%</div>
              </div>
              <span className="text-xs font-semibold">Fibres</span>
            </div>
            {/* Lipides */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-high" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-surface-tint" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" stroke-dashoffset="125.6" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">50%</div>
              </div>
              <span className="text-xs font-semibold">Lipides</span>
            </div>
          </div>
        </section>

        {/* Victoires Santé / Milestones */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary headline-font">Objectifs Santé Atteints</h3>
            <button className="text-primary text-xs font-bold hover:underline" type="button">Voir tout</button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            <div className="min-w-[200px] bg-tertiary-container text-on-tertiary-container p-4 rounded-xl flex flex-col gap-3 shadow-sm">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <div>
                <h4 className="text-sm font-bold">Semaine sans sucre ajouté</h4>
                <p className="text-[11px] opacity-80">Atteint il y a 2 jours</p>
              </div>
            </div>

            <div className="min-w-[200px] bg-secondary-container text-on-secondary-container p-4 rounded-xl flex flex-col gap-3 shadow-sm">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
              </div>
              <div>
                <h4 className="text-sm font-bold">IMC Idéal</h4>
                <p className="text-[11px] opacity-80">Maintenu depuis 3 mois</p>
              </div>
            </div>

            <div className="min-w-[200px] bg-primary-container text-on-primary-container p-4 rounded-xl flex flex-col gap-3 shadow-sm">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
              </div>
              <div>
                <h4 className="text-sm font-bold">Expert Légumes</h4>
                <p className="text-[11px] opacity-80">10 nouveaux légumes goûtés</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conseil Santé contextuel */}
        <section className="relative overflow-hidden rounded-xl bg-surface-container p-6 border border-outline-variant group shadow-sm">
          <div className="relative z-10 md:w-2/3">
            <h4 className="text-lg font-bold text-primary headline-font mb-2">Focus Nutriment : Le Fer</h4>
            <p className="text-sm text-on-surface-variant mb-4">Les apports en fer de Léo sont légèrement en dessous de l'objectif cette semaine. Pensez à intégrer des épinards ou des lentilles au repas de demain.</p>
            <button className="bg-primary text-on-primary px-6 py-2 rounded-full text-xs font-bold hover:shadow-lg transition-all active:scale-95" type="button">Voir les recettes</button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 md:opacity-100 group-hover:scale-110 transition-transform duration-500">
            <img alt="Healthy Green Bowl" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzeNkMpvENIYvQvvshyhWmoCi0aVyiuVXJumqwX9R8Tw9CtY32tQnZQhss1fYy_z42eV9Ad4yI-yZjdxvk9N2P5JotW0mITMf96x6JkKNbwYdVaJNCs08rFsDKzT3Qqf5yMPaaXruMLFstidoOQc41LPLEQBoXnnxRod11HKmBfjaIqzumgp-JxAAwAn9xWBMT3e5865wp8xDIR_foQFrnvkXtQklaNl3qDcQURV-Tpz-DqJbOA0_9X7P2A5SSmgbiYsLV50PSsuc"/>
          </div>
        </section>
        {/* Module Repas en bas de la page */}
        <RepasModule />
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-sm h-20">
        <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center justify-center text-on-surface-variant px-2 py-1 hover:text-primary transition-colors active:scale-90" type="button">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-semibold">Accueil</span>
        </button>
        <button onClick={() => navigate("/repas")} className="flex flex-col items-center justify-center text-on-surface-variant px-2 py-1 hover:text-primary transition-colors active:scale-90" type="button">
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="text-[10px] font-semibold">Planning</span>
        </button>
        <button onClick={() => navigate("/croissance")} className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 active:scale-90 transition-all" type="button">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
          <span className="text-[10px] font-semibold">Santé</span>
        </button>
        <button onClick={() => navigate("/teleconsultation")} className="flex flex-col items-center justify-center text-on-surface-variant px-2 py-1 hover:text-primary transition-colors active:scale-90" type="button">
          <span className="material-symbols-outlined">medical_services</span>
          <span className="text-[10px] font-semibold">Consultation</span>
        </button>
        <button onClick={() => navigate("/profil")} className="flex flex-col items-center justify-center text-on-surface-variant px-2 py-1 hover:text-primary transition-colors active:scale-90" type="button">
          <span className="material-symbols-outlined">shopping_bag</span>
          <span className="text-[10px] font-semibold">Boutique</span>
        </button>
      </nav>
    </div>
  );
}