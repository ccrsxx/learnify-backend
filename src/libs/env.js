import dotenv from 'dotenv';
import { access } from 'fs/promises';

if (process.env.NODE_ENV !== 'production') {
  const isLocalEnvExists = await access('.env.local')
    .then(() => true)
    .catch(() => false);

  const envPath = `.env.${isLocalEnvExists ? 'local' : 'development'}`;

  // eslint-disable-next-line no-console
  console.info(`Loading environment variables from ${envPath}`);

  dotenv.config({
    path: envPath
  });
}

const { HEROKU_APP_NAME, HEROKU_PR_NUMBER } = process.env;

export const PUBLIC_URL = HEROKU_APP_NAME
  ? `https://${HEROKU_APP_NAME}.herokuapp.com`
  : /** @type {string} */ (process.env.PUBLIC_URL);

export const DB_DATABASE = HEROKU_PR_NUMBER
  ? `pr_${HEROKU_PR_NUMBER}`
  : process.env.DB_DATABASE;

export const HOST_PORT = process.env.PORT ?? process.env.HOST_PORT;

export const {
  DB_HOST,
  DB_PORT,
  JWT_SECRET,
  DB_USERNAME,
  DB_PASSWORD,
  FRONTEND_URL,
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET
} = /** @type {Record<string, string>} */ (process.env);
