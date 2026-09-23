import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!name.trim()) {
            errors.name = 'Name is required';
        }
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Enter a valid email address';
        }
        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!validate()) return;

        try {
            await axios.post(`${SERVER_HOST}/users/register`, { name, email, password });
            navigate('/login');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="ag_formContainer">
            <h2>Register</h2>
            {formError && <p className="ag_formError">{formError}</p>}
            <form onSubmit={handleSubmit} noValidate>
                <label>Name</label>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                {fieldErrors.name && <span className="ag_fieldError">{fieldErrors.name}</span>}

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

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
