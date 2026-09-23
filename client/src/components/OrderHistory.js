import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;
        axios.get(`${SERVER_HOST}/orders/my-orders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));
    }, [token]);

    const handleReturn = async (orderId) => {
        await axios.put(`${SERVER_HOST}/orders/${orderId}/return`, {}, { headers: { Authorization: `Bearer ${token}` } });
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'returned' } : o));
    };

    return (
        <div>
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders yet.</p>
            ) : (
                orders.map(order => (
                    <div key={order._id} className="ag_orderItem">
                        <span>Order #{order._id} – €{order.totalAmount} – Status: {order.status}</span>
                        {order.status !== 'returned' && (
                            <button onClick={() => handleReturn(order._id)}>Return</button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;
