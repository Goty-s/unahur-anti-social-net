import { useParams } from "react-router-dom"
import { createComments, getPostComments, getPostImages, getPosts } from "../services/api"
import type { PostWithDetails } from "../types"
import { useEffect, useState, type SyntheticEvent } from "react";
import { PostCard, CommentCard, UserIcon} from "../components";
import { useAuth } from "../context/userContext";
import styles from "./PostDetail.module.css";
import { Col, Row } from "react-bootstrap";


function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
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

        const fullPost = postData.find((post) => post.id === Number(id))

        if (!fullPost || fullPost.id === undefined) {
          throw new Error('Publicación no encontrada');
        }

        setPost({
          ...fullPost,
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

      const commentWithUser = {
        ...createdComment,
        User: user
      }

      setPost((prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          comments: [...prevPost.comments, commentWithUser],
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
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <PostCard post={post} />
          <p className={styles.comment}><i className="bi bi-chat" />Comentarios ({post.comments.length})</p>
          <div>
            {post.comments.map(com => <CommentCard key={com.id} post={com} />)}
          </div>
          <div className={styles.nuevoComentario}>
            <div>
                <UserIcon nick={nick} />
            </div>
            <div className={styles.content}>
              <header className={styles.header}>
                <span className={styles.name}>{nick}</span>
                <span className={styles.handle}>@{nick}</span>
              </header>
              <form onSubmit={handleAddComment} style={{ marginTop: '10px' }}>
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
        </Col>
      </Row>
    </>
  )
}

export default PostDetail
