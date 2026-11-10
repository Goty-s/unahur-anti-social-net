
import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { useState } from "react";

function LoginForm() {
  return (
    <div>
      <h1>Formulario de login</h1>
    </div>
  )
}

export default LoginForm

/*
    AGREGAR CUANDO SE HAGA EL FORMULARIO


    
  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      navigate(`/Profile/${elUsuario.id de GET /users/:id}`);
    } 
    -Toby
*/