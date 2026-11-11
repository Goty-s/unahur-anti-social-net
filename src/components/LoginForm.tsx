import { useState , type SyntheticEvent } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/usuarioContext";

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [nickName, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const loginOk = await login({
      nickName,
      password,
    });

    if (loginOk) {
      setError("");
      navigate("/profile");
    } else {
      setError("Email o contraseña incorrectos");
    }
  }

    if (isAuthenticated) {
      return <Navigate to="/profile" replace />;
  }

  return (
    <Container>
      <Card className="mx-auto" style={{ maxWidth: "420px" }}>
        <Card.Body>
          <Card.Title className="mb-3 text-center">Iniciar sesión</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nickname</Form.Label>
              <Form.Control type="text"placeholder="Ingresá tu nickname" value={nickName} onChange={(event) => setNickname(event.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Ingresá tu contraseña" value={password} onChange={(event) => setPassword(event.target.value)}/>
            </Form.Group>
            <Button type="submit" className="w-100">
              Ingresar
            </Button>
            <Button type="button" variant="link" className="w-100 mt-2" onClick={() => navigate("/")}>
              Volver al inicio
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginForm;