import { ApplicationError } from '../../libs/error.js';
import { isAdmin } from '../middlewares/auth.js';
import * as authService from '../services/auth.js';
import * as userService from '../services/user.js';
import * as Models from '../models/user.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Controller<typeof isAdmin>}
 * @returns {Promise<void>}
 */
export async function register(req, res) {
  const body = req.body;

  try {
    const data = await userService.createUser(body);

    res.status(201).json({ message: 'User created successfully', data: data });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmail(email);

    const isMatch = await authService.isPasswordMatch(
      password,
      user.dataValues.password
    );

    if (!isMatch) {
      res.status(401).json({ message: 'Password is not match' });
      return;
    }

    const token = await authService.generateToken(user.dataValues.id);

    /** @type {Models.UserAttributes & { token: string }} */
    const userWithToken = {
      ...user.dataValues,
      token
    };

    res
      .status(200)
      .json({ message: 'Login successfully', data: userWithToken });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
