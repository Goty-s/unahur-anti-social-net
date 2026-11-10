import { Link } from "react-router-dom";
import type { PostWithDetails } from "../types/index";
import styles from "./PostCard.module.css";


export default function PostCard({ post }: { post: PostWithDetails }) {
  const nick = post.User?.nickName ?? "anonimo";
  const commentCount = post.comments.length;

  return (
    <article className={styles.card}>
      <div className={styles.avatar}>{nick.charAt(0).toUpperCase()}</div>

      <div className={styles.content}>
        <header className={styles.header}>
          <span>{nick}</span>
          <span>@{nick}</span>
        </header>

        <p>{post.description}</p>

        {post.Tags && post.Tags.length > 0 && (
          <div className={styles.tags}>
            {post.Tags.map((tag) => (
              <span key={tag.id} className={styles.badgePost}>#{tag.name}</span>
            ))}
          </div>
        )}

        <div className={styles.images}>
          {post.images.map((img) => (
            <img key={img.id} src={img.url} alt="" className={styles.image} />
          ))}
        </div>

        <footer className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.action}>
              <i className="bi bi-chat"></i> {commentCount}
            </button>

          </div>

          <Link to={`/post/${post.id}`}>Ver más</Link>
        </footer>
      </div>
    </article>
  );
}