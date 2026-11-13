import { useAuth } from "../context/usuarioContext"
import { useEffect, useState } from "react";
import { getPostsByUser, getPostImages, getPostComments } from "../services/api";
import { PostCard} from "../components/index";
import type { Post, PostWithDetails } from "../types/index";
import { Row, Col, Alert, Spinner } from "react-bootstrap";
import styles from "./Profile.module.css";
import { Navigate } from "react-router-dom";

const COLORES = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#4db6ac", "#ff8a65", "#7986cb"];

 function Profile() {
  const {user} = useAuth();
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colorAvatar] = useState(() => COLORES[Math.floor(Math.random() * COLORES.length)]);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    let cancelled = false;
    
    async function load() {
      try {
        const basePosts: Post[] = await getPostsByUser(userId);

        const detailed = await Promise.all(
          basePosts.map(async (post) => {
            const [images, comments] = await Promise.all([
              getPostImages(post.id),
              getPostComments(post.id),
            ]);
            return { ...post, images, comments };
          })
        );

        if (!cancelled) {
          setPosts([...detailed].sort((a, b) => b.id - a.id));
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof TypeError
              ? "No se pudo conectar con la API. ¿Está corriendo en el puerto 3001?"
              : e instanceof Error
                ? e.message
                : "Error al cargar las publicaciones"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

   if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
     <div>
       <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className={styles.banner}>
          </div>
          <div className={styles.detallesPerfil}>
            <span className={styles.avatar} style={{ backgroundColor: colorAvatar }}>
              {user.nickName.charAt(0).toUpperCase()}
            </span>
            <div>
              <h2> {user.nickName} </h2>
              <p className="text-secondary mb-0"> @{user.nickName} </p>
              <p className="mb-0"> <strong>{posts.length}</strong> {posts.length === 1 ? "publicación" : "publicaciones"} </p>
              <p> Se unió el {new Date(user.createdAt).toLocaleDateString("es-AR", {day:"numeric", month:"long", year:"numeric"})}</p>
            </div>
          </div>
          <div>
            {posts.length === 0 && (
              <p className="text-secondary">Todavía no hay publicaciones.</p>

              )}
              {posts.map((post) => (
              <PostCard key={post.id} post={post} />
              ))}
          </div>
        </Col>
       </Row>
     </div>
   );
 }

export default Profile
