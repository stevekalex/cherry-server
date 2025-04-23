/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import UserService, { createUser, findUserByGoogleId, updateUser, deleteUser } from '../services/user';

const router = express.Router();

// Get user by Google ID
router.get('/google/:googleId', async (req, res): Promise<any> => {
  try {
    const user = await findUserByGoogleId(req.params.googleId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new user
router.post('/', async (req, res): Promise<any> => {
  try {
    const userData = req.body;
    const newUser = await createUser(userData);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an existing user
router.put('/:id', async (req, res): Promise<any> => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    const updatedUser = await updateUser(userId, userData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a user
router.delete('/:id', async (req, res): Promise<any> => {
  try {
    const userId = req.params.id;
    await deleteUser(userId);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Find or create user from Google data (OAuth flow)
router.post('/oauth/google', async (req, res): Promise<any> => {
  try {
    const googleUser = req.body;
    const user = await UserService.findOrCreateUser(googleUser);
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error processing OAuth user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
