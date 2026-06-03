import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function RepasModule() {
  const [repas, setRepas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchRepas = async () => {
      try {
        const res = await api.get("nutrition/repas/");
        // DRF retourne généralement un array
        if (!mounted) return;
        setRepas(res.data || []);
      } catch (err) {
        console.error("Erreur récupération repas:", err);
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRepas();
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <section className="max-w-4xl mx-auto px-4 mt-6">
      <div className="bg-white p-4 rounded-xl border border-outline-variant text-center">Chargement des repas…</div>
    </section>
  );

  if (error) return (
    <section className="max-w-4xl mx-auto px-4 mt-6">
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">Impossible de charger les repas.</div>
    </section>
  );

  if (!repas.length) return (
    <section className="max-w-4xl mx-auto px-4 mt-6">
      <div className="bg-white p-4 rounded-xl border border-outline-variant text-center">Aucun repas en base de données.</div>
    </section>
  );

  return (
    <section className="max-w-4xl mx-auto px-4 mt-6">
      <h3 className="text-lg font-bold text-primary mb-3">Catalogue des Repas</h3>
      <div className="space-y-3">
        {repas.map(r => (
          <div key={r.id} className="bg-white p-4 rounded-xl border border-outline-variant">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <img alt={r.nom} src={r.image || "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=200&h=200&q=80"} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-on-surface">{r.nom}</h4>
                  <span className="text-sm text-on-surface-variant">{r.cout_estime_fcfa} FCFA</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 mb-2 line-clamp-2">{r.description}</p>

                {/* Compositions si présentes */}
                {r.compositions && r.compositions.length > 0 && (
                  <div className="mt-2">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-on-surface-variant text-left">
                          <th>Ingrédient</th>
                          <th className="text-right">Quantité</th>
                          <th className="text-right">Coût</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.compositions.map(c => (
                          <tr key={c.id} className="border-t">
                            <td className="py-2">{c.nom_aliment || c.aliment}</td>
                            <td className="py-2 text-right">{c.quantite} {c.unite}</td>
                            <td className="py-2 text-right">{c.cout_ingredient ? `${c.cout_ingredient} FCFA` : (c.prix_unitaire ? `${c.prix_unitaire} FCFA` : "-")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
