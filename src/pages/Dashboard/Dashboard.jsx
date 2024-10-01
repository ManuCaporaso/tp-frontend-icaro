import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import'./Dashboard.css'


function Dashboard() {
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
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
    if (decodedToken.role === 'admin') {
      return navigate('/dashboard-admin');
    }

    fetchUserDetails(decodedToken.id, token);
    fetchUserPurchases(token);
  }, [navigate]);

  const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  const fetchUserPurchases = async (token) => {
    try {
      const response = await fetch('http://localhost:3030/api/purchases', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las compras del usuario');
      }

      const data = await response.json();
      console.log('Datos de las compras obtenidos:', data);
      setPurchases(data.purchases);
    } catch (error) {
      console.error('Error al obtener compras:', error);
      navigate('/account');
    }
  };

  const fetchUserDetails = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3030/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
      }

      const data = await response.json();
      console.log('Datos del usuario obtenidos:', data);
      setUser(data);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      navigate('/account');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/account');
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  const { firstName, lastName, fullAddress } = user;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Dashboard</h1>
      <div className="card mb-4 mx-auto">
        <div className="card-body">
          <h5 className="card-title">Bienvenido, {firstName} {lastName}</h5>
          <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>

      <h2>Tus compras</h2>
      {purchases.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Enviado a</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.Item ? purchase.Item.title : 'Producto no disponible'}</td>
                <td>{purchase.Item ? `$${Number(purchase.Item.price).toFixed(2)}` : '-'}</td>
                <td>{purchase.quantity}</td>
                <td>{`$${Number(purchase.totalPrice).toFixed(2)}`}</td>
                <td>
                  {purchase.sendPurchase
                    ? (fullAddress || 'Dirección no disponible')
                    : 'Producto retirado en la tienda'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No has realizado ninguna compra aún.</p>
      )}
      <a href="/" className="btn btn-primary my-3">Volver a la tienda</a>
    </div>
  );
}

export default Dashboard;
