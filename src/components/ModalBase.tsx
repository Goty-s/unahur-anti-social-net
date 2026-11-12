import Modal from "react-bootstrap/Modal";
import type { ReactNode } from "react";
import styles from "./ModalBase.module.css";

interface ModalBaseProps {
    mostrar: boolean;
    cerrarModal: () => void;
    titulo: string;
    children: ReactNode;
    footer?: ReactNode;
    onExited?: () => void;
}

function ModalBase({ mostrar, cerrarModal, titulo, children, footer, onExited }: ModalBaseProps) {
    return (
        <Modal show={mostrar} onHide={cerrarModal} onExited={onExited} centered className={styles.overlay} contentClassName={styles.content}>
            <Modal.Header>
                <Modal.Title>{titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            {footer && <Modal.Footer> {footer} </Modal.Footer>}
        </Modal>
    );
}
export default ModalBase;