import React, { useState, useEffect } from "react";
// import { api } from "../services/api";
import BottomNavBar from "../components/BottomNavBar";
// Dans src/pages/Teleconsultation.jsx
import * as api from "../services/api"; // Note le "* as api"

export default function Teleconsultation() {
  // --- ÉTATS CONNECTÉS AU BACKEND ---
  const [consultations, setConsultations] = useState([]);
  const [consultationImminente, setConsultationImminente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // État du formulaire d'enregistrement de consultation
  const [formData, setFormData] = useState({
    medecin: "",
    specialite: "Pédiatre",
    date_consultation: "",
    heure_consultation: "",
    motif: "",
    notes: ""
  });

  // --- CHARGEMENT DES DONNÉES DEPUIS DJANGO ---
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await api.getConsultations();
        
        // Séparation : une session en direct (ex: statut "En Cours" ou à moins de 5 min)
        // et le reste de l'historique ou des rendez-vous programmés
        const enDirect = data.find(c => c.statut?.toLowerCase() === "en cours" || c.is_live);
        if (enDirect) setConsultationImminente(enDirect);

        setConsultations(data);
      } catch (error) {
        console.error("Erreur de synchronisation avec le backend médical :", error);
        
        // Données de secours (Mock) respectant fidèlement le visuel Stitch fourni
        setConsultations([
          {
            id: 101,
            medecin: "Sarah Jenkins, RD",
            specialite: "Nutritionniste",
            date_consultation: "2026-10-12",
            heure_consultation: "10:30",
            motif: "Weekly Meal Audit",
            statut: "Confirmé"
          },
          {
            id: 102,
            medecin: "Dr. Michael Chen",
            specialite: "Pédiatre",
            date_consultation: "2026-10-15",
            heure_consultation: "14:00",
            motif: "Allergy Consultation",
            statut: "Programmé"
          },
          {
            id: 103,
            medecin: "Dr. Aris Thorne",
            specialite: "Pédiatre Nutritionniste",
            date_consultation: "2026-05-28",
            heure_consultation: "09:00",
            motif: "Growth Milestone Review",
            notes: "L'enfant montre d'excellents progrès avec les aliments solides. Suggérer d'augmenter les purées riches en fer...",
            statut: "Terminé"
          }
        ]);

        // Simulation du salon virtuel Stitch
        setConsultationImminente({
          id: 999,
          medecin: "Dr. Aris Thorne",
          specialite: "Pédiatre Nutritionniste",
          motif: "Consultation d'urgence - Suivi",
          temps_restant: "5 mins"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  // --- TRAITEMENT DU FORMULAIRE ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Préparation de l'objet pour l'API Django rest_framework
      const nouveauRdv = {
        medecin: formData.medecin,
        specialite: formData.specialite,
        date_consultation: formData.date_consultation,
        heure_consultation: formData.heure_consultation,
        motif: formData.motif,
        notes: formData.notes,
        statut: "En attente"
      };

      const response = await api.createConsultation(nouveauRdv);
      setConsultations((prev) => [response, ...prev]);
      setShowForm(false);
      setFormData({ medecin: "", specialite: "Pédiatre", date_consultation: "", heure_consultation: "", motif: "", notes: "" });
    } catch (error) {
      console.error("Erreur lors de la création de la consultation :", error);
    }
  };

  // Formatage des étiquettes de mois pour les cartes d'agenda
  const obtenirMoisCourt = (dateStr) => {
    if (!dateStr) return "RDV";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleString("fr-FR", { month: "short" }).toUpperCase().replace(".", "");
  };

  const obtenirJourNum = (dateStr) => {
    if (!dateStr) return "--";
    const dateObj = new Date(dateStr);
    return dateObj.getDate();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-primary">
        <div className="text-center">
          <h2 className="text-headline-xl font-bold animate-pulse">NutriParent</h2>
          <p className="text-on-surface-variant text-label-md">Chargement de l'espace téléconsultation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen mb-24">
      
      {/* TopAppBar */}
      <header className="w-full sticky top-0 z-40 bg-surface border-b border-outline-variant/30 px-margin-mobile py-stack-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
            <img 
              alt="Profil Parent" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=200&h=200&q=80" 
            />
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">NutriParent</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      <main className="max-w-[700px] mx-auto px-margin-mobile pb-16">
        
        {/* Salon en direct / Lien Immédiat (Stitch Card) */}
        {consultationImminente && (
          <section className="mt-stack-md">
            <div className="relative overflow-hidden rounded-xl bg-primary text-on-primary p-6 shadow-sm transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2 h-2 bg-secondary-container rounded-full animate-pulse"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider">En direct</span>
                </div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile mb-1">{consultationImminente.medecin}</h2>
                <p className="font-body-md text-on-primary-container opacity-90 mb-4">
                  {consultationImminente.specialite} • Commence dans {consultationImminente.temps_restant || "quelques instants"}
                </p>
                <button className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-label-md transition-transform active:scale-95 shadow-sm font-bold">
                  <span className="material-symbols-outlined text-[20px]">video_chat</span>
                  Rejoindre le salon virtuel
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Formulaire M3 escamotable via le bouton d'ajout (FAB) */}
        {showForm && (
          <section className="mt-stack-lg bg-white p-6 rounded-xl border border-outline-variant shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-label-md text-base text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">event_note</span>
                Enregistrer une consultation
              </h3>
              <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-md text-on-surface-variant mb-1">Médecin / Spécialiste</label>
                  <input 
                    type="text" required name="medecin" value={formData.medecin} onChange={handleChange} placeholder="Dr. Kamga"
                    className="w-full rounded-xl border-outline-variant text-sm p-3 bg-surface focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-md text-on-surface-variant mb-1">Spécialité</label>
                  <select 
                    name="specialite" value={formData.specialite} onChange={handleChange}
                    className="w-full rounded-xl border-outline-variant text-sm p-3 bg-surface focus:border-primary focus:ring-primary"
                  >
                    <option value="Pédiatre">Pédiatre</option>
                    <option value="Nutritionniste">Nutritionniste</option>
                    <option value="Généraliste">Généraliste</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-md text-on-surface-variant mb-1">Date</label>
                  <input 
                    type="date" required name="date_consultation" value={formData.date_consultation} onChange={handleChange}
                    className="w-full rounded-xl border-outline-variant text-sm p-3 bg-surface focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-md text-on-surface-variant mb-1">Heure</label>
                  <input 
                    type="time" required name="heure_consultation" value={formData.heure_consultation} onChange={handleChange}
                    className="w-full rounded-xl border-outline-variant text-sm p-3 bg-surface focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-md text-on-surface-variant mb-1">Motif du rendez-vous</label>
                <input 
                  type="text" required name="motif" value={formData.motif} onChange={handleChange} placeholder="Ex: Évaluation de croissance, coliques..."
                  className="w-full rounded-xl border-outline-variant text-sm p-3 bg-surface focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-label-md text-on-surface-variant mb-1">Notes ou remarques</label>
                <textarea 
                  name="notes" rows="2" value={formData.notes} onChange={handleChange} placeholder="Détails à transmettre au médecin..."
                  className="w-full rounded-xl border-outline-variant text-sm p-3 bg-surface focus:border-primary focus:ring-primary"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md font-bold transition-transform active:scale-95 shadow-sm">
                Confirmer l'enregistrement
              </button>
            </form>
          </section>
        )}

        {/* Prochains Rendez-vous (Filtrés sur les statuts actifs) */}
        <section className="mt-stack-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">À venir</h3>
            <span className="text-xs bg-primary-fixed text-on-primary-fixed-variant px-2.5 py-1 rounded-full font-label-sm font-semibold">
              Agenda connecté
            </span>
          </div>

          <div className="space-y-4">
            {consultations.filter(c => c.statut !== "Terminé").map((c) => (
              <div 
                key={c.id} 
                className="bg-surface-container-lowest rounded-xl p-4 flex gap-4 items-center border border-outline-variant/30 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="w-14 h-14 rounded-lg bg-tertiary-fixed flex flex-col items-center justify-center text-on-tertiary-fixed flex-shrink-0">
                  <span className="font-label-sm text-[11px] font-bold">{obtenirMoisCourt(c.date_consultation)}</span>
                  <span className="font-headline-lg text-headline-lg font-bold leading-none">{obtenirJourNum(c.date_consultation)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-label-md text-label-md text-on-surface truncate">{c.motif}</h4>
                  <p className="font-body-md text-on-surface-variant text-sm truncate">{c.medecin} • <span className="italic text-xs">{c.specialite}</span></p>
                </div>
                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <p className="font-label-sm text-label-sm text-primary font-bold">{c.heure_consultation || "Placée"}</p>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">arrow_forward_ios</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Historique & Comptes-rendus (Consultations passées) */}
        <section className="mt-stack-lg">
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface mb-4">Sessions passées</h3>
          <div className="grid grid-cols-1 gap-4">
            
            {consultations.filter(c => c.statut === "Terminé").map((c) => (
              <div key={c.id} className="bg-surface-container-low rounded-xl p-5 relative overflow-hidden border border-outline-variant/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full text-xs font-label-sm mb-2 inline-block font-bold">
                      {c.date_consultation}
                    </span>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">{c.motif}</h4>
                    <p className="text-sm text-on-surface-variant">{c.medecin}</p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  </div>
                </div>
                
                {c.notes && (
                  <div className="bg-white/50 rounded-lg p-3 border border-outline-variant/20">
                    <p className="text-sm text-on-surface-variant italic">"{c.notes}"</p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 py-2 bg-surface-container-highest hover:bg-outline-variant/40 rounded-lg text-xs font-label-md transition-colors">
                    Notes cliniques
                  </button>
                  <button className="flex-1 py-2 bg-surface-container-highest hover:bg-outline-variant/40 rounded-lg text-xs font-label-md transition-colors flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-xs">download</span> PDF
                  </button>
                </div>
              </div>
            ))}

            {/* Document / Guide Pédiatrique Fixe de Stitch */}
            <div className="bg-tertiary-container text-on-tertiary-container rounded-xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div>
                  <p className="text-xs font-label-sm uppercase tracking-tighter opacity-80 font-bold">Ressource pédiatrique</p>
                  <h4 className="font-label-md text-label-md font-bold">Guide des portions de l'enfant</h4>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>

          </div>
        </section>
      </main>

      {/* Floating Action Button (FAB) pour ouvrir le formulaire */}
      <button 
        onClick={() => setShowForm(!showForm)}
        className="fixed right-6 bottom-24 w-14 h-14 bg-secondary-container text-on-secondary-container rounded-full shadow-lg flex items-center justify-center z-40 active:scale-90 transition-all"
        style={{ transform: showForm ? "rotate(45deg)" : "none" }}
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Barre de navigation basse partagée */}
      <BottomNavBar />
    </div>
  );
}