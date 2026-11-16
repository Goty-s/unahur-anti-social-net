import { useState, type SyntheticEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import { getUsers } from "../services/api";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

type RegisterErrors = Partial<{
  nickName: string;
  password: string;
}>;

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [nickName, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [errorsServer, seterrorsServer] = useState("")

  function validateForm() {
    const newErrors: RegisterErrors = {};

    if (nickName.trim() === "") {
      newErrors.nickName = "El campo nickname está vacío";
    }
    if (password.trim() === "") {
      newErrors.password = "El campo contraseña está vacío";
    }

    return newErrors;
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    seterrorsServer("");
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const usuarios = await getUsers();
      const existeNickName = usuarios.find(
      (usuario) => usuario.nickName === nickName
      );
      if (!existeNickName) {
        newErrors.nickName = "No existe el nickName ingresado";
      }
      if (password.trim() !== "123456") {
      newErrors.password = "La contraseña ingresada es incorecta";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    const loginOk = await login({ nickName, password });
    if (loginOk) {
      setErrors({});
      onLoginSuccess?.();
      navigate("/profile");
    }
    }catch (error) {
      seterrorsServer(error instanceof Error ? error.message : "No se pudo iniciar sesion");
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nickname</Form.Label>
        <Form.Control type="text" placeholder="Ingresá tu nickname" value={nickName} onChange={(event) => setNickname(event.target.value)} isInvalid={!!errors.nickName}/>
          {errors.nickName && (
            <div className="invalid-feedback">{errors.nickName}</div>
          )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" placeholder="Ingresá tu contraseña" value={password} onChange={(event) => setPassword(event.target.value)} isInvalid={!!errors.password}/>
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
      </Form.Group>
      {errorsServer && (
        <div className="invalid-feedback">{errorsServer}</div>
      )}
      <Button type="submit" className="tt-btn tt-btn-primary mt-2">
        Ingresar
      </Button>
    </Form>
  );
}

export default LoginForm;