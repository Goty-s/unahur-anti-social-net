import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { ModalLogin } from "./index";

function Navbar() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [estaLogueado, setEstaLogueado] = useState(true);
    const { pathname } = useLocation();
    const isProfile = pathname === "/profile";
    return (
        <>
            <nav className={styles.navbar}>
                <button onClick={() => setEstaLogueado(!estaLogueado)}>
                    {estaLogueado ? "Simular logout" : "Simular login"}
                </button> {/*Esto lo sacamos una vez que tengamos hecho el login. Ahora esta para ver el comportamiento del nav dependiendo si esta logueado o no. - Toby*/}
                <ul>
                    <li>
                        <NavLink to="/" >
                            <i className="bi bi-house-door-fill"></i>
                        </NavLink>
                    </li>
                    {estaLogueado ? (
                        <>
                            <li>
                                <NavLink to="/crear-post" >
                                    <i className="bi bi-pencil-square"></i>
                                </NavLink>
                            </li>
                            {isProfile ? (
                                <li>
                                    <NavLink
                                        to="/"
                                        onClick={() => setEstaLogueado(false)}
                                    >
                                        <i className="bi bi-box-arrow-left"></i>
                                    </NavLink>
                                </li>
                            ) : (
                                <li>
                                    <NavLink to="/profile" >
                                        <i className="bi bi-person"></i>
                                    </NavLink>
                                </li>)}
                        </>
                    ) : (
                        <li>
                            <NavLink to="/" type="button" onClick={(e) => { e.preventDefault();setMostrarModal(true); }}>
                                <i className="bi bi-box-arrow-in-right"></i>
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>

            <ModalLogin mostrar={mostrarModal} cerrarModal={() => setMostrarModal(false)} />
        </>
    )
}

export default Navbar
