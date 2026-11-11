import Modal from 'react-bootstrap/Modal';
import { FormularioRegistro, LoginForm } from "./index";
import { useState } from 'react';

interface ModalLoginProps {
    mostrar: boolean;
    cerrarModal: () => void;
}

function ModalLogin({ mostrar, cerrarModal }: ModalLoginProps) {
    const [mostrarRegistro , setmostrarRegistro] = useState(false)
    return (
        <Modal show={mostrar} onHide={cerrarModal} centered size="lg" contentClassName="modal-carrito">
            <Modal.Header closeButton>
                <Modal.Title>{mostrarRegistro? "Crear Cuenta" : "Iniciar sesion"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {mostrarRegistro ? (
                    <FormularioRegistro backToLogn={() => setmostrarRegistro(false)}/>
                ) : (<LoginForm onLoginSuccess={cerrarModal} onRegister={() => setmostrarRegistro(true)}/>)
                }  
            </Modal.Body>
        </Modal>
    )
}

export default ModalLogin
