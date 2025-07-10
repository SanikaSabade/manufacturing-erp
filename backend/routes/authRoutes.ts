import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Admin&Miscellaneous/User';

const router = express.Router();

const loginUser = async (
  req: Request,
  res: Response,
  expectedRole: 'admin' | 'employee'
): Promise<Response> => {  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.role !== expectedRole) {
      return res.status(401).json({ message: `Invalid credentials or not a ${expectedRole}` });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' } 
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

router.post('/login', (req, res) => loginUser(req, res, 'admin'));

router.post('/login-employee', (req, res) => loginUser(req, res, 'employee'));

export default router;
