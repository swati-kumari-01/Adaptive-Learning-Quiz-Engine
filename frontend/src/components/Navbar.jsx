import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom position-absolute w-100" style={{ zIndex: 1000 }}>
            <div className="container">
                <Link className="navbar-brand fw-bold fs-4 text-white" to="/" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Adaptive Learning Quiz Engine
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav align-items-center gap-3">
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-medium" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-medium" to="/about">
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="btn btn-outline-light px-4 rounded-pill" to="/login">
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="btn btn-primary px-4 rounded-pill" to="/register" style={{ backgroundColor: "#6C63FF", borderColor: "#6C63FF" }}>
                                Register
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white-50 small" to="/admin">
                                Admin
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
