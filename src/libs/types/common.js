import * as UserModel from '../../api/models/user.js';

/**
 * Function type for middleware.
 *
 * @template {Record<string, any>} [T=Record<string, any>] Default is. Default
 *   is `Record<string, any>`
 * @callback Middleware
 * @param {import('express').Request} req
 * @param {import('express').Response<any, T>} res
 * @param {import('express').NextFunction} next
 */

/**
 * Function type for controller.
 *
 * @template {Middleware<ExtractLocalsMiddleware<T>>} [T=Middleware] Default is.
 *   Default is `Middleware`
 * @callback Controller
 * @param {import('express').Request} req
 * @param {import('express').Response<any, ExtractLocalsMiddleware<T>>} res
 */

/**
 * Function type for Route.
 *
 * @callback Route
 * @param {import('express').Application} app
 */

/**
 * Extracts the locals type from a middleware.
 *
 * @template {Middleware<ExtractLocalsMiddleware<T>>} T
 * @typedef {Record<string, any> & Parameters<T>[1]['locals']} ExtractLocalsMiddleware
 */

/**
 * Function type for authorized controller.
 *
 * @template {Middleware<ExtractLocalsMiddleware<T>>} [T=Middleware] Default is.
 *   Default is `Middleware`
 * @typedef {Controller<
 *   Middleware<{ user: UserModel.UserAttributes } & ExtractLocalsMiddleware<T>>
 * >} AuthorizedController
 */

/** @typedef {import('express').Request['query']} RequestQuery */

/**
 * @template {Record<string, any>} [T=Record<string, any>] Default is. Default.
 *   Default is `Record<string, any>`
 * @typedef {import('sequelize').WhereOptions<T>} WhereOptions
 */

export const Types = {};
