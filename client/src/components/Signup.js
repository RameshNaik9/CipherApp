import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [user, setUser] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: ''
    });

    const navigate = useNavigate(); // Initialize navigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.password !== user.confirmPassword) {
            alert("Passwords don't match.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Signup successful:', result);

            alert('Account created successfully');
            navigate('/'); // Redirect to login page after successful signup
        } catch (error) {
            console.error('Signup error:', error);
            alert('Signup failed.');
        }
    };


    return (
        <div>
            <header className="app-header"><h1>Cipher App</h1></header>
        <div className="signup-form">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={user.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={user.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={user.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email ID</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} required />
                </div>
                <button type="submit">Signup</button>
                <div className="login-link">
                    <p>Already have an account ? <Link to="/" className="button-link">Login</Link></p>
                </div>
            </form>
        </div>
    </div>
    );
};

export default Signup;
