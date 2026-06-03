import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNavBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Fonction utilitaire pour vérifier si l'onglet est actif
  const isActive = (path) => currentPath === path;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-white border-t border-outline-variant shadow-lg">
      
      {/* Onglet : Accueil / Dashboard */}
      <Link 
        to="/dashboard"
        className={`flex flex-col items-center justify-center px-2 py-1 transition-all active:scale-95 ${
          isActive("/dashboard") ? "text-primary font-bold" : "text-on-surface-variant"
        }`}
      >
        <span 
          className="material-symbols-outlined" 
          style={{ fontVariationSettings: isActive("/dashboard") ? "'FILL' 1" : "'FILL' 0" }}
        >
          home
        </span>
        <span className="text-xs mt-0.5">Home</span>
      </Link>

      {/* Onglet : Catalogue des Repas */}
      <Link 
        to="/repas"
        className={`flex flex-col items-center justify-center transition-all active:scale-95 ${
          isActive("/repas") 
            ? "bg-secondary-container text-on-primary-fixed-variant rounded-full font-bold px-4 py-1" 
            : "text-on-surface-variant px-2 py-1"
        }`}
      >
        <span 
          className="material-symbols-outlined" 
          style={{ fontVariationSettings: isActive("/repas") ? "'FILL' 1" : "'FILL' 0" }}
        >
          restaurant_menu
        </span>
        <span className="text-xs mt-0.5">Repas</span>
      </Link>

      {/* Onglet : Suivi de Croissance */}
      <Link 
        to="/croissance"
        className={`flex flex-col items-center justify-center px-2 py-1 transition-all active:scale-95 ${
          isActive("/croissance") ? "text-primary font-bold" : "text-on-surface-variant"
        }`}
      >
        <span 
          className="material-symbols-outlined" 
          style={{ fontVariationSettings: isActive("/croissance") ? "'FILL' 1" : "'FILL' 0" }}
        >
          monitoring
        </span>
        <span className="text-xs mt-0.5">Santé</span>
      </Link>

      {/* Onglet : Téléconsultation */}
      <Link 
        to="/teleconsultation"
        className={`flex flex-col items-center justify-center px-2 py-1 transition-all active:scale-95 ${
          isActive("/teleconsultation") ? "text-primary font-bold" : "text-on-surface-variant"
        }`}
      >
        <span 
          className="material-symbols-outlined" 
          style={{ fontVariationSettings: isActive("/teleconsultation") ? "'FILL' 1" : "'FILL' 0" }}
        >
          medical_services
        </span>
        <span className="text-xs mt-0.5">Médecin</span>
      </Link>

    </nav>
  );
}