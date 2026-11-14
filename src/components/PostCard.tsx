import type { PostWithDetails } from "../types/index";
import styles from "./PostCard.module.css";
import PostCardBase from "./PostCardBase";

export default function PostCard({ post }: { post: PostWithDetails }) {
  const nick = post.User?.nickName ?? "anonimo";
  const commentCount = post.comments.length;

  return (
    <PostCardBase id={post.id} nick={nick} createdAt={post.createdAt} actions={
      <button className={styles.action}>
        <i className="bi bi-chat"></i> {commentCount}
      </button>
    }>
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
          {post.images.map((img) =>(
            <img key={img.id} src={img.url} alt="" className={styles.image} />
          ))}
        </div>
      )}
    </PostCardBase>
  );
}