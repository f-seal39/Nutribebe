import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import BottomNavBar from "../components/BottomNavBar";

export default function Dashboard() {
  // --- ÉTATS PARAMÉTRÉS SUR LE BACKEND DJANGO ---
  const [bebe, setBebe] = useState(null);
  const [repasProgrammes, setRepasProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Indicateurs de santé et nutrition (statiques ou calculés)
  const [metrics] = useState({
    healthScore: 85,
    caloriesCurrent: 1120,
    caloriesGoal: 1400,
    protein: "38g",
    fiber: "16g"
  });

  const [dashOffset, setDashOffset] = useState(364.4);

  // --- CHARGEMENT DES DONNÉES VIA LE SERVICE API ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Récupération du profil du bébé (Module M2 — profil)
        const bebesData = await api.getBebes();
        if (bebesData && bebesData.length > 0) {
          setBebe(bebesData[0]); // On prend le premier bébé lié au compte parent
        }

        // 2. Récupération des repas planifiés aujourd'hui par l'admin (Module M3 — nutrition)
        const repasData = await api.getRepasProgrammesAujourdhui();
        // Tri chronologique selon l'heure programmée
        const sortedRepas = repasData.sort((a, b) => a.heure.localeCompare(b.heure));
        setRepasProgrammes(sortedRepas);
      } catch (error) {
        console.error("Erreur lors du chargement du Dashboard :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  

  // Animation de la jauge nutritionnelle circulaire
  useEffect(() => {
    if (!loading) {
      const targetOffset = 364.4 - (364.4 * metrics.healthScore) / 100;
      const timer = setTimeout(() => setDashOffset(targetOffset), 150);
      return () => clearTimeout(timer);
    }
  }, [loading, metrics.healthScore]);

  // --- ACTION : BASCULER L'ALARME DU REPAS (Lecture/Écriture légère autorisée au parent) ---
  const handleAlarmToggle = async (id) => {
    try {
      const data = await api.toggleAlarmeRepas(id);
      // Synchronisation immédiate de l'état de l'alarme renvoyé par Django
      setRepasProgrammes(prev =>
        prev.map(item => item.id === id ? { ...item, active_alarm: data.active_alarm } : item)
      );
    } catch (error) {
      console.error("Erreur lors de la modification de l'alarme :", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-primary p-6">
        <div className="text-center">
          <h2 className="text-headline-xl font-bold animate-pulse">NutriBébé</h2>
          {/* <p className="text-on-surface-variant text-label-md">Synchronisation avec le serveur Django...</p> */}
        </div>
      </div>
    );
  }

  // Identification du prochain repas à afficher en vedette
  const heureActuelle = new Date().toTimeString().split(' ')[0];
  const prochainRepas = repasProgrammes.find(item => item.heure >= heureActuelle) || repasProgrammes[0];

  return (
    <div className="max-w-[1200px] mx-auto min-h-screen bg-background text-on-background">
      
      {/* TopAppBar de Stitch avec la vraie photo du bébé */}
      <header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur flex items-center justify-between px-margin-mobile py-stack-sm border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden ring-2 ring-primary/10">
            <img 
              alt="Profil Bébé" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=200&h=200&q=80" 
            />
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">NutriBébé</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined text-primary">Notifications</span>
        </button>
      </header>

      <main className="px-margin-mobile pt-stack-md">
        
        {/* Section de bienvenue */}
        <section className="mb-stack-sm">
          <p className="text-on-surface-variant font-label-md text-label-md">Espace Parent</p>
          <h2 className="font-headline-xl text-headline-xl text-primary">
            Le suivi de <span className="underline decoration-secondary-container">{bebe?.nom || "votre bébé"}</span> est à jour
          </h2>
        </section>

        {/* Bento Grid des indicateurs nutritionnels du jour */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-md">
          
          {/* Jauge Circulaire de Score Nutritionnel */}
          <div className="md:col-span-5 bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-label-md font-bold text-on-surface-variant mb-4">Indice Nutritionnel du jour</h3>
            <div className="flex items-center justify-center relative h-32 w-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-gray-100" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                <circle 
                  className="text-primary rounded-full" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"
                  strokeDasharray="364.4" 
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 1s ease-out" }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-lg text-headline-lg text-on-surface">{metrics.healthScore}%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Objectif</span>
              </div>
            </div>
          </div>

          {/* Énergie & Macro-nutriments */}
          <div className="md:col-span-7 flex flex-col justify-between gap-3">
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant font-label-sm text-label-sm">Énergie validée par l'admin</p>
                <p className="font-headline-xl text-2xl text-primary font-bold mt-1">
                  {metrics.caloriesCurrent} <span className="text-label-md text-on-surface-variant font-normal">/ {metrics.caloriesGoal} kcal</span>
                </p>
              </div>
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-fixed text-on-primary-fixed-variant p-4 rounded-xl">
                <p className="text-label-sm font-medium opacity-80">Protéines</p>
                <p className="text-xl font-bold mt-1">{metrics.protein}</p>
              </div>
              <div className="bg-secondary-fixed text-on-secondary-fixed-variant p-4 rounded-xl">
                <p className="text-label-sm font-medium opacity-80">Fibres alimentaires</p>
                <p className="text-xl font-bold mt-1">{metrics.fiber}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Prochain Repas en Vedette */}
        {prochainRepas && (
          <section className="mb-stack-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-headline-lg text-lg font-bold text-primary">Prochain repas planifié</h3>
              <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-xs font-bold">
                À {prochainRepas.heure.substring(0, 5)}
              </span>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden border border-outline-variant flex flex-col sm:flex-row shadow-sm">
              <div className="sm:w-44 h-44 sm:h-auto relative bg-gray-100">
                <img 
                  className="w-full h-full object-cover" 
                  alt={prochainRepas.repas.nom} 
                  src={prochainRepas.repas.image || "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=200&h=200&q=80"} 
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-headline-lg-mobile text-on-surface font-bold text-lg">{prochainRepas.repas.nom}</h4>
                    <span className="text-sm font-bold text-secondary">{prochainRepas.repas.cout_estime_fcfa} FCFA</span>
                  </div>
                  <p className="text-body-md text-sm text-on-surface-variant line-clamp-2">
                    {prochainRepas.repas.description || "Recette préparée sur mesure pour les besoins nutritionnels de votre enfant."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Liste complète du programme du jour (Lecture seule avec rappels programmables) */}
        <section className="mb-8">
          <h3 className="font-headline-lg text-lg font-bold text-primary mb-3">Programme Alimentaire Global</h3>
          <div className="space-y-3">
            {repasProgrammes.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-outline-variant flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed/30 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">restaurant</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{item.repas.nom}</p>
                    <p className="text-xs text-on-surface-variant">
                      Prévu à {item.heure.substring(0, 5)} — <span className="font-semibold">{item.repas.cout_estime_fcfa} FCFA</span>
                    </p>
                  </div>
                </div>

                {/* Switcher pour activer/désactiver l'alarme de rappel du repas */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={item.active_alarm} 
                    onChange={() => handleAlarmToggle(item.id)} 
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}

            {repasProgrammes.length === 0 && (
              <div className="text-center p-8 bg-white rounded-xl border border-outline-variant border-dashed">
                <p className="text-on-surface-variant font-body-md italic text-sm">
                  Aucun menu n'a encore été programmé par l'administrateur pour aujourd'hui.
                </p>
              </div>
            )}
          </div>
        </section>

      </main>

      <BottomNavBar />
    </div>
  );
}