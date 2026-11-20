import { useCallback, useEffect, useRef, useState } from "react";
import { Row, Col, Alert, Spinner } from "react-bootstrap";
import { PostCard } from "../components/index";
import { getPosts, getPostImages, getPostComments } from "../services/api";
import type { Post, PostWithDetails } from "../types/index";
import { useAuth } from "../context/userContext";

const PAGE_SIZE = 4;

function Home() {
  const {postUpdate} = useAuth();
  const [basePosts, setBasePosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = posts.length < basePosts.length;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setBasePosts([])
    setPosts([]);

    getPosts()
      .then((list) => {
        if (!cancelled) {
          setBasePosts([...list].sort((a, b) => b.id - a.id));
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(
            e instanceof TypeError
              ? "No se pudo conectar con la API. ¿Está corriendo en el puerto 3001?"
              : e instanceof Error
                ? e.message
                : "Error al cargar las publicaciones"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [postUpdate]);


  const loadNextPage = useCallback(async () => {
    if (loading || loadingMore || !hasMore || error) return;

    setLoadingMore(true);
    try {
      const nextPage = basePosts.slice(posts.length, posts.length + PAGE_SIZE);

      const detailed = await Promise.all(
        nextPage.map(async (post) => {
          const [images, comments] = await Promise.all([
            getPostImages(post.id),
            getPostComments(post.id),
          ]);
          return { ...post, images, comments };
        })
      );

      setPosts((prev) => [...prev, ...detailed]);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Error al cargar más publicaciones"
      );
    } finally {
      setLoadingMore(false);
    }
  }, [basePosts, posts.length, hasMore, loadingMore, loading , error]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadNextPage();
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadNextPage, loading]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <header className="homeHeader">
            <h2>Bienvenido a Anti-social-net</h2>
            <p>¡Anímate a compartir tus ideas, descubrir contenido y conectarte con los demás!</p>
          </header>
          {posts.length === 0 && !loadingMore && (
            <p className="text-secondary">Todavía no hay publicaciones.</p>
          )}

          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {error && posts.length > 0 && (
            <Alert variant="danger">{error}</Alert>
          )}

          {loadingMore && (
            <div className="text-center py-3">
              <Spinner animation="border" role="status" size="sm" />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <p className="text-center text-secondary py-3">No hay más publicaciones.</p>
          )}

          <div ref={sentinelRef} style={{ height: 1 }} />
        </Col>
      </Row>
    </>
  );
}

export default Home