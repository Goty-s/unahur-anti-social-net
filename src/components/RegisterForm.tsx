import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { createUser } from "../services/api";

interface RegisterData {
  nickName: string;
  mail: string;
};

type RegisterErrors = Partial<{
  nickName: string;
  mail: string;
}>;

interface RegisterFormProps {
  backToLogn?: () => void;
}

function RegisterForm({ backToLogn }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterData>({
    nickName: "",
    mail: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [errorsServer, seterrorsServer] = useState("")
  const [successfulRegister, setsuccessfulRegister] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setsuccessfulRegister(false);
  }

  function validateForm() {
    const newErrors: RegisterErrors = {};

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
        setsuccessfulRegister(true);
        backToLogn?.();
      } catch (error) {
        seterrorsServer(error instanceof Error ? error.message : "No se pudo crear el usuario");
      }
    }
  }

  return (
    <form id="formulario" onSubmit={handleSubmit} noValidate>
      <p>Por favor ingresá tus datos para crear una cuenta</p>
      <div>
        <div>
          <label htmlFor="nickName">Nickname *</label>
          <input type="text" name="nickName" id="nickName" className={`form-control ${errors.nickName ? "is-invalid" : ""}`} value={formData.nickName} onChange={handleChange} />
          {errors.nickName && (
            <div className="invalid-feedback">{errors.nickName}</div>
          )}
        </div>
        <div>
          <label htmlFor="mail">Mail *</label>
          <input type="email" name="mail" id="mail" className={`form-control ${errors.mail ? "is-invalid" : ""}`} value={formData.mail} onChange={handleChange} />
          {errors.mail && (
            <div className="invalid-feedback">{errors.mail}</div>
          )}
        </div>
      </div>
      {successfulRegister && (
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

export default RegisterForm;