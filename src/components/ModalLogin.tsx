import { useState } from "react";
import { Button } from "react-bootstrap";
import { FormularioRegistro, LoginForm } from "./index";
import ModalBase from "./ModalBase";
import styles from "./ModalBase.module.css";

interface ModalLoginProps {
  mostrar: boolean;
  cerrarModal: () => void;
}

function ModalLogin({ mostrar, cerrarModal }: ModalLoginProps) {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  return (
    <ModalBase
      mostrar={mostrar}
      cerrarModal={cerrarModal}
      titulo={mostrarRegistro ? "Crear Cuenta" : "Iniciar sesión"}
      onExited={() => setMostrarRegistro(false)}
      footer={
        mostrarRegistro ? (
          <Button variant="link" className={styles.link} onClick={() => setMostrarRegistro(false)}>
            ¿Ya tenés cuenta? Iniciá sesión
          </Button>
        ) : (
          <Button variant="link" className={styles.link} onClick={() => setMostrarRegistro(true)}>
            ¿No tenés cuenta? Registrate acá
          </Button>
        )
      }
    >
      {mostrarRegistro ? (
        <FormularioRegistro backToLogn={() => setMostrarRegistro(false)} />
      ) : (
        <LoginForm onLoginSuccess={cerrarModal} />
      )}
    </ModalBase>
  );
}

export default ModalLogin;