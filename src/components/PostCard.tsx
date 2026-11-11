import { useState } from "react";
import { Link } from "react-router-dom";
import type { PostWithDetails } from "../types/index";
import styles from "./PostCard.module.css";

const COLORES = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#4db6ac", "#ff8a65", "#7986cb"];

export default function PostCard({ post }: { post: PostWithDetails }) {
  const nick = post.User?.nickName ?? "anonimo";
  const commentCount = post.comments.length;
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

        <p>{post.description}</p>

        {post.Tags && post.Tags.length > 0 && (
          <div className={styles.tags}>
            {post.Tags.map((tag) => (
              <span key={tag.id} className={styles.badgePost}>#{tag.name}</span>
            ))}
          </div>
        )}

        {post.images.length > 0 && (
          <div className={styles.images}>
            {post.images.map((img) => (
              <img key={img.id} src={img.url} alt="" className={styles.image} />
            ))}
          </div>
        )}

        <footer className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.action}>
              <i className="bi bi-chat"></i> {commentCount}
            </button>
          </div>
          <Link className={styles.verMas} to={`/post/${post.id}`}>
            <i className="bi bi-eye"> Ver más</i> 
          </Link>

        </footer>
      </div>
    </article>
  );
}