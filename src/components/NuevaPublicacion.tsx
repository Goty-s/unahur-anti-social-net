import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import styles from "./NuevaPublicacion.module.css";
import type { Tag } from "../types";
import { createPost, createPostImage, getTags } from "../services/api";
import { useAuth } from "../context/usuarioContext";

interface PublicacionData {
  descripcion: string;
  imagenes: string[];
  tags: number[];
};

type PublicacionErrors = Partial<{
  descripcion: string;
  imagenes: string;
}>;

async function validarImagen(url : string) : Promise<boolean> {
  try {
    const response = await fetch(url , {
      method : `HEAD`
    });
    const contentType = response.headers.get("Content-Type");
    return response.ok && contentType?.startsWith("image/") == true;
  } catch {
    return false
  }
}

function NuevaPublicacion() {
  const {user} = useAuth();
  const [formData, setFormData] = useState<PublicacionData>({
    descripcion: "",
    imagenes: [""],
    tags: []
  });

  const [errors, setErrors] = useState<PublicacionErrors>({});
  const [publicacionExitosa, setPublicacionExitosa] = useState(false);
  const [etiquetasDisponibles , setEtiquetasDisponibles] = useState<Tag[]>([]);

  useEffect(() => {
    async function cargarTags() {
      const tags = await getTags();
      setEtiquetasDisponibles(tags);
    }
    cargarTags();
  } , []);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } : { name: string; value: string } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setPublicacionExitosa(false);
  }

  function handleImagenChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const nuevasImagenes: string[] = [...formData.imagenes];
    nuevasImagenes[index] = e.target.value;

    setFormData({
      ...formData,
      imagenes: nuevasImagenes,
    });
    setErrors((erroresPrevios) => ({
      ...erroresPrevios,
      imagenes : undefined
    }))
    setPublicacionExitosa(false);
  }

  function agregarImagen() {
    setFormData({
      ...formData,
      imagenes: [...formData.imagenes, ""],
    });
    setErrors((erroresPrevios) => ({
      ...erroresPrevios,
      imagenes : undefined
    }))
    setPublicacionExitosa(false);
  }

  function eliminarImagen(index: number) {
    const nuevasImagenes: string[] = formData.imagenes.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      imagenes: nuevasImagenes,
    });
    setErrors((erroresPrevios) => ({
      ...erroresPrevios,
      imagenes : undefined
    }))
    setPublicacionExitosa(false);
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

    setPublicacionExitosa(false);
  }

  function validateForm() {
    const newErrors: PublicacionErrors = {};

    if (formData.descripcion.trim() === "") {
      newErrors.descripcion = "La descripción no puede estar vacía";
    }

    return newErrors;
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setPublicacionExitosa(false)
    const newErrors: PublicacionErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    if(!user) {
      console.error(`No hay un usuario autenticado`)
      return;
    }

    try {
      const imagenesValidas = formData.imagenes.filter((imagen) => imagen.trim() !== "");
      const resultados = await Promise.all(
        imagenesValidas.map((imagen) => validarImagen(imagen))
      );

      if(resultados.some((resultado) => !resultado)) {
        setErrors({imagenes : "Se debe ingresar una URL valida"})
        return;
      }

      const NuevaPublicacion = await createPost({
        description : formData.descripcion,
        userId : user.id,
        tagIds: formData.tags
      });

      await Promise.all(
        imagenesValidas.map((imagen) =>
          createPostImage({
            url : imagen,
            postId : NuevaPublicacion.id
          })
        )
      );
      setPublicacionExitosa(true)
    } catch (error) {
      console.error(`Error al crear la publicacion`, error);
    }
  }

  return (
    <form id="formulario" className={styles.formulario} onSubmit={handleSubmit} noValidate>
      <p>Completa los datos para crear una nueva publicacion</p>
      <div className={styles.campos}>
        <div className={styles.campo}>
          <label htmlFor="descripcion">Descripcion *</label>
          <textarea name="descripcion" id="descripcion" className={`form-control ${errors.descripcion ? "is-invalid" : ""}`} value={formData.descripcion} onChange={handleChange}/>
          {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion}</div>
          )}
        </div>
        <div className={styles.campo}>
          <label>URL de imagenes (opcional)</label>
          {formData.imagenes.map((imagen, index) => (
            <div className={styles.imagen} key={index}>
              <input type="url" name={`imagen-${index}`} className={`form-control ${errors.imagenes ? "is-invalid" : ""}`} value={imagen} onChange={(e) => handleImagenChange(e, index)} placeholder="https://..."/>
              {errors.imagenes && (
                <div className="invalid-feedback">{errors.imagenes}</div>
              )}
              <button type="button" className="btn btn-secondary" onClick={() => eliminarImagen(index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={agregarImagen}>Agregar imagen</button>
        </div>
        <div className={styles.etiquetas}>
          <label>Etiquetas</label>
          {etiquetasDisponibles.map((etiqueta) => (
            <div className={styles.etiqueta} key={etiqueta.id}>
              <input type="checkbox" id={`tag-${etiqueta.id}`} value={etiqueta.id} checked={formData.tags.includes(etiqueta.id)} onChange={handleTagChange}/>
              <label htmlFor={`tag-${etiqueta.id}`}>{etiqueta.name}</label>
            </div>
          ))}
        </div>
      </div>
      {publicacionExitosa && (
        <div className="alert alert-success">
          Publicacion creada correctamente!
        </div>
      )}
      <button type="submit" className="btn btn-primary">Crear publicacion</button>
    </form>
  );
}

export default NuevaPublicacion;