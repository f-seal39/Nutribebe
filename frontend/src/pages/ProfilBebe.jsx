import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBebe } from "../services/api"; // Ton pont vers l'API Django

export default function ProfilBebe() {
  // 1. États pour l'alignement avec les champs du modèle de données Django
  const [nomComplet, setNomComplet] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [poidsNaissance, setPoidsNaissance] = useState("");
  const [tailleNaissance, setTailleNaissance] = useState("");

  // États pour la gestion de l'interface utilisateur
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Gestionnaire de soumission lié au Backend Django
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setLoading(true);

    // Payload structuré selon les attentes de l'API REST
    const payload = {
      nom_complet: nomComplet,
      date_naissance: dateNaissance,
      poids_naissance: poidsNaissance ? parseFloat(poidsNaissance) : null,
      taille_naissance: tailleNaissance ? parseFloat(tailleNaissance) : null,
    };

    try {
      const response = await createBebe(payload);
      if (response) {
        // Redirection vers le tableau de bord une fois les données enregistrées
        navigate("/dashboard");
      } else {
        setErreur("Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setErreur(Object.values(err.response.data).flat().join(" "));
      } else {
        setErreur("Impossible de joindre le serveur. Vérifiez l'état de votre API Django.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center font-sans">
      
      {/* TopAppBar */}
      <header className="w-full top-0 sticky bg-surface dark:bg-surface-dim z-50">
        <div className="flex items-center justify-between px-4 h-16 w-full max-w-[1200px] mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="hover:bg-surface-container-high dark:hover:bg-surface-variant p-2 rounded-full active:scale-95 transition-transform duration-200 flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-primary dark:text-on-surface">Profil de l'enfant</h1>
          <div className="w-10"></div> {/* Centreur optique */}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[1200px] px-4 md:px-10 pt-8 pb-32 flex flex-col items-center">
        
        {/* Hero / Section d'en-tête */}
        <section className="w-full max-w-md text-center mb-10">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-secondary-container rounded-full opacity-20 animate-pulse"></div>
            <img 
              alt="Illustration Enfant" 
              className="w-full h-full object-cover rounded-full border-4 border-surface-container-lowest shadow-sm" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2zexLM1gwqIClg1cKaqXax-V8XDiu2ACted-EXeU19EOuW8Nut-IaCcvp9c_GRW9ZiO4oukTwslIBJuy9o1m_rnzGOJYazp1AQhNJLTXl1YoMMw-lvZVe9TgBgjH6LjLEpn8DgjZXcqP8oLfkwIauW-LkQ45DNYurH3gM55XCBFINlLJjxsYer7kj7XtzzdAzhIZK8BvSO9bLkzz1UzLcsiOSoJ_MzWhBHVZZo2LdvGbfwu0kXooNfekL9pjKRIfWmJ3EtFBJskU"
            />
            <button type="button" className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:bg-primary-container transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">add_a_photo</span>
            </button>
          </div>
          <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Parlez-nous de votre enfant</h2>
          <p className="text-base text-on-surface-variant">
            Nous utiliserons ces données pour personnaliser vos conseils nutritionnels et le suivi de croissance.
          </p>
        </section>

        {/* Section Formulaire */}
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          
          {/* Message d'erreur dynamique */}
          {erreur && (
            <div className="bg-error-container text-on-error-container text-sm p-4 rounded-xl border border-error/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{erreur}</span>
            </div>
          )}

          {/* Nom Complet */}
          <div className="group">
            <label className="text-sm font-semibold text-on-surface-variant ml-1 mb-2 block" htmlFor="nom_complet">
              Nom Complet
            </label>
            <div className="relative flex items-center bg-surface-container-low rounded-xl border-b-2 border-transparent focus-within:border-primary focus-within:shadow-sm transition-all p-1">
              <div className="flex items-center justify-center w-12 text-on-surface-variant group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">person</span>
              </div>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 py-3 text-base text-on-surface placeholder:text-outline outline-none" 
                id="nom_complet"
                placeholder="Entrez le nom de l'enfant" 
                required
                type="text"
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
              />
            </div>
          </div>

          {/* Date de Naissance */}
          <div className="group">
            <label className="text-sm font-semibold text-on-surface-variant ml-1 mb-2 block" htmlFor="date_naissance">
              Date de Naissance
            </label>
            <div className="relative flex items-center bg-surface-container-low rounded-xl border-b-2 border-transparent focus-within:border-primary focus-within:shadow-sm transition-all p-1">
              <div className="flex items-center justify-center w-12 text-on-surface-variant group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">calendar_today</span>
              </div>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 py-3 text-base text-on-surface outline-none" 
                id="date_naissance"
                required
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
              />
            </div>
          </div>

          {/* Mesures physiques (Poids & Taille) */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Poids de Naissance */}
            <div className="group">
              <label className="text-sm font-semibold text-on-surface-variant ml-1 mb-2 block" htmlFor="poids_naissance">
                Poids (kg)
              </label>
              <div className="relative flex items-center bg-surface-container-low rounded-xl border-b-2 border-transparent focus-within:border-primary focus-within:shadow-sm transition-all p-1">
                <div className="flex items-center justify-center w-10 text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined">monitor_weight</span>
                </div>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 py-3 text-base text-on-surface text-center outline-none" 
                  id="poids_naissance"
                  placeholder="0.0" 
                  step="0.01" 
                  type="number"
                  value={poidsNaissance}
                  onChange={(e) => setPoidsNaissance(e.target.value)}
                />
                <span className="text-sm font-semibold text-on-surface-variant pr-4">kg</span>
              </div>
            </div>

            {/* Taille de Naissance */}
            <div className="group">
              <label className="text-sm font-semibold text-on-surface-variant ml-1 mb-2 block" htmlFor="taille_naissance">
                Taille (cm)
              </label>
              <div className="relative flex items-center bg-surface-container-low rounded-xl border-b-2 border-transparent focus-within:border-primary focus-within:shadow-sm transition-all p-1">
                <div className="flex items-center justify-center w-10 text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined">straighten</span>
                </div>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 py-3 text-base text-on-surface text-center outline-none" 
                  id="taille_naissance"
                  placeholder="0" 
                  step="0.1"
                  type="number"
                  value={tailleNaissance}
                  onChange={(e) => setTailleNaissance(e.target.value)}
                />
                <span className="text-sm font-semibold text-on-surface-variant pr-4">cm</span>
              </div>
            </div>

          </div>

          {/* Note informative UX */}
          <div className="bg-tertiary-fixed text-on-tertiary-fixed p-4 rounded-xl flex gap-3 mt-4 items-start border border-primary/10">
            <span className="material-symbols-outlined text-primary">Info</span>
            <p className="text-xs font-medium leading-relaxed">
              Ces mesures permettent de calculer précisément les courbes de croissance et d'évaluer les besoins nutritionnels spécifiques de votre bébé.
            </p>
          </div>

          {/* Bouton de soumission */}
          <button 
            className="w-full bg-primary text-on-primary py-4 rounded-full font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Enregistrement...
              </>
            ) : (
              <>
                Enregistrer et continuer
                <span className="material-symbols-outlined">chevron_right</span>
              </>
            )}
          </button>
        </form>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 bg-surface-container-lowest dark:bg-inverse-surface shadow-[0_-4px_12px_rgba(0,0,0,0.02)] z-50 rounded-t-xl">
        <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant px-4 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all active:scale-90" type="button">
          <span className="material-symbols-outlined">Home</span>
          <span className="text-xs font-medium">Accueil</span>
        </button>
        <button onClick={() => navigate("/repas")} className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant px-4 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all active:scale-90" type="button">
          <span className="material-symbols-outlined">restaurant</span>
          <span className="text-xs font-medium">Repas</span>
        </button>
        <button onClick={() => navigate("/croissance")} className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant px-4 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all active:scale-90" type="button">
          <span className="material-symbols-outlined">Monitoring</span>
          <span className="text-xs font-medium">Croissance</span>
        </button>
        <button onClick={() => navigate("/profil")} className="flex flex-col items-center justify-center bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-all" type="button">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="text-xs font-medium">Profil</span>
        </button>
      </nav>

    </div>
  );
}