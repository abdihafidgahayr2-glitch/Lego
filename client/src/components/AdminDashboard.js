import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

const emptyForm = { name: '', description: '', price: '', category: '', stock: '' };

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [productError, setProductError] = useState('');

    const [users, setUsers] = useState([]);
    const [userOrders, setUserOrders] = useState(null);
    const [viewingUserName, setViewingUserName] = useState('');

    const token = localStorage.getItem('token');
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    const fetchProducts = async () => {
        const res = await axios.get(`${SERVER_HOST}/products`);
        setProducts(res.data);
    };

    const fetchUsers = async () => {
        const res = await axios.get(`${SERVER_HOST}/users`, authHeader);
        setUsers(res.data);
    };

    useEffect(() => {
        fetchProducts();
        fetchUsers();
    }, []);

    const validateForm = () => {
        if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
            setProductError('Name, description, and category are all required');
            return false;
        }
        if (!form.price || Number(form.price) <= 0) {
            setProductError('Price must be a positive number');
            return false;
        }
        if (form.stock === '' || Number(form.stock) < 0) {
            setProductError('Stock must be zero or a positive whole number');
            return false;
        }
        setProductError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (editingId) {
                await axios.put(`${SERVER_HOST}/products/${editingId}`, form, authHeader);
            } else {
                await axios.post(`${SERVER_HOST}/products`, form, authHeader);
            }
            fetchProducts();
            setForm(emptyForm);
            setEditingId(null);
        } catch (err) {
            setProductError(err.response?.data?.message || 'Failed to save product');
        }
    };

    const startEdit = (product) => {
        setEditingId(product._id);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
        setProductError('');
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Delete this product?')) {
            await axios.delete(`${SERVER_HOST}/products/${id}`, authHeader);
            fetchProducts();
        }
    };

    const updateStock = async (id, newStock) => {
        if (newStock === '' || Number(newStock) < 0) return;
        await axios.patch(`${SERVER_HOST}/products/${id}/stock`, { stock: Number(newStock) }, authHeader);
        fetchProducts();
    };

    const deleteUser = async (id) => {
        if (window.confirm('Delete this user?')) {
            await axios.delete(`${SERVER_HOST}/users/${id}`, authHeader);
            fetchUsers();
        }
    };

    const viewUserOrders = async (id, name) => {
        const res = await axios.get(`${SERVER_HOST}/orders/user/${id}`, authHeader);
        setUserOrders(res.data);
        setViewingUserName(name);
    };

    return (
        <div>
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
            {productError && <p className="ag_formError">{productError}</p>}
            <form className="ag_adminForm" onSubmit={handleSubmit}>
                <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                <button type="submit">{editingId ? 'Save Changes' : 'Add'}</button>
                {editingId && <button type="button" onClick={cancelEdit}>Cancel</button>}
            </form>

            <h2>Product List</h2>
            <div className="ag_adminProductList">
                {products.map(p => (
                    <div key={p._id} className="ag_adminProductCard">
                        <span>{p.name} - €{p.price} - Stock: {p.stock}</span>
                        <input
                            type="number"
                            placeholder="New stock"
                            min="0"
                            onBlur={e => updateStock(p._id, e.target.value)}
                        />
                        <button onClick={() => startEdit(p)}>Edit</button>
                        <button onClick={() => deleteProduct(p._id)}>Delete</button>
                    </div>
                ))}
            </div>

            <h2>Users</h2>
            <div className="ag_adminProductList">
                {users.map(u => (
                    <div key={u._id} className="ag_adminProductCard">
                        <span>{u.name} - {u.email} - {u.role}</span>
                        <button onClick={() => viewUserOrders(u._id, u.name)}>View Orders</button>
                        <button onClick={() => deleteUser(u._id)}>Delete</button>
                    </div>
                ))}
            </div>

            {userOrders && (
                <div>
                    <h3>Orders for {viewingUserName}</h3>
                    <button onClick={() => setUserOrders(null)}>Close</button>
                    {userOrders.length === 0 ? (
                        <p>No orders for this user</p>
                    ) : (
                        userOrders.map(o => (
                            <div key={o._id} className="ag_orderItem">
                                <span>Order #{o._id} – €{o.totalAmount} – {o.status}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
