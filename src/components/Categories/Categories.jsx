import React, { useState, useEffect } from 'react';
import './Categories.css';

const Categories = ({ activeCategory, setActiveCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3030/api/categories/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Categories fetched:', data);
                setCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
        <div className="categories">
            {categories.map((category) => (
                <span
                    key={category.id}
                    className={`category ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                >
                    <p>{category.name}</p>
                </span>
            ))}
        </div>
    );
};

export default Categories;
