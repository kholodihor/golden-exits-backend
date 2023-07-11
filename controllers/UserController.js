import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { password, email, username, avatarUrl } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new UserModel({
      email,
      username,
      avatarUrl,
      passwordHash: hash,
    });

    await user.save();

    if (user) {
      const token = generateToken(user._id);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    } else {
      return res.status(400).json({
        message: 'Fail to create user',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Fail to Register'
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (user && isValidPass) {
      const token = generateToken(user._id);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    } else {
      return res.status(400).json({
        message: 'Invalid login or password',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Fail to authorize',
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (user) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl
      });
    } else {
      return res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Access denied',
    });
  }
};
