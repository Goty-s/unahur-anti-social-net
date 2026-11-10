import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import styles from "./FormularioRegistro.module.css";

interface RegistroData {
  nickName: string;
  mail: string;
  contraseña: string;
  repetirContraseña: string;
  fechaNacimiento: string;
};

type RegistroErrors = Partial<{
  nickName: string;
  mail: string;
  contraseña: string;
  repetirContraseña: string;
  fechaNacimiento: string;
}>;

function FormularioRegistro() {
  const [formData, setFormData] = useState<RegistroData>({
    nickName: "",
    mail: "",
    contraseña: "",
    repetirContraseña: "",
    fechaNacimiento: ""
  });

  const [errors, setErrors] = useState<RegistroErrors>({});
  const [registroExitoso, setRegistroExitoso] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setRegistroExitoso(false);
  }

  function validateForm() {
    const newErrors: RegistroErrors = {};

    if (formData.nickName.trim() === "") {
      newErrors.nickName = "El campo nickname está vacío";
    }

    if (formData.mail.trim() === "") {
      newErrors.mail = "El campo email está vacío";
    } else {
      if (!formData.mail.includes("@") || !formData.mail.includes(".")) {
        newErrors.mail = "Ingrese un email válido";
      }
    }

    if (formData.contraseña.trim() === "") {
      newErrors.contraseña = "El campo contraseña está vacío";
    } else if (formData.contraseña.length < 8) {
      newErrors.contraseña = "La contraseña debe tener al menos 8 caracteres";
    }

    if (formData.repetirContraseña.trim() === "") {
      newErrors.repetirContraseña = "Debe repetir la contraseña";
    } else if (formData.contraseña !== formData.repetirContraseña) {
      newErrors.repetirContraseña = "Las contraseñas no coinciden";
    }

    if (formData.fechaNacimiento.trim() === "") {
      newErrors.fechaNacimiento = "Debe ingresar su fecha de nacimiento";
    }

    return newErrors;
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setRegistroExitoso(true);
    }
  }

  return (
    <form id="formulario" className={styles.formulario} onSubmit={handleSubmit} noValidate>
      <p>Por favor ingresá tus datos para crear una cuenta</p>

      <div className={styles.campos}>
        <div className={styles.campo}>
          <label htmlFor="nickName">Nickname *</label>
          <input type="text" name="nickName" id="nickName" className={`form-control ${errors.nickName ? "is-invalid" : ""}`} value={formData.nickName} onChange={handleChange} />
          {errors.nickName && (
            <div className="invalid-feedback">{errors.nickName}</div>
          )}
        </div>

        <div className={styles.campo}>
          <label htmlFor="mail">Mail *</label>
          <input type="email" name="mail" id="mail" className={`form-control ${errors.mail ? "is-invalid" : ""}`} value={formData.mail} onChange={handleChange} />
          {errors.mail && (
            <div className="invalid-feedback">{errors.mail}</div>
          )}
        </div>

        <div className={styles.campo}>
          <label htmlFor="contraseña">Contraseña *</label>
          <input type="password" name="contraseña" id="contraseña" className={`form-control ${errors.contraseña ? "is-invalid" : ""}`} value={formData.contraseña} onChange={handleChange} />
          {errors.contraseña && (
            <div className="invalid-feedback">{errors.contraseña}</div>
          )}
        </div>

        <div className={styles.campo}>
          <label htmlFor="repetirContraseña">Repetir contraseña *</label>
          <input type="password" name="repetirContraseña" id="repetirContraseña" className={`form-control ${errors.repetirContraseña ? "is-invalid" : ""}`} value={formData.repetirContraseña} onChange={handleChange} />
          {errors.repetirContraseña && (
            <div className="invalid-feedback">{errors.repetirContraseña}</div>
          )}
        </div>

        <div className={styles.campo}>
          <label htmlFor="fechaNacimiento">Fecha de nacimiento *</label>
          <input type="date" name="fechaNacimiento" id="fechaNacimiento" className={`form-control ${errors.fechaNacimiento ? "is-invalid" : ""}`} value={formData.fechaNacimiento} onChange={handleChange} />
          {errors.fechaNacimiento && (
            <div className="invalid-feedback">{errors.fechaNacimiento}</div>
          )}
        </div>
      </div>

      {registroExitoso && (
        <div className="alert alert-success">
          ¡Formulario completado correctamente!
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Crear cuenta
      </button>
    </form>
  );
}

export default FormularioRegistro;