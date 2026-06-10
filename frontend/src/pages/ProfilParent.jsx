import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { COLORS } from "../constants/colors";
import { ArrowLeft, User, Phone, Mail, Briefcase, MapPin, Save, Edit2 } from "lucide-react";

export default function ProfilParent() {
  const navigate = useNavigate();
  const { utilisateur, setUtilisateur } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    telephone: "",
    email: "",
    profession: "",
    adresse: "",
    region: "",
  });

  useEffect(() => {
    if (utilisateur) {
      setForm({
        first_name: utilisateur.first_name || "",
        last_name: utilisateur.last_name || "",
        telephone: utilisateur.telephone || "",
        email: utilisateur.email || "",
        profession: utilisateur.profession || "",
        adresse: utilisateur.adresse || "",
        region: utilisateur.region || "",
      });
    }
  }, [utilisateur]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     try {
//       // Mettre à jour l'utilisateur via l'API (endpoint à créer ou utiliser profil/me)
//       const response = await api.patch("profil/parents/me/", {
//         first_name: form.first_name,
//         last_name: form.last_name,
//         telephone: form.telephone,
//         email: form.email,
//         profession: form.profession,
//         adresse: form.adresse,
//         region: form.region,
//       });
//       // Mettre à jour le contexte local
//       setUtilisateur({ ...utilisateur, ...response.data });
//       setSuccess("Profil mis à jour avec succès");
//       setEditing(false);
//     } catch (err) {
//       setError("Erreur lors de la mise à jour");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccess("Fonctionnalité de modification à venir.");
  setEditing(false);
};

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "40px",
    border: `1px solid ${COLORS.outlineVariant}`,
    backgroundColor: editing ? COLORS.surfaceContainerLow : COLORS.surfaceContainerLowest,
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{
          padding: "20px", display: "flex", alignItems: "center", gap: "12px",
          borderBottom: `1px solid ${COLORS.outlineVariant}30`,
        }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none" }}>
            <ArrowLeft size={24} color={COLORS.primary} />
          </button>
          <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>Mon profil</span>
        </header>

        <main style={{ flex: 1, padding: "20px" }}>
          {error && <div style={{ backgroundColor: COLORS.errorContainer, padding: "12px", borderRadius: "16px", marginBottom: "16px", color: COLORS.onErrorContainer }}>{error}</div>}
          {success && <div style={{ backgroundColor: COLORS.primaryFixed, padding: "12px", borderRadius: "16px", marginBottom: "16px", color: COLORS.onPrimaryFixed }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontWeight: 600 }}>
                <User size={16} color={COLORS.primary} /> Prénom
              </label>
              <input name="first_name" value={form.first_name} onChange={handleChange} disabled={!editing} style={inputStyle} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontWeight: 600 }}>
                <User size={16} color={COLORS.primary} /> Nom
              </label>
              <input name="last_name" value={form.last_name} onChange={handleChange} disabled={!editing} style={inputStyle} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontWeight: 600 }}>
                <Phone size={16} color={COLORS.primary} /> Téléphone
              </label>
              <input name="telephone" value={form.telephone} onChange={handleChange} disabled={!editing} style={inputStyle} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontWeight: 600 }}>
                <Mail size={16} color={COLORS.primary} /> Email
              </label>
              <input name="email" type="email" value={form.email} onChange={handleChange} disabled={!editing} style={inputStyle} required />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontWeight: 600 }}>
                <Briefcase size={16} color={COLORS.primary} /> Profession
              </label>
              <input name="profession" value={form.profession} onChange={handleChange} disabled={!editing} style={inputStyle} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontWeight: 600 }}>
                <MapPin size={16} color={COLORS.primary} /> Quartier / Ville
              </label>
              <input name="adresse" value={form.adresse} onChange={handleChange} disabled={!editing} style={inputStyle} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontWeight: 600 }}>
                <MapPin size={16} color={COLORS.primary} /> Région
              </label>
              <input name="region" value={form.region} onChange={handleChange} disabled={!editing} style={inputStyle} />
            </div>

            {!editing ? (
              <button type="button" onClick={() => setEditing(true)} style={{ width: "100%", backgroundColor: COLORS.primary, color: "white", border: "none", borderRadius: "40px", padding: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Edit2 size={18} /> Modifier mes informations
              </button>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, backgroundColor: COLORS.surfaceContainer, border: `1px solid ${COLORS.outlineVariant}`, borderRadius: "40px", padding: "12px", fontWeight: 600 }}>
                  Annuler
                </button>
                <button type="submit" disabled={loading} style={{ flex: 2, backgroundColor: COLORS.primary, color: "white", border: "none", borderRadius: "40px", padding: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  {loading ? "Enregistrement..." : "Enregistrer"} <Save size={18} />
                </button>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}