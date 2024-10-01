import './Items.css';
import { MdAddShoppingCart } from "react-icons/md";
import React from 'react';

const Items = ({ addToCart, filteredItems }) => {
    const handleAddToCart = (item) => {
        console.log('Item added to cart:', item);
        addToCart(item);
    };

    return (
        <div className='items'>
            {filteredItems.map((item) => (
                <div className="card" key={item.id}>
                    <img 
                        src={`http://localhost:3030/assets/images/${item.image}`} 
                        alt={item.title} 
                    />
                    <h1>{item.title}</h1>
                    <p className="price">$ {item.price}</p>
                    <p>{item.description}</p>
                    <i>{item.category.name}</i>
                    <p>
                        <button onClick={() => handleAddToCart(item)}>
                            Agregar al carrito <MdAddShoppingCart />
                        </button>
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Items;

