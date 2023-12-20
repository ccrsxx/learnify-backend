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
  const { email, phone_number, password } = req.body;

  try {
    const user = email
      ? await userService.getUserByEmail(email)
      : await userService.getUserByPhoneNumber(phone_number);

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

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function loginWithAdmin(req, res) {
  const { email, phone_number, password } = req.body;

  try {
    const user = email
      ? await userService.getAdminUserByEmail(email)
      : await userService.getAdminUserByPhoneNumber(phone_number);

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

/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */
export async function sendVerifToResetPassword(req, res) {
  const { email } = req.body;
  try {
    const verification = await authService.sendVerifToResetPassword(email);
    res.status(200).json({
      message: 'Account verification sent successfully',
      data: verification
    });
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
export async function checkLinkToResetPassword(req, res) {
  const token = req.params.token;
  try {
    // @ts-ignore
    await authService.checkLinkToResetPassword(token);
    res.status(200).json({ message: 'Verification is valid' });
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
export async function changePassword(req, res) {
  try {
    const payload = req.body;
    await authService.changePassword(payload);
    res.status(200).json({ message: 'Password successfully updated' });
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
