import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import styles from "./NuevaPublicacion.module.css";

interface PublicacionData {
  descripcion: string;
  imagenes: string[];
  tags: string[];
};

type PublicacionErrors = Partial<{
  descripcion: string;
  imagenes: string;
}>;

function NuevaPublicacion() {
  const [formData, setFormData] = useState<PublicacionData>({
    descripcion: "",
    imagenes: [""],
    tags: []
  });

  const [errors, setErrors] = useState<PublicacionErrors>({});
  const [publicacionExitosa, setPublicacionExitosa] = useState(false);

  const etiquetasDisponibles = [
    "juegos",
    "musica",
    "deportes",
    "politica",
    "otros"
  ];

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
    setPublicacionExitosa(false);
  }

  function agregarImagen() {
    setFormData({
      ...formData,
      imagenes: [...formData.imagenes, ""],
    });
    setPublicacionExitosa(false);
  }

  function eliminarImagen(index: number) {
    const nuevasImagenes: string[] = formData.imagenes.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      imagenes: nuevasImagenes,
    });
    setPublicacionExitosa(false);
  }

  function handleTagChange(e: ChangeEvent<HTMLInputElement>) {
    const { value, checked }: { value: string; checked: boolean } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        tags: [...formData.tags, value],
      });
    } else {
      setFormData({
        ...formData,
        tags: formData.tags.filter((tag) => tag !== value),
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

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors: PublicacionErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setPublicacionExitosa(true);
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
              <button type="button" className="btn btn-secondary" onClick={() => eliminarImagen(index)}>Eliminar</button>
            </div>
          ))}
          {errors.imagenes && (
            <div className="invalid-feedback">{errors.imagenes}</div>
          )}
          <button type="button" className="btn btn-secondary" onClick={agregarImagen}>Agregar imagen</button>
        </div>
        <div className={styles.etiquetas}>
          <label>Etiquetas</label>
          {etiquetasDisponibles.map((etiqueta) => (
            <div className={styles.etiqueta} key={etiqueta}>
              <input type="checkbox" id={etiqueta} value={etiqueta} checked={formData.tags.includes(etiqueta)} onChange={handleTagChange}/>
              <label htmlFor={etiqueta}>{etiqueta}</label>
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