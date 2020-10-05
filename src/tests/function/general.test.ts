import request from 'supertest';
import app from '../../server';

describe('GET /ping', () => {
  it('responds with heartbeat message', async () => {
    await request(app)
      .get('/ping')
      .expect(200)
      .expect('pong!');
  })
})
