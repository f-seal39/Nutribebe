import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import BottomNavBar from "../components/BottomNavBar";

export default function Repas() {
  // --- ÉTATS CONNECTÉS À VOTRE BACKEND DJANGO ---
  const [repasListe, setRepasListe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jourSelectionne, setJourSelectionne] = useState(13); // Jour actif du calendrier

  // --- CHARGEMENT DU CATALOGUE DE REPAS ---
  useEffect(() => {
    const fetchRepasData = async () => {
      try {
        const data = await api.getRepas();
        setRepasListe(data);
      } catch (error) {
        console.error("Erreur de récupération du catalogue de repas :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepasData();
  }, []);

  // Gestion de l'interaction des favoris (Mise à jour locale de l'état)
  const handleToggleFavori = (id) => {
    setRepasListe((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_favori: !item.is_favori } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-primary p-6">
        <div className="text-center">
          <h2 className="text-headline-xl font-bold animate-pulse">NutriBébé</h2>
          <p className="text-on-surface-variant text-label-md">Chargement du catalogue de nutrition...</p>
        </div>
      </div>
    );
  }

  // Jours du calendrier horizontal Stitch
  const joursCalendrier = [
    { nom: "LUN", num: 12 },
    { nom: "MAR", num: 13 },
    { nom: "MER", num: 14 },
    { nom: "JEU", num: 15 },
    { nom: "VEN", num: 16 },
    { nom: "SAM", num: 17 },
    { nom: "DIM", num: 18 },
  ];

  return (
    <div className="bg-background text-on-background font-body-md antialiased mb-24 min-h-screen">
      
      {/* TopAppBar */}
      <header className="w-full sticky top-0 z-40 bg-surface flex items-center justify-between px-margin-mobile py-stack-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden ring-2 ring-primary/10">
            <img 
              alt="Profil Parent" 
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

      <main className="max-w-[900px] mx-auto px-margin-mobile">
        
        {/* En-tête de la page */}
        <section className="pt-stack-md pb-stack-sm">
          <div className="flex items-end justify-between mb-stack-sm">
            <div>
              <p className="text-on-surface-variant font-label-md text-label-md">Planning Hebdomadaire</p>
              <h2 className="font-headline-xl text-headline-xl text-primary">Menu Planner</h2>
            </div>
            <button className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 shadow-sm active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">auto_fix</span>
              Générer un menu
            </button>
          </div>
        </section>

        {/* Vue Calendrier Hebdomadaire (Horizontal) */}
        <section className="mb-stack-lg">
          <div className="flex overflow-x-auto no-scrollbar snap-x-mandatory gap-3 py-1">
            {joursCalendrier.map((jour) => {
              const estActif = jourSelectionne === jour.num;
              return (
                <button
                  key={jour.num}
                  onClick={() => setJourSelectionne(jour.num)}
                  className={`flex-shrink-0 w-16 h-24 flex flex-col items-center justify-center rounded-2xl snap-center transition-all ${
                    estActif
                      ? "bg-primary text-on-primary shadow-lg border-2 border-primary-container scale-105"
                      : "bg-surface-container-highest text-on-surface-variant border border-transparent hover:border-outline-variant"
                  }`}
                >
                  <span className="font-label-sm text-label-sm">{jour.nom}</span>
                  <span className="font-headline-lg text-headline-lg">{jour.num}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Astuce Légère / Conseil en haut du flux */}
        <div className="bg-primary-container text-on-primary-container p-4 rounded-xl mb-stack-md flex items-center gap-3">
          <span className="material-symbols-outlined flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          <p className="text-sm font-body-md opacity-90">
            Voici les repas disponibles pour composer ou suivre l'alimentation de votre enfant aujourd'hui.
          </p>
        </div>

        {/* Flux Central des Cartes de Repas (Prend toute la largeur disponible) */}
        <section className="space-y-gutter">
          {repasListe.map((repas) => (
            <div 
              key={repas.id} 
              className="bg-white rounded-xl overflow-hidden border border-outline-variant flex flex-col sm:flex-row shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow"
            >
              {/* Image & Type de repas */}
              <div className="sm:w-48 h-48 sm:h-auto relative bg-surface-container flex-shrink-0">
                <img 
                  alt={repas.nom} 
                  className="w-full h-full object-cover" 
                  src={repas.image || "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=200&h=200&q=80"} 
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-label-sm font-label-sm text-primary flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">
                    {repas.type_repas?.toLowerCase() === "breakfast" ? "wb_sunny" : repas.type_repas?.toLowerCase() === "lunch" ? "lunch_dining" : "dinner_dining"}
                  </span>
                  {repas.type_repas || "Repas"}
                </div>
              </div>

              {/* Contenu textuel et détails */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">{repas.nom}</h4>
                    <button 
                      onClick={() => handleToggleFavori(repas.id)}
                      className="focus:outline-none"
                    >
                      <span 
                        className={`material-symbols-outlined transition-colors ${repas.is_favori ? "text-error" : "text-on-surface-variant"}`}
                        style={{ fontVariationSettings: repas.is_favori ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                  <p className="text-body-md font-body-md text-on-surface-variant mb-4">
                    {repas.description || "Aucune description fournie pour cette recette."}
                  </p>
                </div>

                {/* Temps de préparation et Coût en FCFA */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-50">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-surface-container-high px-3 py-1 rounded-full text-label-sm font-label-sm text-on-surface-variant">
                      {repas.temps_preparation || "20"} min
                    </span>
                    <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full text-label-sm font-label-sm font-bold">
                      {repas.cout_estime_fcfa} FCFA
                    </span>
                  </div>
                  <span className="text-xs text-outline-variant font-mono">#{repas.id}</span>
                </div>
              </div>
            </div>
          ))}

          {/* État si la base de données ne renvoie rien */}
          {repasListe.length === 0 && (
            <div className="text-center p-12 bg-white rounded-xl border border-outline-variant border-dashed">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">restaurant_menu</span>
              <p className="text-on-surface-variant font-body-md italic">Aucun repas disponible dans la base de données.</p>
            </div>
          )}
        </section>
      </main>

      {/* Barre de navigation basse */}
      <BottomNavBar />
    </div>
  );
}