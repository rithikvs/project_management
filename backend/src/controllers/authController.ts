import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    try {
        const check = await User.findOne({ email });
        if (check) return res.status(409).json({ message: 'User exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password_hash: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'User created' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, email: user.email, name: user.name });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        console.log('Google login attempt received');
        console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
        console.log('Token received:', token ? 'Yes' : 'No');

        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your_google_client_id_here') {
            console.error('GOOGLE_CLIENT_ID not configured properly');
            return res.status(500).json({ message: 'Server not configured: Missing GOOGLE_CLIENT_ID' });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            console.error('No payload from Google token');
            return res.status(400).json({ message: 'Invalid token' });
        }

        console.log('Google payload received:', { email: payload.email, name: payload.name });

        const { email, name, sub: googleId } = payload;

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            console.log('Creating new user:', email);
            user = new User({
                name,
                email,
                googleId,
            });
            await user.save();
        } else if (!user.googleId) {
            console.log('Linking Google ID to existing user:', email);
            user.googleId = googleId;
            await user.save();
        }

        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Google login successful for:', email);
        res.json({ token: jwtToken, email: user.email, name: user.name });
    } catch (error: any) {
        console.error('Google login error:', error.message);
        console.error('Error stack:', error.stack);
        res.status(401).json({ message: 'Google login failed', error: error.message });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, 'name email _id');
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
