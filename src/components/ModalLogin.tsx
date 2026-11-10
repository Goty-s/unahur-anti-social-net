import Modal from 'react-bootstrap/Modal';
import { LoginForm } from "./index";

interface ModalLoginProps {
    mostrar: boolean;
    cerrarModal: () => void;
}

function ModalLogin({ mostrar, cerrarModal }: ModalLoginProps) {
    return (
        <Modal show={mostrar} onHide={cerrarModal} centered size="lg" contentClassName="modal-carrito">
            <Modal.Header closeButton>
                <Modal.Title>Iniciar Sesion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <LoginForm />
            </Modal.Body>
        </Modal>
    )
}

export default ModalLogin
