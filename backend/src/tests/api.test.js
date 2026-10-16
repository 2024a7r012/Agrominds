const request = require('supertest');
const app = require('../app');

describe('AgroMinds API Automated Test Suite', () => {
  describe('1. Health & Root Endpoints', () => {
    it('GET / should return welcome message and doc links', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('online');
      expect(res.body.documentation).toBe('/api-docs');
    });

    it('GET /api/health should return 200 with service health info', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
      expect(res.body.data.integrations).toBeDefined();
    });

    it('GET /api/nonexistent-route should return 404', async () => {
      const res = await request(app).get('/api/nonexistent-route');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Agriculture Knowledge Base', () => {
    it('GET /api/agriculture/categories should return topic categories', async () => {
      const res = await request(app).get('/api/agriculture/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/agriculture/records should list agricultural articles', async () => {
      const res = await request(app).get('/api/agriculture/records');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.records.length).toBeGreaterThan(0);
    });

    it('GET /api/agriculture/records with search filter should work', async () => {
      const res = await request(app).get('/api/agriculture/records?search=wheat');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.records.length).toBeGreaterThan(0);
      expect(res.body.data.records[0].title.toLowerCase()).toContain('wheat');
    });

    it('GET /api/agriculture/records/:slug should return single record', async () => {
      const res = await request(app).get('/api/agriculture/records/wheat-cultivation-guide');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('wheat-cultivation-guide');
    });

    it('GET /api/agriculture/records/unknown-slug should return 404', async () => {
      const res = await request(app).get('/api/agriculture/records/unknown-slug-xyz');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. AI Agriculture Assistant', () => {
    it('POST /api/assistant/ask should reject empty prompt with 400', async () => {
      const res = await request(app)
        .post('/api/assistant/ask')
        .send({ prompt: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/assistant/ask should generate advice (live or transparent mock)', async () => {
      const res = await request(app)
        .post('/api/assistant/ask')
        .send({
          prompt: 'How to manage soil moisture in black clay soil for cotton?',
          context: {
            crop: 'Cotton',
            soil: 'Black Soil',
            location: 'Maharashtra',
            growingStage: 'Vegetative'
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.content).toBeDefined();
      expect(typeof res.body.data.is_mock).toBe('boolean');
      expect(res.body.data.disclaimer).toBeDefined();
    });
  });

  describe('4. Authentication & Security Middleware', () => {
    it('GET /api/auth/me should reject request without token with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/dev-login should generate a valid dev token', async () => {
      const res = await request(app)
        .post('/api/auth/dev-login')
        .send({ email: 'farmer.demo@agrominds.org' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.token).toBeDefined();

      // Use this token for /auth/me
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${res.body.data.token}`);

      expect(meRes.statusCode).toBe(200);
      expect(meRes.body.data.user.email).toBe('farmer.demo@agrominds.org');
    });

    it('GET /api/assistant/conversations should reject unauthenticated requests', async () => {
      const res = await request(app).get('/api/assistant/conversations');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('5. Payment Integration (Razorpay)', () => {
    it('GET /api/payments/plans should list pricing tiers', async () => {
      const res = await request(app).get('/api/payments/plans');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].planTier || res.body.data[0].id).toBeDefined();
    });

    it('POST /api/payments/create-order should reject invalid plan tier with 400', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .send({ planTier: 'non_existent_tier' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/payments/create-order should create test order for valid plan', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .send({ planTier: 'pro_agronomist' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.orderId).toBeDefined();
      expect(res.body.data.amount).toBe(49900);
    });

    it('POST /api/payments/verify should reject missing parameters with 400', async () => {
      const res = await request(app)
        .post('/api/payments/verify')
        .send({ orderId: 'test' });
      expect(res.statusCode).toBe(400);
    });
  });
});
