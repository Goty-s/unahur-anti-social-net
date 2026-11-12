import { useEffect, useState } from "react";
import { Row, Col, Alert, Spinner } from "react-bootstrap";
import { PostCard } from "../components/index";
import { getPosts, getPostImages, getPostComments } from "../services/api";
import type { Post, PostWithDetails } from "../types/index";

export default function Home() {
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const basePosts: Post[] = await getPosts();

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
  }, []);

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
    <>
      <header>
        <h2>Bienvenido a Anti-social-net</h2>
        <p>¡Anímate a compartir tus ideas, descubrir contenido y conectarte con los demás!</p>
      </header>
      <div>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {posts.length === 0 && (
              <p className="text-secondary">Todavía no hay publicaciones.</p>
              
            )}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Col>
        </Row>
      </div>
    </>
  );
}