import { Link } from "react-router-dom";
import styles from "./NotFoundCard.module.css";

type NotFoundCardProps = {
  title?: string;
  message?: string;
  backTo?: string;
};

export default function NotFoundCard({
  title = "Publicación no encontrada",
  message = "La publicación que buscás no existe o ya no está disponible.",
  backTo = "/",
}: NotFoundCardProps) {
  return (
    <article className={styles.card}>
      <i className={`bi bi-search ${styles.icon}`} aria-hidden="true" />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      <Link className={styles.button} to={backTo}>
        Volver al inicio
      </Link>
    </article>
  );
}