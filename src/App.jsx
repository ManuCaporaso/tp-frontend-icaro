import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import LoginSignupPage from './pages/LoginSignupPage/LoginSignupPage';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

function App() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  useEffect(function() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    setCart(function(prevCart) {
      const i = prevCart.findIndex(function(cartItem) {
        return cartItem.id === item.id;
      });

      //const i = prevCart.findIndex(cartItem => cartItem.id === item.id);

      if (i > -1) {
        const updatedCart = prevCart.slice(); 
        updatedCart[i] = {...updatedCart[i],quantity: updatedCart[i].quantity + 1};
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return updatedCart;
      } else {
        const updatedCart = prevCart.concat({ ...item, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return updatedCart;
      }
    });
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home addToCart={addToCart} cart={cart} setCart={setCart} />, 
    },
    {
      path: "/cart",
      element: <Cart cart={cart} setCart={setCart}/>,
      
    },
    {
      path: "/account",
      element: <LoginSignupPage/>,
    },
    {
      path: "/dashboard",
      element: <Dashboard/>,
    },
    {
      path: "/dashboard-admin",
      element: <AdminDashboard/>,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
