import jwt from 'jsonwebtoken';
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  res.cookie('token', token, {
    httpOnly: true, // Prevents JavaScript from accessing the cookie, mitigating XSS attacks
    secure: process.env.NODE_ENV !== 'development', // Set to true if using HTTPS
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};
