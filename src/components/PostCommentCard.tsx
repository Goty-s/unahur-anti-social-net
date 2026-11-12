import { useState } from "react";
import { Link } from "react-router-dom";
import type { PostComment} from "../types/index";
import styles from "./PostCard.module.css";

const COLORES = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#4db6ac", "#ff8a65", "#7986cb"];

export default function PostCard({ post }: { post: PostComment }) {
  const nick = post.User?.nickName ?? "anonimo";
  const [colorAvatar] = useState(() => COLORES[Math.floor(Math.random() * COLORES.length)]);

  return (
    <article className={styles.card}>
      <div>
        <span className={styles.avatar} style={{ backgroundColor: colorAvatar }}>
          {nick.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className={styles.content}>
        <header className={styles.header}>
          <span className={styles.name}>{nick}</span>
          <span className={styles.handle}>@{nick}</span>
          <span>  • {new Date(post.createdAt).toLocaleDateString()}</span>
        </header>

        <p>{post.content}</p>
        <footer className={styles.footer}>

          <Link className={styles.verMas} to={`/post/${post.id}`}>
            <i className="bi bi-eye"> Ver más</i>
          </Link>

        </footer>
      </div>
    </article>
  );
}