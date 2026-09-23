import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Enter a valid email address';
        }
        if (!password) {
            errors.password = 'Password is required';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!validate()) return;

        try {
            const res = await axios.post(`${SERVER_HOST}/users/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.user.id);
            localStorage.setItem('role', res.data.user.role);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="ag_formContainer">
            <h2>Login</h2>
            {formError && <p className="ag_formError">{formError}</p>}
            <form onSubmit={handleSubmit} noValidate>
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                {fieldErrors.email && <span className="ag_fieldError">{fieldErrors.email}</span>}

                <label>Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {fieldErrors.password && <span className="ag_fieldError">{fieldErrors.password}</span>}

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
