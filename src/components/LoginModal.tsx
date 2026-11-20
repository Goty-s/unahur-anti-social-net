import { useState } from "react";
import { Button } from "react-bootstrap";
import { RegisterForm, LoginForm } from "./index";
import ModalBase from "./ModalBase";
import styles from "./ModalBase.module.css";

interface LoginModalProps {
  show: boolean;
  closeModal: () => void;
}

function LoginModal({ show, closeModal }: LoginModalProps) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <ModalBase
      show={show}
      closeModal={closeModal}
      titulo={showRegister ? "Crear cuenta" : "Iniciar sesión"}
      onExited={() => setShowRegister(false)}
      footer={
        showRegister ? (
          <Button variant="link" className={styles.link} onClick={() => setShowRegister(false)}>
            ¿Ya tenés cuenta? Iniciá sesión
          </Button>
        ) : (
          <Button variant="link" className={styles.link} onClick={() => setShowRegister(true)}>
            ¿No tenés cuenta? Registrate acá
          </Button>
        )
      }
    >
      {showRegister ? (
        <RegisterForm backToLogn={() => setShowRegister(false)} />
      ) : (
        <LoginForm onLoginSuccess={closeModal} />
      )}
    </ModalBase>
  );
}

export default LoginModal;