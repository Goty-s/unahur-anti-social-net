import ModalBase from "./ModalBase";
import { NuevaPublicacionForm } from "./index";

interface ModalNuevaPublicacionProps {
  mostrar: boolean;
  cerrarModal: () => void;
}

function ModalNuevaPublicacion({ mostrar, cerrarModal }: ModalNuevaPublicacionProps) {
  return (
    <ModalBase mostrar={mostrar} cerrarModal={cerrarModal} titulo="Nueva Publicación">
      <NuevaPublicacionForm />
    </ModalBase>
  );
}

export default ModalNuevaPublicacion;