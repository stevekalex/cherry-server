import request from 'supertest';
import express from 'express';
import userRouter from '../routes/user';
import * as UserService from '../services/user';

// Mock the user service
jest.mock('../services/user');

const app = express();
app.use(express.json());
app.use('/api/users', userRouter);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/google/:googleId', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: '1', googleId: '123', name: 'Test User' };
      (UserService.findUserByGoogleId as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get('/api/users/google/123');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(UserService.findUserByGoogleId).toHaveBeenCalledWith('123');
    });

    it('should return 404 when user not found', async () => {
      (UserService.findUserByGoogleId as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/users/google/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });

    it('should handle errors', async () => {
      (UserService.findUserByGoogleId as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/users/google/123');
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = { googleId: '123', name: 'New User' };
      const createdUser = { id: '1', ...userData };
      (UserService.createUser as jest.Mock).mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/api/users')
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdUser);
      expect(UserService.createUser).toHaveBeenCalledWith(userData);
    });

    it('should handle errors during user creation', async () => {
      (UserService.createUser as jest.Mock).mockRejectedValue(new Error('Creation error'));

      const response = await request(app)
        .post('/api/users')
        .send({ googleId: '123', name: 'New User' });
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  // Add more test cases for other routes (PUT, DELETE, OAuth)
  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const userData = { name: 'Updated User' };
      const updatedUser = { id: '1', googleId: '123', name: 'Updated User' };
      (UserService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/api/users/1')
        .send(userData);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
      expect(UserService.updateUser).toHaveBeenCalledWith('1', userData);
    });

    it('should return 404 when user to update not found', async () => {
      (UserService.updateUser as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/api/users/nonexistent')
        .send({ name: 'Updated User' });
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      (UserService.deleteUser as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete('/api/users/1');
      
      expect(response.status).toBe(204);
      expect(UserService.deleteUser).toHaveBeenCalledWith('1');
    });
  });

  describe('POST /api/users/oauth/google', () => {
    it('should find or create a user from Google data', async () => {
      const googleUser = { googleId: '123', name: 'Google User' };
      const user = { id: '1', ...googleUser };
      (UserService.default.findOrCreateUser as jest.Mock).mockResolvedValue(user);

      const response = await request(app)
        .post('/api/users/oauth/google')
        .send(googleUser);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
      expect(UserService.default.findOrCreateUser).toHaveBeenCalledWith(googleUser);
    });
  });
}); 