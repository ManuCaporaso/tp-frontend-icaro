import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import 'bootstrap/dist/css/bootstrap.min.css';

const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
};

function AdminDashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ title: '', price: '', description: '', categoryId: '', image: null, highlighted: false });
    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const token = localStorage.getItem('token');
    const [categories, setCategories] = useState([]);
    const [errorMessage, seterrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const storederrorMessage = localStorage.getItem('errorMessage');
        if (storederrorMessage) {
          seterrorMessage(storederrorMessage);
          localStorage.removeItem('errorMessage');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            return navigate('/account');
        }
        if (isTokenExpired(token)) {
            localStorage.setItem('errorMessage', 'Tu sesión ha expirado.');

            localStorage.removeItem('token');
            return navigate('/account');
        }
        const decodedToken = jwtDecode(token);
        if (decodedToken.role !== 'admin') {
            return navigate('/dashboard');
        }

        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:3030/api/items', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3030/api/categories', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        };

        fetchItems();
        fetchCategories();
    }, [token]);

    const isTokenExpired = (token) => {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    };

    const handleCancelEdit = () => {
        setFormData({ title: '', price: '', description: '', categoryId: '', image: null, highlighted: false });
        setIsEditing(false);
        setEditItemId(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        navigate('/account');
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3030/api/items/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'highlighted') {
            const highlightedCount = items.filter(item => item.highlighted).length;
            if (checked && highlightedCount >= 3) {
                alert('Solo puedes marcar hasta 3 elementos como destacados.');
                return;
            }
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
    };

    const handleCreate = async () => {
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('categoryId', formData.categoryId);
            data.append('highlighted', formData.highlighted);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await fetch('http://localhost:3030/api/items', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: data,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const newItem = await response.json();
            setItems((prevItems) => [...prevItems, newItem]);
            setFormData({ title: '', price: '', description: '', categoryId: '', image: null, highlighted: false });
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (item) => {
        alert("El producto ha sido agregado al formulario para ser editado.");
        setFormData({
            title: item.title,
            price: item.price,
            description: item.description,
            categoryId: item.categoryId,
            image: null,
            highlighted: item.highlighted
        });
        setIsEditing(true);
        setEditItemId(item.id);
    };

    const handleUpdate = async () => {
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('categoryId', formData.categoryId);
            data.append('highlighted', formData.highlighted);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await fetch(`http://localhost:3030/api/items/${editItemId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: data,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const updatedItem = await response.json();
            setItems((prevItems) =>
                prevItems.map((item) => (item.id === editItemId ? updatedItem : item))
            );
            setFormData({ title: '', price: '', description: '', categoryId: '', image: null, highlighted: false });
            setIsEditing(false);
            setEditItemId(null);
        } catch (error) {
            console.error('Error al actualizar producto:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            handleUpdate();
        } else {
            handleCreate();
        }
    };

    if (loading) {
        return <div className="alert alert-info">Cargando productos...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">Error: {error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Admin Dashboard</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="mb-5">
                <div className="form-group mb-3">
                    <label htmlFor="title">Titulo</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="price">Precio</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="description">Descripción Corta</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        maxLength={130}
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="categoryId">Categría</label>
                    <select
                        className="form-control"
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Elige una categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="image">{isEditing ? 'Imagen (si no se elige una, se conservará la anterior).' : 'Imagen '}</label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="form-group m-1">
                    <label style={{ marginRight: '10px' }}>
                        <input
                            type="checkbox"
                            name="highlighted"
                            checked={formData.highlighted}
                            onChange={handleInputChange}
                        />
                        Destacar
                    </label>
                </div>

                <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar' : 'Agregar'}</button>
                {isEditing && (
                    <button
                        type="button"
                        className="btn btn-secondary mx-2"
                        onClick={handleCancelEdit}
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <h2>Lista de Productos</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Titulo</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Destacado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <img
                                    src={`http://localhost:3030/assets/images/${item.image}`}
                                    alt={item.title}
                                    style={{ width: "60px", height: "60px" }}
                                />
                            </td>
                            <td>{item.title}</td>
                            <td>{item.price}</td>
                            <td>{item.description}</td>
                            <td>{item.categoryId} - {item.category ? item.category.name : 'Cargando...'} </td>
                            <td>{item.highlighted ? 'Sí' : 'No'}</td>
                            <td>
                                <button className="btn btn-warning m-2" onClick={() => handleEdit(item)}>Editar</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-secondary" onClick={handleLogout}>Cerrar sesión</button>
            <a href="/" className="btn btn-primary m-3">Volver a la tienda</a>
        </div>
    );
}

export default AdminDashboard;
