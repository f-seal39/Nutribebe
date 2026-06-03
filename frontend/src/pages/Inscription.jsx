import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { inscription } from "../services/api";

export default function Inscription() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [etape, setEtape] = useState(1);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);

  const [form, setForm] = useState({
    nom_complet: "",
    telephone: "",
    password: "",
    region: "",
    adresse: "",
    profession: "",
    role: "parent",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSuivant = (e) => {
    e.preventDefault();
    if (!form.nom_complet || !form.telephone || !form.password) {
      setErreur("Veuillez remplir tous les champs.");
      return;
    }
    setErreur("");
    setEtape(2);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setChargement(true);
  //   setErreur("");
  //   const payload = {
  //     username: form.telephone,
  //     first_name: form.nom_complet.split(" ")[0],
  //     last_name: form.nom_complet.split(" ").slice(1).join(" "),
  //     telephone: form.telephone,
  //     password: form.password,
  //     role: "parent",
  //   };
  //   const data = await inscription(payload);
  //   if (data.token) {
  //     await login(form.telephone, form.password);
  //     navigate("/profil-bebe");
  //   } else {
  //     setErreur("Une erreur est survenue. Vérifiez vos informations.");
  //   }
  //   setChargement(false);
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur("");
    
    const payload = {
      username: form.telephone,
      first_name: form.nom_complet.split(" ")[0],
      last_name: form.nom_complet.split(" ").slice(1).join(" "),
      telephone: form.telephone,
      password: form.password,
      role: "parent",
      ville: form.adresse, // Optionnel : transmet la ville au serializer
    };

    try {
      const data = await inscription(payload);
      if (data.token) {
        await login(form.telephone, form.password);
        navigate("/profil-bebe");
      } else {
        setErreur("Une erreur est survenue. Vérifiez vos informations.");
      }
    } catch (err) {

      console.log("Erreurs reçues du serveur :", err);

      if (err.email) {
        setErreur(err.email[0] || err.email);
      } else if (err.telephone || err.username) {
        setErreur("Ce numéro de téléphone est déjà utilisé pour un autre compte.");
      } else {
        setErreur("Une erreur est survenue lors de la création du compte.");
      }
      // Récupère l'erreur renvoyée par api.js (ex: username existant)
    //   if (err.username) {
    //     setErreur("Ce numéro de téléphone est déjà utilisé pour un compte.");
    //   } else {
    //     setErreur("Erreur lors de l'inscription. Veuillez réessayer.");
    //   }
    } finally {
      setChargement(false);


    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.header}>
          <span style={styles.retour}
            onClick={() => etape === 1 ? navigate("/") : setEtape(1)}>
            ← Retour
          </span>
          <span style={styles.etapeTexte}>Étape {etape} / 2</span>
        </div>

        <div style={styles.progressBar}>
          <div style={{ ...styles.progress, width: etape === 1 ? "50%" : "100%" }} />
        </div>

        <h2 style={styles.titre}>
          {etape === 1 ? "👋 Bienvenue !" : "📍 Votre localisation"}
        </h2>
        <p style={styles.sousTitre}>
          {etape === 1
            ? "Créez votre compte en quelques secondes"
            : "Ces informations personnalisent votre expérience"}
        </p>

        {erreur && <p style={styles.erreur}>{erreur}</p>}

        {etape === 1 && (
          <form onSubmit={handleSuivant}>
            <div style={styles.champ}>
              <label style={styles.label}>Nom complet</label>
              <input style={styles.input} type="text" name="nom_complet"
                value={form.nom_complet} onChange={handleChange}
                placeholder="Ex: Marie Kamga" required />
            </div>

            <div style={styles.champ}>
              <label style={styles.label}>Numéro de téléphone</label>
              <div style={styles.telWrapper}>
                <span style={styles.indicatif}>🇨🇲 +237</span>
                <input style={styles.inputTel} type="tel" name="telephone"
                  value={form.telephone} onChange={handleChange}
                  placeholder="6XX XXX XXX" required />
              </div>
              <p style={styles.aide}>Ce numéro servira à vous identifier</p>
            </div>

            <div style={styles.champ}>
              <label style={styles.label}>Mot de passe</label>
              <div style={styles.passwordWrapper}>
                <input style={styles.inputPassword}
                  type={voirMotDePasse ? "text" : "password"}
                  name="password" value={form.password}
                  onChange={handleChange}
                  placeholder="Choisissez un mot de passe" required />
                <span style={styles.oeil}
                  onClick={() => setVoirMotDePasse(!voirMotDePasse)}>
                  {voirMotDePasse ? "🙈" : "👁️"}
                </span>
              </div>
              <p style={styles.aide}>Vous n'aurez plus besoin de le saisir après</p>
            </div>

            <button style={styles.bouton} type="submit">Suivant →</button>
          </form>
        )}

        {etape === 2 && (
          <form onSubmit={handleSubmit}>
            {[
              { label: "Région", name: "region", placeholder: "Ex: Ouest, Centre..." },
              { label: "Quartier / Ville", name: "adresse", placeholder: "Ex: Akwa, Douala" },
              { label: "Profession (optionnel)", name: "profession", placeholder: "Ex: Commerçante..." },
            ].map((champ) => (
              <div key={champ.name} style={styles.champ}>
                <label style={styles.label}>{champ.label}</label>
                <input style={styles.input} type="text" name={champ.name}
                  value={form[champ.name]} onChange={handleChange}
                  placeholder={champ.placeholder} />
              </div>
            ))}
            <button
              style={chargement ? styles.boutonDisabled : styles.bouton}
              type="submit" disabled={chargement}>
              {chargement ? "Création du compte..." : "Créer mon compte 🎉"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh", backgroundColor: "#1B3A4B",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
  },
  card: {
    backgroundColor: "#fff", padding: "1.5rem", borderRadius: "20px",
    width: "100%", maxWidth: "420px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem",
  },
  retour: { color: "#4CAF82", cursor: "pointer", fontSize: "14px", fontWeight: "bold" },
  etapeTexte: { color: "#5A7A8A", fontSize: "13px" },
  progressBar: { backgroundColor: "#EAF6F0", borderRadius: "10px", height: "6px", marginBottom: "1.5rem" },
  progress: { backgroundColor: "#4CAF82", height: "6px", borderRadius: "10px", transition: "width 0.4s ease" },
  titre: { color: "#1B3A4B", fontSize: "1.4rem", marginBottom: "0.3rem" },
  sousTitre: { color: "#5A7A8A", fontSize: "13px", marginBottom: "1.5rem" },
  champ: { marginBottom: "1.2rem" },
  label: { display: "block", marginBottom: "0.4rem", color: "#1B3A4B", fontWeight: "bold", fontSize: "13px" },
  input: {
    width: "100%", padding: "0.8rem", borderRadius: "10px",
    border: "1.5px solid #e0e0e0", fontSize: "14px", boxSizing: "border-box", outline: "none",
  },
  telWrapper: { display: "flex", alignItems: "center", border: "1.5px solid #e0e0e0", borderRadius: "10px", overflow: "hidden" },
  indicatif: { padding: "0.8rem", backgroundColor: "#EAF6F0", color: "#1B3A4B", fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap" },
  inputTel: { flex: 1, padding: "0.8rem", border: "none", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  passwordWrapper: { display: "flex", alignItems: "center", border: "1.5px solid #e0e0e0", borderRadius: "10px", overflow: "hidden" },
  inputPassword: { flex: 1, padding: "0.8rem", border: "none", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  oeil: { padding: "0.8rem", cursor: "pointer", fontSize: "1.1rem", backgroundColor: "#fff" },
  aide: { color: "#5A7A8A", fontSize: "11px", marginTop: "0.4rem" },
  bouton: {
    width: "100%", padding: "1rem", backgroundColor: "#4CAF82", color: "#fff",
    border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "bold",
    cursor: "pointer", marginTop: "0.5rem",
  },
  boutonDisabled: {
    width: "100%", padding: "1rem", backgroundColor: "#aaa", color: "#fff",
    border: "none", borderRadius: "12px", fontSize: "1rem", cursor: "not-allowed", marginTop: "0.5rem",
  },
  erreur: {
    color: "#e53e3e", fontSize: "13px", textAlign: "center", marginBottom: "1rem",
    backgroundColor: "#FFF5F5", padding: "0.6rem", borderRadius: "8px",
  },
};