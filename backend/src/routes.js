import { Router } from 'express';

// controllers
import ProfileController from './app/controllers/ProfileController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import PatientController from './app/controllers/PatientController';
import VerificationController from './app/controllers/VerificationController';
import QrCodeLinksController from './app/controllers/QrcodeLinksController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/status', (req, res) => res.status(200).send());

// Profile
routes.get('/profiles', ProfileController.list);
routes.post('/profiles', ProfileController.store);

// verication?token=[string]&email=[string]
routes.get('/verification', VerificationController.validation);

// Users
routes.get('/users', UserController.list);
routes.get('/users/:id', UserController.detail);
routes.post('/users', UserController.store);
// routes.put('/users', UserController.update);

// Token
routes.post('/login', SessionController.store);
routes.post('/refreshtoken', SessionController.store);

// QrCode ID
routes.get('/qrcodevalid', QrCodeLinksController.qrcodeId);

// valid token
routes.use(authMiddleware);

// Profile
routes.get('/me', SessionController.profile);

// QrCode
routes.get('/qrcode', QrCodeLinksController.qrcode);

// Patient
routes.post('/patient', PatientController.store);
routes.get('/patient/:id', PatientController.listId);

export default routes;
