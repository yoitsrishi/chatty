import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

import { generateToken } from '../lib/utils.js';
export const signup = async (req, res) => {
  // Handle login logic here
  // Perform signup logic (e.g., save user to database)
  // For example: const newUser = await User.create({ fullName, email, password, profilePic });
  // res.status(201).json({ message: 'Signup successful', user: newUser });
  const { fullName, email, password, profilePic } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    res.send('Signup successful');
  } catch (error) {
    // Handle error (e.g., user already exists, validation error)
    // res.status(400).json({ message: 'Signup failed', error: error.message });
    res.status(400).send('Signup failed');
  }
};

export const login = async (req, res) => {
  // Handle signup logic here
  //res.json({ message: 'Signup successful' });
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
    res.send('Signup successful');
  } catch (error) {
    // Handle error (e.g., user not found, invalid credentials)
    // res.status(400).json({ message: 'Login failed', error: error.message });
    res.status(400).send('Login failed');
  }
};

export const logout = async (req, res) => {
  // Handle logout logic here
  //res.json({ message: 'Logout successful' });
  try {
    res.clearCookie('token', { path: '/' });
    res.cookie('jwt', '', { maxAge: 0 });
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Logout failed', error: error.message });
  }
};

export const updatedProfilePic = async (req, res) => {};
