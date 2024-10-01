import './Highlight.css';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import React, { useState, useEffect } from 'react';

function Highlight() {
    const [categories, setCategories] = useState([]);
    const [highlights, setHighlights] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3030/api/categories/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });

        fetch('http://localhost:3030/api/items/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const filteredHighlights = data.filter(highlight => highlight.highlighted === true);
                setHighlights(filteredHighlights);
            })
            .catch(error => {
                console.error('Error fetching highlights:', error);
            });
    }, []);

    function Tags({ tags }) {
        return (
            <div className="tags">
                {tags.map((tag, index) => (
                    <span key={index} className="tag">
                        {tag}{index < tags.length - 1 && ' • '}
                    </span>
                ))}
            </div>
        );
    }

    // Establecemos una clase dinámica en función del número de items
    const highlightClass = highlights.length === 1
        ? 'highlight-single'
        : highlights.length === 2
        ? 'highlight-double'
        : 'highlight-triple';

    return (
        <div className={`highlight ${highlightClass}`}>
            {highlights.slice(0, 3).map((highlight) => {
                const category = categories.find(cat => cat.id === highlight.categoryId);

                return (
                    <div key={highlight.id} className="highlight-item"
                        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.781), rgba(0, 0, 0, 0.521)), url(http://localhost:3030/assets/images/${highlight.image})` }}>
                        <div>
                            <h3>{highlight.title}</h3>
                            <a href="#">{highlight.description}
                                <i>
                                    <FaArrowUpRightFromSquare />
                                </i>
                            </a>
                            <i>{category ? category.description : 'Cargando categorías...'}</i>
                            <Tags tags={[category ? category.name : 'Cargando etiquetas...']} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Highlight;
