import ModalBase from "./ModalBase";
import { NewPost } from "./index";

interface NewPostModalProps {
  show: boolean;
  closeModal: () => void;
}

function NewPostModal({ show, closeModal }: NewPostModalProps) {
  return (
    <ModalBase show={show} closeModal={closeModal} titulo="Nueva Publicación">
      <NewPost onPostSuccess={closeModal} />
    </ModalBase>
  );
}

export default NewPostModal;