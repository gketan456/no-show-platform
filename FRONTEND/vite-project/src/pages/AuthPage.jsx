import React, { useState } from 'react';
import api from '../services/api';

const AuthPage = ({ onLogin }) => {

    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        try {
            await api.post("/auth/register", {
                name,
                email,
                password
            });
            setMessage("Account created! Please login.");
            setIsLogin(true);
        } catch (error) {
            setMessage("Registration failed. Try again.");
            console.error(error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            const { token, user } = response.data.data;

            // save to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // tell App.jsx login was successful
            onLogin(user);

        } catch (error) {
            setMessage("Invalid email or password.");
            console.error(error);
        }
    };

    return (
        <div>
            <h2>{isLogin ? "Login" : "Register"}</h2>

            {!isLogin && (
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            )}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {message && <p>{message}</p>}

            <button onClick={isLogin ? handleLogin : handleRegister}>
                {isLogin ? "Login" : "Register"}
            </button>

            <p>
                {isLogin ? "No account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Register" : "Login"}
                </button>
            </p>
        </div>
    );
};

export default AuthPage;