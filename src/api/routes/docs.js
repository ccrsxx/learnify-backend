import { readFile } from 'fs/promises';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
import * as Types from '../../libs/types/common.js';
import { PUBLIC_URL } from '../../libs/env.js';

/**
 * @type {Types.Route}
 * @returns {void}
 */
export default async (app) => {
  const file = await readFile('./src/docs/swagger.yaml', 'utf8');
  const swaggerDocument = yaml.parse(file);

  /** @type {swaggerUi.SwaggerUiOptions} */
  const options = {
    swaggerOptions: {
      deepLinking: true
    }
  };

  swaggerDocument.servers[0].url = PUBLIC_URL;

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
};
