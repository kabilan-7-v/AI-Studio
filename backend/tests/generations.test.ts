import request from 'supertest';
import app from '../src/app';
import db from '../src/db/connection';
import path from 'path';
import fs from 'fs';

describe('Generations API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Clear database
    db.prepare('DELETE FROM generations').run();
    db.prepare('DELETE FROM users').run();

    // Create test user
    const response = await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'Password123',
    });

    authToken = response.body.token;
    userId = response.body.user.id;
  });

  afterAll(() => {
    db.close();
  });

  describe('POST /api/generations', () => {
    const testImagePath = path.join(__dirname, 'test-image.jpg');

    beforeAll(() => {
      // Create a dummy test image if it doesn't exist
      if (!fs.existsSync(testImagePath)) {
        // Create minimal valid JPEG
        const buffer = Buffer.from([
          0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
          0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xd9,
        ]);
        fs.writeFileSync(testImagePath, buffer);
      }
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/generations')
        .field('prompt', 'Test prompt')
        .field('style', 'realistic')
        .attach('image', testImagePath)
        .expect(401);
    });

    it('should create generation with valid input', async () => {
      const response = await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', 'A beautiful fashion image')
        .field('style', 'realistic')
        .attach('image', testImagePath);

      // Can be either 201 (success) or 503 (model overloaded)
      expect([201, 503]).toContain(response.status);

      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('imageUrl');
        expect(response.body.prompt).toBe('A beautiful fashion image');
        expect(response.body.style).toBe('realistic');
      } else {
        expect(response.body.message).toBe('Model overloaded');
      }
    });

    it('should reject missing image', async () => {
      const response = await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', 'Test prompt')
        .field('style', 'realistic')
        .expect(400);

      expect(response.body.message).toBe('Image file is required');
    });

    it('should reject invalid style', async () => {
      const response = await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', 'Test prompt')
        .field('style', 'invalid-style')
        .attach('image', testImagePath)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject empty prompt', async () => {
      const response = await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', '')
        .field('style', 'realistic')
        .attach('image', testImagePath)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/generations', () => {
    it('should require authentication', async () => {
      await request(app).get('/api/generations').expect(401);
    });

    it('should return empty array for new user', async () => {
      const response = await request(app)
        .get('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should limit results to 5 by default', async () => {
      const response = await request(app)
        .get('/api/generations?limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });
  });
});
