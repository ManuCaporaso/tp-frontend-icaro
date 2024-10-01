import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';

import './LoginSignupPage.css'
function LoginSignupPage() {
    const [errorMessage, seterrorMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const storederrorMessage = localStorage.getItem('errorMessage');
        if (storederrorMessage) {
            seterrorMessage(storederrorMessage);
            localStorage.removeItem('errorMessage');
        }
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (isTokenExpired(token)) {
                localStorage.setItem('errorMessage', 'Tu sesión ha expirado.');

                localStorage.removeItem('token');
                return navigate('/account');
            }
            if (decodedToken.role === 'admin') {
                navigate('/dashboard-admin');
            } else {
                navigate('/dashboard');
            }
        }

    }, [navigate]);

    const isTokenExpired = (token) => {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin
            ? 'http://localhost:3030/api/users/login'
            : 'http://localhost:3030/api/users/signup';

        const bodyData = isLogin
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.error || 'Error en la solicitud');
            }

            const data = await response.json();

            if (isLogin && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('role', data.role);
                alert('Login exitoso');

                const decodedToken = jwtDecode(localStorage.getItem('token'));

                if (decodedToken.role === 'admin') {
                    navigate('/dashboard-admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert('Usuario registrado exitosamente');
                navigate('/dashboard');
            }

        } catch (error) {
            setError(error.message || 'Error inesperado');
        }
    };

    return (
        <div className="container mt-5">
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

            <div className={`  mx-auto p-5 ${isLogin ? 'card' : 'd-flex flex-column my-5 mx-auto border rounded shadow-lg'}`} style={isLogin ? {} : { width: '40rem' }}>
                <h2 className="text-center">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>
                {error && <p className="text-danger text-center">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Teléfono</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    pattern="[0-9]*"
                                    title="El teléfono debe contener solo números."
                                    onInput={(e) => e.target.value = e.target.value.replace(/\s+/g, '')}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Dirección</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Ciudad</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Provincia</label>
                                <input
                                    type="text"
                                    name="province"
                                    className="form-control"
                                    value={formData.province}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Código postal</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    className="form-control"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    pattern="[0-9]*"
                                    title="El código postal debe contener solo números."
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        {isLogin ? 'Iniciar sesión' : 'Registrarse'}
                    </button>
                </form>

                <button onClick={toggleForm} className="btn btn-link w-100 mt-3">
                    {isLogin ? 'Crear una cuenta' : '¿Ya tenés una cuenta? Iniciar sesión'}
                </button>
            </div>
        </div>
    );
}

export default LoginSignupPage;
