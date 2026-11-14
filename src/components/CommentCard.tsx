import type { PostComment} from "../types/index";
import PostCardBase from "./PostCardBase";


export default function CommentCard({ post }: { post: PostComment }) {
  const nick = post.User?.nickName ?? "anonimo";

  return (
    <PostCardBase nick={nick}  createdAt={post.createdAt}>
      <p>{post.content}</p>
    </PostCardBase>
    );
}