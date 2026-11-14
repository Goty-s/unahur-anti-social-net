import { useParams } from "react-router-dom"
import { createComments, getPostComments, getPostImages, getPosts } from "../services/api"
import type { PostWithDetails } from "../types"
import { useEffect, useState, type SyntheticEvent } from "react";
import { PostCard } from "../components";
import PostCommentCard from "../components/CommentCard";
import { useAuth } from "../context/usuarioContext";
import styles from "./PostDetail.module.css";


const COLORES = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#4db6ac", "#ff8a65", "#7986cb"];


function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [colorAvatar] = useState(() => COLORES[Math.floor(Math.random() * COLORES.length)]);
  const nick = user?.nickName ?? "anonimo";

  useEffect(() => {
    const fetchFullDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const [postData, imagesData, commentsData] = await Promise.all([
          getPosts(),
          getPostImages(Number(id)).catch(() => []),
          getPostComments(Number(id)).catch(() => []),
        ]);

        const postCompleto = postData.find((post) => post.id === Number(id))

        if (!postCompleto || postCompleto.id === undefined) {
          throw new Error('Publicación no encontrada');
        }

        setPost({
          ...postCompleto,
          images: imagesData,
          comments: commentsData,
        });
      } catch (error) {
        console.error('Error al cargar el detalle del post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFullDetail();
  }, [id]);

  if (loading) return <p>Cargando detalles...</p>;
  if (!post) return <p>Publicación no encontrada.</p>;

  const postId = post.id;

  async function handleAddComment(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newCommentText.trim() || !user) return;

    try {
      setSubmitting(true);

      const createdComment = await createComments({
        content: newCommentText,
        userId: user.id,
        postId: postId
      });

      setPost((prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          comments: [...prevPost.comments, createdComment],
        };
      });

      setNewCommentText('');
    } catch (error) {
      console.error('El comentario no puedo ser enviado debido a:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PostCard post={post} />
      <h3>Comentarios({post.comments.length})</h3>
      <div>
        {post.comments.map(com => <PostCommentCard key={com.id} post={com} />)}
      </div>
      <div className={styles.nuevoComentario}>
        <div>
          <span className={styles.avatar} style={{ backgroundColor: colorAvatar }}>
            {nick.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className={styles.content}>
          <header className={styles.header}>
            <span className={styles.name}>{nick}</span>
            <span className={styles.handle}>@{nick}</span>
          </header>
          <form onSubmit={handleAddComment} style={{ marginTop: '10px' }} /* deberia verificar que el usuario este logueado primero */>
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Escribe un comentario..."
              disabled={submitting}
              className={styles.textarea}
            />
            <div className={styles.submitContainer}>
              <button type="submit" disabled={submitting || !newCommentText.trim()} className={styles.comentar}>
                {submitting ? 'Enviando...' : 'Comentar'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default PostDetail
