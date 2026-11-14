import styles from "./Navbar.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginModal, NewPostModal } from "./index";
import { useAuth } from "../context/usuarioContext";

function Navbar() {
    const { isAuthenticated, logout, mostrarLogin, setMostrarLogin } = useAuth();
    const [showNewPostModal, setShowNewPostModal] = useState(false);
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
                                <NavLink to="/" onClick={(e) => { e.preventDefault(); setShowNewPostModal(true); }}>
                                    <i className="bi bi-pencil-square"></i>
                                </NavLink>
                            </li>
                            {isProfile ? (
                                <li>
                                    <NavLink to="/" onClick={(e) => { e.preventDefault(); logout(); navigate("/"); }}>
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
                            <NavLink to="/"
                                onClick={(e) => { e.preventDefault(); setMostrarLogin(true); }}>
                                <i className="bi bi-box-arrow-in-right"></i>
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>

            <LoginModal mostrar={mostrarLogin} cerrarModal={() => setMostrarLogin(false)} />
            <NewPostModal mostrar={showNewPostModal} cerrarModal={() => setShowNewPostModal(false)} />
        </>
    );
}

export default Navbar;