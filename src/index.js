import express, { json } from 'express';
import cors from 'cors';
import { HOST_PORT } from './libs/env.js';
import root from './api/routes/index.js';
import docs from './api/routes/docs.js';
import auth from './api/routes/auth.js';
import users from './api/routes/users.js';
import upload from './api/routes/uploads.js';

/** @returns {void} */
function main() {
  const app = express();

  // Middlewares
  app.use(json(), cors());

  // Routes
  root(app);
  docs(app);
  auth(app);
  users(app);
  upload(app);

  app.listen(HOST_PORT, () =>
    // eslint-disable-next-line no-console
    console.info(`Server running on port ${HOST_PORT}`)
  );
}

main();
