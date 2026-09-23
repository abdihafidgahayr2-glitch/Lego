import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestAddress, setGuestAddress] = useState('');
    const [checkoutError, setCheckoutError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(stored);
        recalculateTotal(stored);
    }, []);

    const recalculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotal(sum);
    };

    const updateQty = (id, delta) => {
        const newCart = cart.map(item => {
            if (item.product._id === id) {
                const qty = item.quantity + delta;
                return qty > 0 ? { ...item, quantity: qty } : null;
            }
            return item;
        }).filter(Boolean);

        localStorage.setItem('cart', JSON.stringify(newCart));
        setCart(newCart);
        recalculateTotal(newCart);
    };

    const checkout = async () => {
        setCheckoutError('');

        if (cart.length === 0) {
            setCheckoutError('Your cart is empty');
            return;
        }

        if (!token && (!guestName.trim() || !guestEmail.trim())) {
            setCheckoutError('Please enter your name and email to check out as a guest');
            return;
        }

        const items = cart.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const order = {
            items,
            totalAmount: total,
            guestInfo: token ? undefined : { name: guestName, email: guestEmail, address: guestAddress }
        };

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            await axios.post(`${SERVER_HOST}/orders`, order, { headers });
            localStorage.removeItem('cart');
            setCart([]);
            setTotal(0);
            setCheckoutError('');
            alert('Order placed successfully!');
        } catch (err) {
            setCheckoutError(err.response?.data?.message || 'Checkout failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Shopping Cart</h2>
            {checkoutError && <p className="ag_formError">{checkoutError}</p>}

            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.product._id} className="ag_cartItem">
                            <span>{item.product.name}</span>
                            <div>
                                <button onClick={() => updateQty(item.product._id, -1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQty(item.product._id, 1)}>+</button>
                            </div>
                            <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="ag_cartTotal">Total: €{total.toFixed(2)}</div>

                    {!token && (
                        <div className="ag_guestCheckout">
                            <label>Name</label>
                            <input value={guestName} onChange={e => setGuestName(e.target.value)} />
                            <label>Email</label>
                            <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                            <label>Address</label>
                            <input value={guestAddress} onChange={e => setGuestAddress(e.target.value)} />
                        </div>
                    )}

                    <button className="ag_checkoutBtn" onClick={checkout}>Proceed to Checkout</button>
                </>
            )}
        </div>
    );
};

export default CartPage;
