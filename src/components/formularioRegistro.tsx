import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import styles from "./FormularioRegistro.module.css";
import { createUser } from "../services/api";

interface RegistroData {
  nickName: string;
  mail: string;
};

type RegistroErrors = Partial<{
  nickName: string;
  mail: string;
}>;

interface FormularioRegistroProps {
  backToLogn?: () => void;
}

function FormularioRegistro({ backToLogn }: FormularioRegistroProps) {
  const [formData, setFormData] = useState<RegistroData>({
    nickName: "",
    mail: "",
  });

  const [errors, setErrors] = useState<RegistroErrors>({});
  const [errorsServer, seterrorsServer] = useState("")
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
    return newErrors;
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    seterrorsServer("");

    if (Object.keys(newErrors).length === 0) {
      try {
        await createUser({ nickName: formData.nickName, email: formData.mail });
        setRegistroExitoso(true);
        backToLogn?.();
      } catch (error) {
        seterrorsServer(error instanceof Error ? error.message : "No se pudo crear el usuario");
      }
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
      </div>
      {registroExitoso && (
        <div className="alert alert-success">
          ¡Formulario completado correctamente!
        </div>
      )}
      {errorsServer && (
        <div className="alert alert-danger">
          {errorsServer}
        </div>
      )}
      <button type="submit" className="btn btn-primary mt-2">
        Crear cuenta
      </button>
    </form>
  );
}

export default FormularioRegistro;