import { useState, type SyntheticEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/usuarioContext";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
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
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Nickname</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresá tu nickname"
          value={nickName}
          onChange={(event) => setNickname(event.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Ingresá tu contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Form.Group>

      <Button type="submit" className="tt-btn tt-btn-primary mt-2">
        Ingresar
      </Button>
    </Form>
  );
}

export default LoginForm;