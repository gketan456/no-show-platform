import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUserService, getUserByEmailService } from '../services/authService.js';

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
};

export const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return handleResponse(res, 400, "name, email and password are required");
        }

        const existingUser = await getUserByEmailService(email);
        if (existingUser) {
            return handleResponse(res, 409, "email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUserService(
            name,
            email,
            hashedPassword,
            role || "patient"
        );

        return handleResponse(res, 201, "user registered successfully", user);

    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return handleResponse(res, 400, "email and password are required");
        }

        const user = await getUserByEmailService(email);
        if (!user) {
            return handleResponse(res, 401, "invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return handleResponse(res, 401, "invalid email or password");
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return handleResponse(res, 200, "login successful", {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        next(err);
    }
};