import { useParams, useLocation, useNavigate } from "react-router-dom"
import { createComments, getPost, getPostComments, getPostImages } from "../services/api"
import type { PostWithDetails } from "../types"
import { useEffect, useState, type SyntheticEvent } from "react";
import { PostCard, CommentCard, UserIcon, NotFoundCard } from "../components";
import { useAuth } from "../context/userContext";
import styles from "./PostDetail.module.css";
import { Col, Row } from "react-bootstrap";
import { useLogin } from "../context/LoginContext";


function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, } = useAuth();
  const { setShowLogin } = useLogin();
  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const nick = user?.nickName ?? "anonimo";
  const location = useLocation();
  const navigate = useNavigate();

  function returnPrevious() {
    navigate(location.state?.origin || "/")
  };

  useEffect(() => {
    const fetchFullDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const basePost = await getPost(Number(id));

        const [imagesData, commentsData] = await Promise.all([
          getPostImages(Number(id)).catch(() => []),
          getPostComments(Number(id)).catch(() => []),
        ]);


        if (basePost.id === undefined) {
          throw new Error('Publicación no encontrada');
        }

        setPost({
          ...basePost,
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
  if (!post) {
  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <NotFoundCard />
      </Col>
    </Row>
  );
}

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
        <div className={styles.pageHeader}>
          <button className={styles.back} onClick={returnPrevious}> <i className="bi bi-arrow-left-short" /></button>
          <h4 className={styles.pageTitle}>Post</h4>

        </div>
          <PostCard post={post} showViewMore={false} />
          <p className={styles.comment}><i className="bi bi-chat" />Comentarios ({post.comments.length})</p>
          <div>
            {post.comments.map(com => <CommentCard key={com.id} post={com} />)}
          </div>
          <div className={styles.newComment}>
            {isAuthenticated ? (
              <>
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
                      <button type="submit" disabled={submitting || !newCommentText.trim() || !user} className={styles.commentButton}>
                        {submitting ? 'Enviando...' : 'Comentar'}
                      </button>
                    </div>
                  </form>
                </div>

              </>) : (
              <div className={styles.loginRequired}>
                <p className={styles.loginText}>Iniciá sesión para comentar</p>
                <button type="button" className={styles.commentButton} onClick={() => setShowLogin(true)}>
                  Iniciar sesión
                </button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </>

  )
}

export default PostDetail
