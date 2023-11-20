import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../docs/swagger.json' assert { type: 'json' };
import * as Types from '../../libs/types/common.js';
import { PUBLIC_URL } from '../../libs/env.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default (app) => {
  /** @type {swaggerUi.SwaggerUiOptions} */
  const options = {
    swaggerOptions: {
      deepLinking: true
    }
  };

  swaggerDocument.servers[0].url = PUBLIC_URL;

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
};
