import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', search: '', sort: '' });
    const location = useLocation();

    const fetchProducts = async () => {
        const params = new URLSearchParams(filters).toString();
        const res = await axios.get(`${SERVER_HOST}/products?${params}`);
        setProducts(res.data);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category') || '';
        setFilters(prev => ({ ...prev, category }));
    }, [location.search]);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.product._id === product._id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="ag_productsPage">
            <div className="ag_filters">
                <input name="search" placeholder="Search" onChange={handleChange} />
                <select name="category" value={filters.category} onChange={handleChange}>
                    <option value="">All Categories</option>
                    <option value="Star Wars">Star Wars</option>
                    <option value="Technic">Technic</option>
                    <option value="City">City</option>
                    <option value="Creator">Creator</option>
                </select>
                <input name="minPrice" placeholder="Min price" type="number" onChange={handleChange} />
                <input name="maxPrice" placeholder="Max price" type="number" onChange={handleChange} />
                <select name="sort" onChange={handleChange}>
                    <option value="">Sort</option>
                    <option value="price">Price low-high</option>
                    <option value="-price">Price high-low</option>
                    <option value="name">Name A-Z</option>
                </select>
            </div>

            <div className="ag_productGrid">
                {products.map(product => (
                    <div key={product._id} className="ag_productCard">
                        {product.images?.[0] && (
                            <img src={product.images[0]} alt={product.name} />
                        )}
                        <h3>{product.name}</h3>
                        <p className="ag_description">{product.description}</p>
                        <p className="ag_price">€{product.price}</p>
                        <button className="ag_addToCart" onClick={() => addToCart(product)}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;