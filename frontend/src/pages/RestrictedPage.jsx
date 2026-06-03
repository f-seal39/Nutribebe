import styles from './Restricted.module.css';
import { useNavigate } from 'react-router-dom';

export default function RestrictedPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>🔒</div>
        <h2 className={styles.title}>Module non disponible</h2>
        <p className={styles.description}>
          Ce module n'est pas disponible pour le moment. Seules l'inscription et la création de repas par les médecins sont accessibles.
        </p>
        <button onClick={() => navigate('/')} className={styles.button}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
