import { useState , type SyntheticEvent } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/usuarioContext";

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onRegister?: () => void;
}

export function LoginForm({ onLoginSuccess , onRegister }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [nickName, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const loginOk = await login({ nickName, password });

    if (loginOk) {
      setError("");
      onLoginSuccess?.();
      navigate("/profile");
    } else {
      setError("Email o contraseña incorrectos");
    }
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
            <Button type="button" variant="link" className="w-100 mt-2" onClick={() => {onLoginSuccess?.();navigate("/")}}>
              Volver al inicio
            </Button>
            <Button type="button" variant="link" className="w-100 mt-2" onClick= {onRegister}>
              Registrarse
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginForm;