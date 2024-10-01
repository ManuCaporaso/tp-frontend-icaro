import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [sendPurchase, setSendPurchase] = useState(false);
  const [errorMessage, seterrorMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {

    const storederrorMessage = localStorage.getItem('errorMessage');
    if (storederrorMessage) {
      seterrorMessage(storederrorMessage);
      localStorage.removeItem('errorMessage');
    }

    if (!token) {
      localStorage.setItem('errorMessage', 'Debes iniciar sesión para realizar la compra.');
      navigate('/account');
      return;
    }

    if (isTokenExpired(token)) {
      localStorage.setItem('errorMessage', 'Tu sesión ha expirado.');
      localStorage.removeItem('token');
      navigate('/account');
      return;
    }

    const decodedToken = jwtDecode(token);
    if (decodedToken.role === 'admin') {
      navigate('/dashboard-admin');
      return;
    }
    fetchUserData(decodedToken.id);
  }, [navigate, token]);

  const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3030/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`${errorData.error}`);
        return;
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      alert('Hubo un error al obtener los datos del usuario. Inténtalo de nuevo.');
    }
  };

  const handlePurchase = async () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const purchases = cart.map(item => ({
      itemId: item.id,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity
    }));

    try {
      const response = await fetch('http://localhost:3030/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ purchases, sendPurchase })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      } else {
        alert('¡Compra realizada con éxito!');
        localStorage.removeItem('cart');
        window.location.reload();
      }
    } catch (error) {
      alert('Hubo un error al realizar la compra. Inténtalo de nuevo.');
    }
  };


  const handleRemove = (itemId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
  };

  const handleIncrease = (itemId) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (itemId) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className='container mt-4'>
      <h2 className="text-center">Carrito</h2>
      {cart.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="list-group">
            {cart.map((item) => (
              <li className="list-group-item d-flex align-items-center justify-content-between m-1" key={item.id}>
                <div className="d-flex align-items-center">
                  <img
                    src={`http://localhost:3030/assets/images/${item.image}`}
                    alt={item.title}
                    className="img-thumbnail me-3"
                    style={{ width: "60px", height: "60px" }}
                  />
                  <div>
                    <h5 className="mb-1">{item.title}</h5>
                    <p className="mb-1 text-muted">{item.description}</p>
                    <p className="mb-1">Precio por unidad: ${item.price}</p>
                    <p className="mb-0">Cantidad: {item.quantity}</p>
                    Total: {item.quantity} x ${item.price.toFixed(2)} =  ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
                <div>
                  <button className="btn btn-secondary btn-sm me-1" onClick={() => handleIncrease(item.id)}>+</button>
                  <button className="btn btn-secondary btn-sm me-1" onClick={() => handleDecrease(item.id)}>-</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-center mt-4">
            <h4>Total: $ {totalAmount.toFixed(2)}</h4>
            <button
              id="purchaseButton"
              className="btn btn-success"
              onClick={handlePurchase}
            >
              Finalizar Compra
            </button>
          </div>

          <div className="form-check mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="sendPurchaseCheckbox"
              checked={sendPurchase}
              onChange={(e) => setSendPurchase(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="sendPurchaseCheckbox">
              Envio a domicilio por Andreani / OCA Postal
            </label>
          </div>
        </>
      )}

      {sendPurchase && userData ? (
        <div className="user-data mt-4">
          <h4>Datos de Envío</h4>
          <p>Provincia: {userData.province}</p>
          <p>Ciudad: {userData.city}</p>
          <p>Código Postal: {userData.postalCode}</p>
          <p>Dirección: {userData.address}</p>
          <p>Tu Teléfono: {userData.phone}</p>
        </div>
      ) : cart.length > 0 ? (
        <div className="store-info mt-4">
          <h4>Retiro en Sucursal</h4>
          <p>Dirección: Calle Las petunias 5617</p>
          <p>Horario de Retiro: Lunes a Viernes, 8:00 AM - 18:00 PM</p>
          <p>Teléfono: (299) 456-7890</p>
        </div>
      ) : null}

      <a href="/" className="btn btn-primary my-3">Volver a la Tienda</a>
    </div>
  );
};

export default Cart;
