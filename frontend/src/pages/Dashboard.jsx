import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { COLORS } from "../constants/colors";
import { Home, Utensils, MessageCircle, User, Baby, Calendar, Heart, Smile } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bebes, setBebes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBebes = async () => {
      try {
        const data = await api.getBebes();
        setBebes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Impossible de charger vos enfants.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBebes();
  }, []);

  const calculerAge = (dateNaissance) => {
    const today = new Date();
    const birth = new Date(dateNaissance);
    let ageMois = (today.getFullYear() - birth.getFullYear()) * 12;
    ageMois += today.getMonth() - birth.getMonth();
    if (ageMois < 0) ageMois = 0;
    if (ageMois < 12) return `${ageMois} mois`;
    const annees = Math.floor(ageMois / 12);
    return `${annees} an${annees > 1 ? "s" : ""}`;
  };

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Chargement...</div>;

  return (
    <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 20px", height: "64px",
          backgroundColor: "rgba(248,249,250,0.92)", backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${COLORS.outlineVariant}30`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Baby size={24} color={COLORS.primary} />
            <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>NutriBébéCam</span>
          </div>
          <button onClick={() => navigate("/profil")} style={{ background: "none", border: "none" }}>
            <User size={24} color={COLORS.primary} />
          </button>
        </header>

        <main style={{ flex: 1, padding: "20px", paddingBottom: "80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <Smile size={24} color={COLORS.primary} />
            <h2 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>Bonjour</h2>
          </div>
          <p style={{ fontSize: "14px", color: COLORS.onSurfaceVariant, marginBottom: "24px" }}>
            Voici le récapitulatif de vos enfants
          </p>

          {error && <div style={{ backgroundColor: COLORS.errorContainer, padding: "12px", borderRadius: "16px", marginBottom: "16px" }}>{error}</div>}

          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Baby size={20} color={COLORS.primary} /> Mes enfants
            </h3>
            {bebes.length === 0 ? (
              <div style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "24px", textAlign: "center" }}>
                <p style={{ marginBottom: "12px" }}>Aucun enfant enregistré.</p>
                <button
                  onClick={() => navigate("/profil-bebe")}
                  style={{ backgroundColor: COLORS.primary, color: "white", border: "none", borderRadius: "999px", padding: "8px 20px", fontWeight: 600 }}
                >
                  Ajouter un enfant
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {bebes.map((bebe) => (
                  <div key={bebe.id} style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", padding: "16px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: COLORS.surfaceContainer, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Baby size={32} color={COLORS.primary} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "16px", fontWeight: 700 }}>{bebe.nom}</h4>
                      <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant }}>
                        {calculerAge(bebe.date_naissance)} • {bebe.sexe === "M" ? "Garçon" : "Fille"}
                      </p>
                    </div>
                    <button onClick={() => navigate("/repas")} style={{ background: "none", border: "none", color: COLORS.primary }}>
                      <Calendar size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Heart size={20} color={COLORS.primary} /> Conseil du jour
            </h3>
            <div style={{ backgroundColor: COLORS.primaryFixed, borderRadius: "20px", padding: "20px" }}>
              <p style={{ fontSize: "14px", lineHeight: "1.5", color: COLORS.onPrimaryFixed }}>
                Variez les textures en fonction de l’âge : purées lisses dès 6 mois, puis morceaux mous vers 9 mois. Cela aide votre bébé à apprendre à mâcher.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => navigate("/repas")}
              style={{ flex: 1, backgroundColor: COLORS.surfaceContainerLowest, border: `1px solid ${COLORS.outlineVariant}`, borderRadius: "40px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 600 }}
            >
              <Utensils size={18} /> Voir les repas
            </button>
            <button
              onClick={() => navigate("/messagerie")}
              style={{ flex: 1, backgroundColor: COLORS.primary, color: "white", border: "none", borderRadius: "40px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 600 }}
            >
              <MessageCircle size={18} /> Messagerie
            </button>
          </div>
        </main>

        <nav style={{
          position: "sticky", bottom: 0, width: "100%", zIndex: 50,
          display: "flex", justifyContent: "space-around", alignItems: "center",
          padding: "10px 16px",
          backgroundColor: "rgba(248,249,250,0.95)", backdropFilter: "blur(8px)",
          borderTop: `1px solid ${COLORS.outlineVariant}30`,
        }}>
          {[
            { icon: Home, label: "Accueil", path: "/dashboard" },
            { icon: Utensils, label: "Repas", path: "/repas" },
            { icon: MessageCircle, label: "Messages", path: "/messagerie" },
            { icon: User, label: "Profil", path: "/profil" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                background: "none", border: "none", cursor: "pointer",
                color: window.location.pathname === item.path ? COLORS.primary : COLORS.onSurfaceVariant,
              }}
            >
              <item.icon size={20} />
              <span style={{ fontSize: "10px", marginTop: "2px" }}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

