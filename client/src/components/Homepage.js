import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div>
            <div className="ag_hero">
                <h1>Welcome to Lego Shop</h1>
                <p>Discover the best Lego sets for builders of all ages!</p>
                <Link to="/products" className="ag_heroLink">Browse Products</Link>
            </div>

            <div className="ag_categories">
                <Link to="/products?category=Star%20Wars" className="ag_categoryCard">Star Wars</Link>
                <Link to="/products?category=Technic" className="ag_categoryCard">Technic</Link>
                <Link to="/products?category=City" className="ag_categoryCard">City</Link>
                <Link to="/products?category=Creator" className="ag_categoryCard">Creator</Link>
            </div>

            <div className="ag_featured">
                <h2>Featured Products</h2>
                <div className="ag_productGrid">
                    <p>Check out our latest Lego sets!</p>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
