import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Highlight from '../../components/Highlight/Highlight';
import Items from '../../components/Items/Items';
import Filters from '../../components/Filters/Filters'; 
import Categories from '../../components/Categories/Categories'; 

import'./Home.css'

const Home = ({ addToCart, cart, setCart }) => {
  const [activeCategory, setActiveCategory] = useState(1); // 1 será 'All' o 'Todos'
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetch('http://localhost:3030/api/items/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error de HTTP! Estado: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Productos obtenidos:', data);
        setItems(data);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

  const filteredItems = items
    .filter(item =>
      activeCategory === 1 || item.categoryId === activeCategory
    )
    .filter(item =>
      searchTerm === '' || item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item =>
      (minPrice === '' || item.price >= parseFloat(minPrice)) &&
      (maxPrice === '' || item.price <= parseFloat(maxPrice))
    )
    .sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);

  return (
    <>
      <Header cart={cart} setCart={setCart} />
      <Highlight />
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <Categories
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <Items addToCart={addToCart} filteredItems={filteredItems} />
      <Footer />
    </>
  );
};

export default Home;
