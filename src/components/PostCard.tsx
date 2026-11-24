import type { PostWithDetails } from "../types/index";
import styles from "./PostCard.module.css";
import PostCardBase from "./PostCardBase";

export default function PostCard({ post, showViewMore = true }: { post: PostWithDetails; showViewMore?: boolean }) {
  const nick = post.User?.nickName ?? "anonimo";
  const commentCount = post.comments.length;
  return (
    <PostCardBase id={showViewMore ? post.id : undefined} nick={nick} createdAt={post.createdAt} actions={
      <div >
        <i className="bi bi-chat" style={{marginRight: "5px"}}></i> {commentCount}
      </div>
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