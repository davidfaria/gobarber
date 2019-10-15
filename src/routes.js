import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/', async (req, res) => {
  res.json({
    name: 'Api',
    version: '1.0.3',
  });
});

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);
routes.put('/users/:id', UserController.update);

export default routes;
