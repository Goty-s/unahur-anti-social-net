import styles from "./Navbar.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ModalLogin } from "./index";
import { useAuth } from "../context/usuarioContext";

function Navbar() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const { pathname } = useLocation();
    const isProfile = pathname === "/profile";
    const navigate = useNavigate();
    return (
        <>
            <nav className={styles.navbar}>
                <ul>
                    <li>
                        <NavLink to="/">
                            <i className="bi bi-house-door-fill"></i>
                        </NavLink>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li>
                                <NavLink to="/crear-post">
                                    <i className="bi bi-pencil-square"></i>
                                </NavLink>
                            </li>
                            {isProfile ? (
                                <li>
                                    <NavLink
                                        to="/"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            logout();
                                            navigate("/");
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-left"></i>
                                    </NavLink>
                                </li>
                            ) : (
                                <li>
                                    <NavLink to="/profile">
                                        <i className="bi bi-person"></i>
                                    </NavLink>
                                </li>
                            )}
                        </>
                    ) : (
                        <li>
                            <NavLink
                                to="/"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setMostrarModal(true);
                                }}
                            >
                                <i className="bi bi-box-arrow-in-right"></i>
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>

            <ModalLogin mostrar={mostrarModal} cerrarModal={() => setMostrarModal(false)} />
        </>
    );
}

export default Navbar;