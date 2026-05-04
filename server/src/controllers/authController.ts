import { Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      role: 'user' 
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'Usuario creado correctamente',
      user: { id: newUser._id, name: newUser.name, email: newUser.email } 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al registrar' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, 
      avatarUrl: `https://ui-avatars.com/api/?name=${user.name}`
    };

    res.status(200).json({ 
      message: 'Login exitoso', 
      user: userResponse 
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};