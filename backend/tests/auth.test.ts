import request from 'supertest';
import app from '../src/app';
import db from '../src/db/connection';

describe('Auth API', () => {
  beforeEach(() => {
    // Clear users table before each test
    db.prepare('DELETE FROM users').run();
  });

  afterAll(() => {
    db.close();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'Password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'weak',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'Password123',
      });

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Password456',
        })
        .expect(409);

      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'Password123',
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'Password123',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
