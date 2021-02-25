import express from 'express';
const router = express.Router();
import { authUser, getUserProfile, registerUser, updateUserProfile, getAllUsers, deleteUser, getUserById, updateUser } from '../controllers/userControllers.js'
import { protect, Admin } from '../middleware/authMiddleware.js'

//we have to consider well when we are ordering down these routes

router.get('/', protect, Admin, getAllUsers);
router.post('/', registerUser);
router.post('/login', authUser);
// router.route('/profile').get(getUserProfile)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
//router.route('/profile').get(protect, getUserProfile).put(protect, updatedUserProfile)
router.delete('/:id', protect, Admin, deleteUser);
router.get('/:id', protect, Admin, getUserById);
router.put('/:id', protect, Admin, updateUser);

export default router;
