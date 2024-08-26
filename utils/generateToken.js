import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

