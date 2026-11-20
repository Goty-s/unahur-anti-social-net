import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import type { Tag } from "../types";
import { createPost, createPostImage, getTags } from "../services/api";
import { useAuth } from "../context/userContext";
import { useNotification } from "../context/notificationContext";
import styles from "./NewPost.module.css";

interface PostData {
  description: string;
  images: string[];
  tags: number[];
};

type PostErrors = Partial<{
  description: string;
  images: string;
}>;

interface NewPostProps {
  onPostSuccess?: () => void;
}

async function validateImage(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: `HEAD`
    });
    const contentType = response.headers.get("Content-Type");
    return response.ok && contentType?.startsWith("image/") == true;
  } catch {
    return false
  }
}

function NewPost({ onPostSuccess }: NewPostProps) {
  const { user , notifyPostCreated} = useAuth();
  const { notify } = useNotification();
  const [formData, setFormData] = useState<PostData>({
    description: "",
    images: [""],
    tags: []
  });

  const [errors, setErrors] = useState<PostErrors>({});
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    async function loadTags() {
      const tags = await getTags();
      setAvailableTags(tags);
    }
    loadTags();
  }, []);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value }: { name: string; value: string } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const newImages: string[] = [...formData.images];
    newImages[index] = e.target.value;

    setFormData({
      ...formData,
      images: newImages,
    });
    setErrors((previousErrors) => ({
      ...previousErrors,
      images: undefined
    }))
  }

  function addImage() {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
    setErrors((previousErrors) => ({
      ...previousErrors,
      images: undefined
    }))
  }

  function eliminarImagen(index: number) {
    const nuevasImagenes: string[] = formData.images.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      images: nuevasImagenes,
    });
    setErrors((previousErrors) => ({
      ...previousErrors,
      images: undefined
    }))
  }

  function handleTagChange(e: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    const tagId = Number(value);
    if (checked) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagId],
      });
    } else {
      setFormData({
        ...formData,
        tags: formData.tags.filter((tag) => tag !== tagId),
      });
    }
  }

  function validateForm() {
    const newErrors: PostErrors = {};
    if (formData.description.trim() === "") {
      newErrors.description = "La descripción no puede estar vacía";
    }

    return newErrors;
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors: PostErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (!user) {
      console.error(`No hay un usuario autenticado`)
      return;
    }

    try {
      const validImages = formData.images.filter((image) => image.trim() !== "");
      const results = await Promise.all(
        validImages.map((image) => validateImage(image))
      );

      if (results.some((resultado) => !resultado)) {
        setErrors({ images: "Se debe ingresar una URL valida" })
        return;
      }

      const newPost = await createPost({
        description: formData.description,
        userId: user.id,
        tagIds: formData.tags
      });

      await Promise.all(
        validImages.map((image) =>
          createPostImage({
            url: image,
            postId: newPost.id
          })
        )
      );
      notifyPostCreated();
      notify("¡Publicacion creada correctamente!");
      onPostSuccess?.();
    } catch (error) {
      console.error(`Error al crear la publicacion`, error);
    }
  }

  return (
    <>
      <form id="formulario" className={styles.formulario} onSubmit={handleSubmit} noValidate>
        <p>Completa los datos para crear una nueva publicacion</p>
        <div className={styles.campos}>
          <div className={styles.campo}>
            <label htmlFor="description">Descripcion *</label>
            <textarea name="description" id="description" className={`form-control ${errors.description ? "is-invalid" : ""}`} value={formData.description} onChange={handleChange} />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>
          <div className={styles.campo}>
            {formData.images.map((image, index) => (
              <div className={styles.imagen} key={index}>
                <input type="url" name={`imagen-${index}`} className={`form-control ${errors.images ? "is-invalid" : ""}`} value={image} onChange={(e) => handleImageChange(e, index)} placeholder="URL de imagenes:" />
                {errors.images && (
                  <div className="invalid-feedback">{errors.images}</div>
                )}
                <button type="button" className="btn btn-secondary" onClick={() => eliminarImagen(index)}>Eliminar imagen</button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addImage}>Agregar imagen</button>
          </div>
          <div className={styles.etiquetas}>
            <label>Etiquetas</label>
            {availableTags.map((tag) => (
              <div className={styles.etiqueta} key={tag.id}>
                <input type="checkbox" id={`tag-${tag.id}`} value={tag.id} checked={formData.tags.includes(tag.id)} onChange={handleTagChange} />
                <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Crear publicacion</button>
      </form>
    </>
  );
}

export default NewPost;