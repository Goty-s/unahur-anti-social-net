import ModalBase from "./ModalBase";
import { NewPost } from "./index";

interface NewPostModalProps {
  mostrar: boolean;
  cerrarModal: () => void;
}

function NewPostModal({ mostrar, cerrarModal }: NewPostModalProps) {
  return (
    <ModalBase mostrar={mostrar} cerrarModal={cerrarModal} titulo="Nueva Publicación">
      <NewPost onPostSuccess={cerrarModal} />
    </ModalBase>
  );
}

export default NewPostModal;