import express from 'express';
import { login, signup, logout } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { updatedProfilePic } from '../controllers/auth.controller.js';
import { checkAuth } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.put('/update-profile', protectRoute, updatedProfilePic);

router.get('/check', protectRoute, checkAuth);

export default router;
