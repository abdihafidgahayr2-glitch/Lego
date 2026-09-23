import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

const ProfilePage = () => {
    const [user, setUser] = useState({ name: '', email: '', profilePhoto: '' });
    const [nameError, setNameError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            axios.get(`${SERVER_HOST}/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setUser(res.data))
                .catch(err => console.error(err));
        }
    }, [token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setNameError('');
        setStatusMessage('');

        if (!user.name.trim()) {
            setNameError('Name is required');
            return;
        }

        try {
            const res = await axios.put(`${SERVER_HOST}/users/profile`,
                { name: user.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(res.data);
            setStatusMessage('Profile updated successfully');
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Update failed');
        }
    };

    const handlePhotoUpload = async (e) => {
        e.preventDefault();
        if (!photoFile) {
            setStatusMessage('Choose an image first');
            return;
        }

        const formData = new FormData();
        formData.append('photo', photoFile);

        try {
            const res = await axios.put(`${SERVER_HOST}/users/profile/photo`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser(res.data);
            setStatusMessage('Profile photo updated');
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Photo upload failed');
        }
    };

    return (
        <div className="ag_formContainer">
            <h2>Profile</h2>
            {statusMessage && <p className="ag_formError">{statusMessage}</p>}

            {user.profilePhoto && (
                <img
                    className="ag_profilePhoto"
                    src={`${SERVER_HOST.replace('/api', '')}${user.profilePhoto}`}
                    alt="Profile"
                />
            )}

            <form onSubmit={handlePhotoUpload}>
                <label>Profile Photo</label>
                <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
                <button type="submit">Upload Photo</button>
            </form>

            <form onSubmit={handleUpdate} noValidate>
                <label>Name</label>
                <input value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} />
                {nameError && <span className="ag_fieldError">{nameError}</span>}

                <label>Email</label>
                <input value={user.email} disabled />

                <button type="submit">Update Name</button>
            </form>
        </div>
    );
};

export default ProfilePage;
