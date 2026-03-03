import { Router } from 'express';
import { login, signup, getUsers, googleLogin } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/users', getUsers);

export default router;
