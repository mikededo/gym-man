import { Router } from 'express';

import {
  ClientFetchController,
  ClientLoginController,
  ClientRegisterController,
  ClientUpdateController,
  OwnerLoginController,
  OwnerRegisterController,
  OwnerUpdateController,
  TrainerFetchController,
  TrainerRegisterController,
  TrainerUpdateController,
  WorkerFetchController,
  WorkerLoginController,
  WorkerRegisterController,
  WorkerUpdateController
} from '../controllers';
import middlewares from '../middlewares';

/* REGISTER */

const RegisterRouter: Router = Router();

/**
 * @description Registers an owner to the database
 */
RegisterRouter.post('/owner', (req, res) =>
  OwnerRegisterController.execute(req, res)
);

/**
 * @description Registers a worker to the database
 */
RegisterRouter.post('/worker', (req, res) =>
  WorkerRegisterController.execute(req, res)
);

/**
 * @description Registers a trainer to the database
 */
RegisterRouter.post('/trainer', (req, res) =>
  TrainerRegisterController.execute(req, res)
);

/**
 * @description Registers a client to the database
 */
RegisterRouter.post('/client', (req, res) =>
  ClientRegisterController.execute(req, res)
);

/* LOG IN */

const LoginRouter: Router = Router();

/**
 * @description Logs in an owner to the database
 */
LoginRouter.post('/owner', (req, res) =>
  OwnerLoginController.execute(req, res)
);

/**
 * @description Logs in a worker to the database
 */
LoginRouter.post('/worker', (req, res) =>
  WorkerLoginController.execute(req, res)
);

/**
 * @description Logs in a client to the database
 */
LoginRouter.post('/client', (req, res) =>
  ClientLoginController.execute(req, res)
);

/* UPDATE */

const UpdateRouter: Router = Router();

/**
 * @description Updates an owner. Only an owner can update
 * themself.
 */
UpdateRouter.put('/owner', middlewares.auth, (req, res) => {
  OwnerUpdateController.execute(req, res);
});

/**
 * @description Updates a worker. Owners can update any worker, yet workers can only update themselves.
 */
UpdateRouter.put('/worker', middlewares.auth, (req, res) => {
  WorkerUpdateController.execute(req, res);
});

/**
 * @description Updates a trainers.Owners can update any trainers, yet owners can only update trainers if they have the permission.
 */
UpdateRouter.put('/trainer', middlewares.auth, (req, res) => {
  TrainerUpdateController.execute(req, res);
});

/**
 * @description Updates a client. Owners and workers can update any client, yet clients can only update themselves.
 */
UpdateRouter.put('/client', middlewares.auth, (req, res) =>
  ClientUpdateController.execute(req, res)
);

const PersonRouter: Router = Router();

/* FETCH */
/**
 * @description Fetches the list of the workers of the gym if the user making the
 * request has permissions to do so
 */
PersonRouter.get('/workers', middlewares.auth, (req, res) => {
  WorkerFetchController.execute(req, res);
});

/**
 * @description Fetches the list of the clients of the gym if the user making the
 * request has permissions to do so
 */
PersonRouter.get('/clients', middlewares.auth, (req, res) => {
  ClientFetchController.execute(req, res);
});

/**
 * @description Fetches the list of the trainers of the gym if the user making the
 * request has permissions to do so
 */
PersonRouter.get('/trainers', middlewares.auth, (req, res) => {
  TrainerFetchController.execute(req, res);
});

PersonRouter.use('/register', RegisterRouter);
PersonRouter.use('/login', LoginRouter);
PersonRouter.use('', UpdateRouter);

export default PersonRouter;
