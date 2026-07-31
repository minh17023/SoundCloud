import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    await authService.registerUser(email, password, username);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(error.message === 'Email already exists' ? 400 : 500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginData = await authService.loginUser(email, password);
    
    res.status(200).json({
      message: 'Login successful',
      token: loginData.token,
      user: loginData.user
    });
  } catch (error) {
    res.status(error.message === 'Invalid credentials' ? 400 : 500).json({ error: error.message });
  }
};
