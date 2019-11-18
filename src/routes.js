import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import multer from 'multer';

// Configs
import multerConfig from './config/multer';

// Middlewares
import authMiddleware from './app/middlewares/auth';

// Controllers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import AvailableController from './app/controllers/AvailableController';

import NotificationController from './app/controllers/NotificationController';
import FileController from './app/controllers/FileController';

// Validators

import validadeSessionStore from './app/validators/SessionStore';
import validadeUserStore from './app/validators/UserStore';
import validadeUserUpdate from './app/validators/UserUpdate';
import validadeAppointmentStore from './app/validators/AppointmentStore';

// Variables
const routes = new Router();
const upload = multer(multerConfig);
const bruteStore = new BruteRedis({
  host: process.env.HOST,
  port: process.env.PORT,
});

const bruteForce = new Brute(bruteStore);

routes.get('/', async (req, res) => {
  res.json({
    name: 'Api',
    version: '1.0.3',
  });
});

routes.post(
  '/sessions',
  bruteForce.prevent,
  validadeSessionStore,
  SessionController.store
);
routes.post('/users', validadeUserStore, UserController.store);

routes.use(authMiddleware);
routes.put('/users', validadeUserUpdate, UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.get('/appointments', AppointmentController.index);
routes.post(
  '/appointments',
  validadeAppointmentStore,
  AppointmentController.store
);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedules', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
