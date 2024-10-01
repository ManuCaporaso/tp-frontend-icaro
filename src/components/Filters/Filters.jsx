import React from 'react';
import './Filters.css';

const Filters = ({ searchTerm, setSearchTerm, minPrice, setMinPrice, maxPrice, setMaxPrice, sortOrder, setSortOrder }) => {
    return (
        <div className="filters">
            <input
                type="text"
                placeholder="Busqueda por nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
                type="number"
                placeholder="Menor precio"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
                type="number"
                placeholder="Maximo precio"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button onClick={() => setSortOrder('asc')}>Ordenar: Precio menor</button>
            <button onClick={() => setSortOrder('desc')}>Ordenar: Precio mayor</button>
        </div>
    );
};

export default Filters;
