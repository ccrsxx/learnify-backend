import * as indexController from '../controllers/index.js';
import * as Types from '../../libs/types/common.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  app.get('/', indexController.ping);
};
