import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { FormularioRegistro, LoginForm } from "./index";
import styles from "./ModalLogin.module.css";
import { Button } from "react-bootstrap";

interface ModalLoginProps {
    mostrar: boolean;
    cerrarModal: () => void;
}

function ModalLogin({ mostrar, cerrarModal }: ModalLoginProps) {
    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    return (
        <Modal show={mostrar} onHide={cerrarModal} centered className={styles.overlay} contentClassName={styles.content}>
            <Modal.Header closeButton >
                <Modal.Title>
                    {mostrarRegistro ? "Crear Cuenta" : "Iniciar sesión"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {mostrarRegistro ? (
                    <FormularioRegistro backToLogn={() => setMostrarRegistro(false)} />
                ) : (
                    <LoginForm onLoginSuccess={cerrarModal} />
                )}
            </Modal.Body>

            <Modal.Footer>
                {mostrarRegistro ? (
                    <>
                        <Button variant="link" className={styles.link} onClick={() => setMostrarRegistro(false)}>
                            ¿Ya tenés cuenta? Iniciá sesión
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="link" className={styles.link} onClick={() => setMostrarRegistro(true)}>
                            ¿No tenés cuenta? Registrate acá
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default ModalLogin;