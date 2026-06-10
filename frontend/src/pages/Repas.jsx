import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { formatHeure } from "../utils/authRoutes";
import { COLORS } from "../constants/colors";
import { Home, Utensils, MessageCircle, User, ChevronDown, ChevronUp } from "lucide-react";

function getMealTypeInfo(heureStr) {
  if (!heureStr) return { icon: "sun", label: "Repas" };
  const [h] = heureStr.split(":").map(Number);
  if (h >= 5 && h < 12) return { icon: "sun", label: "Petit-déjeuner" };
  if (h >= 12 && h < 15) return { icon: "utensils", label: "Déjeuner" };
  if (h >= 15 && h < 18) return { icon: "coffee", label: "Goûter" };
  if (h >= 18 && h < 22) return { icon: "moon", label: "Dîner" };
  return { icon: "utensils", label: "Repas" };
}

export default function Repas() {
  const navigate = useNavigate();
  const [repasProgrammes, setRepasProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [compositions, setCompositions] = useState({});

  useEffect(() => {
    const fetchPlanning = async () => {
      try {
        const data = await api.getRepasProgrammesAujourdhui();
        const sorted = [...data].sort((a, b) => formatHeure(a.heure).localeCompare(formatHeure(b.heure)));
        setRepasProgrammes(sorted);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le planning des repas.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlanning();
  }, []);

  const handleViewDetails = async (repasId) => {
    if (expandedId === repasId) {
      setExpandedId(null);
      return;
    }
    if (!compositions[repasId]) {
      try {
        const res = await api.get(`nutrition/repas/${repasId}/composition/`);
        setCompositions(prev => ({ ...prev, [repasId]: res.data }));
      } catch (err) { console.error(err); }
    }
    setExpandedId(repasId);
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>Chargement du planning...</div>;
  }

  return (
    <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header inchangé */}
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 20px", height: "64px",
          backgroundColor: "rgba(248,249,250,0.92)", backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${COLORS.outlineVariant}30`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Utensils size={24} color={COLORS.primary} />
            <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>Planning repas</span>
          </div>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none" }}>
            <Home size={20} color={COLORS.primary} />
          </button>
        </header>

        <main style={{ flex: 1, padding: "20px", paddingBottom: "80px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>Repas du {new Date().toLocaleDateString()}</h2>
          {error && <div style={{ backgroundColor: COLORS.errorContainer, padding: "12px", borderRadius: "12px", marginBottom: "16px", color: COLORS.onErrorContainer }}>{error}</div>}
          
          {repasProgrammes.length === 0 && !error && (
            <div style={{ textAlign: "center", padding: "32px", backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px" }}>
              <Utensils size={48} color={COLORS.onSurfaceVariant} style={{ margin: "0 auto" }} />
              <p style={{ marginTop: "12px" }}>Aucun repas programmé aujourd'hui.</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {repasProgrammes.map(item => {
              const { icon, label } = getMealTypeInfo(formatHeure(item.heure));
              return (
                <div key={item.id} style={{ backgroundColor: COLORS.surfaceContainerLowest, borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <div style={{ width: "70px", height: "70px", borderRadius: "16px", overflow: "hidden", flexShrink: 0, backgroundColor: COLORS.surfaceContainer }}>
                        {item.repas?.image ? (
                          <img src={item.repas.image} alt={item.repas.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Utensils size={28} color={COLORS.primary} />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{item.repas?.nom}</h3>
                          <span style={{ backgroundColor: COLORS.primaryFixed, padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 600 }}>
                            {formatHeure(item.heure)}
                          </span>
                        </div>
                        <p style={{ fontSize: "12px", color: COLORS.onSurfaceVariant, marginTop: "6px" }}>{item.repas?.description?.slice(0, 80)}...</p>
                        <button onClick={() => handleViewDetails(item.repas.id)} style={{ marginTop: "8px", fontSize: "12px", color: COLORS.primary, fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer" }}>
                          {expandedId === item.repas.id ? "Masquer" : "Voir la composition"}
                          {expandedId === item.repas.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>
                    {expandedId === item.repas.id && compositions[item.repas.id] && (
                      <div style={{ marginTop: "12px", backgroundColor: COLORS.surfaceContainer, borderRadius: "16px", padding: "12px" }}>
                        <p style={{ fontWeight: 600, marginBottom: "8px" }}>Ingrédients :</p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                          {compositions[item.repas.id].map((comp, idx) => (
                            <li key={idx} style={{ fontSize: "12px", padding: "4px 0", borderBottom: `1px solid ${COLORS.outlineVariant}20` }}>
                              {comp.quantite} {comp.unite} de {comp.aliment}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Barre de navigation modifiée : remplacement de "Croissance" par "Messagerie" */}
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
