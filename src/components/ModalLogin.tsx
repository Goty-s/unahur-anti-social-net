/*
    ADAPTAR PARA EL PROYECTO - Att: Toby

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { CarritoContext, totalItems } from "../context/CarritoContext";
import { useContext } from "react";
import CarritoItem from './CarritoItem';
function ModalCarrito({ mostrar, cerrarModal }) {
    const { carrito } = useContext(CarritoContext);
    const total = totalItems(carrito);
    return (
        <Modal show={mostrar} onHide={cerrarModal} centered size="lg" contentClassName="modal-carrito">
            <Modal.Header closeButton>
                <Modal.Title>Tu Carrito</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center align-items-center">
                    {total > 0 ? <CarritoItem seRequiereFormulario={false}/> : <p>Tu carrito está vacío</p>}
                </div>
                <div className="d-flex justify-content-end mt-3">
                    <div>
                        <Button className="boton-secundario" as={Link} to="/Profile" onClick={cerrarModal}>Seguir Comprando</Button>
                        <Button className="boton-secundario " as={Link} to="/finalizarCompra" onClick={cerrarModal}>Finalizar compra</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalCarrito
*/