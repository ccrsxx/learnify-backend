import express, { json } from 'express';
import cors from 'cors';
import { HOST_PORT } from './libs/env.js';
import root from './api/routes/index.js';
import docs from './api/routes/docs.js';
import auth from './api/routes/auth.js';
import users from './api/routes/users.js';
import courses from './api/routes/courses.js';
import dashboard from './api/routes/dashboard.js';
import courseCategories from './api/routes/course-categories.js';
import userPayments from './api/routes/user-payments.js';
import userCourses from './api/routes/user-courses.js';
import userNotifications from './api/routes/user-notifications.js';
import courseMaterialStatus from './api/routes/course-material-status.js';

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
  courses(app);
  dashboard(app);
  userCourses(app);
  userPayments(app);
  userNotifications(app);
  courseCategories(app);
  courseMaterialStatus(app);

  app.listen(HOST_PORT, () =>
    // eslint-disable-next-line no-console
    console.info(`Server running on port ${HOST_PORT}`)
  );
}

main();
