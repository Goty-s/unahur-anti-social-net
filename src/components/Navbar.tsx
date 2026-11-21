import styles from "./Navbar.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginModal, NewPostModal } from "./index";
import { useAuth } from "../context/userContext";
import { useLogin } from "../context/LoginContext";

function Navbar() {
    const { isAuthenticated, logout} = useAuth();
    const {showLogin, setShowLogin} = useLogin();
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const { pathname } = useLocation();
    const isProfile = pathname === "/profile";
    const navigate = useNavigate();
    return (
        <>
            <nav className={styles.navbar}>
                <ul>
                    <li>
                        <NavLink to="/" title="Home" aria-label="Home">
                            <i className="bi bi-house-door-fill" aria-hidden="true"></i>
                        </NavLink>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li>
                                <NavLink to="/" onClick={(e) => { e.preventDefault(); setShowNewPostModal(true); }} title="Create new post" aria-label="Create new post">
                                    <i className="bi bi-pencil-square" aria-hidden="true"></i>
                                </NavLink>
                            </li>
                            {isProfile ? (
                                <li>
                                    <NavLink to="/" onClick={(e) => { e.preventDefault(); logout(); navigate("/"); }} title="Logout" aria-label="Logout">
                                        <i className="bi bi-box-arrow-left" aria-hidden="true"></i>
                                    </NavLink>
                                </li>
                            ) : (
                                <li>
                                    <NavLink to="/profile" title="Profile" aria-label="Profile">
                                        <i className="bi bi-person" aria-hidden="true"></i>
                                    </NavLink>
                                </li>
                            )}
                        </>
                    ) : (
                        <li>
                            <NavLink to="/"
                                onClick={(e) => { e.preventDefault(); setShowLogin(true); }} title="Login" aria-label="Login">
                                <i className="bi bi-box-arrow-in-right" aria-hidden="true"></i>
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>

            <LoginModal show={showLogin} closeModal={() => setShowLogin(false)} />
            <NewPostModal show={showNewPostModal} closeModal={() => setShowNewPostModal(false)} />
        </>
    );
}

export default Navbar;