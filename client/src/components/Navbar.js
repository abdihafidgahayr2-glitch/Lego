import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    };

    return (
        <nav className="ag_navbar">
            <Link to="/" className="ag_navLink">Home</Link>
            <Link to="/products" className="ag_navLink">Products</Link>
            <Link to="/cart" className="ag_navLink">Cart</Link>

            {!token ? (
                <>
                    <Link to="/login" className="ag_navLink">Login</Link>
                    <Link to="/register" className="ag_navLink">Register</Link>
                </>
            ) : (
                <>
                    <Link to="/orders" className="ag_navLink">Orders</Link>
                    <Link to="/profile" className="ag_navLink">Profile</Link>
                    {role === 'admin' && (
                        <Link to="/admin" className="ag_navLink">Admin</Link>
                    )}
                    <button onClick={handleLogout} className="ag_logoutBtn">Logout</button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
