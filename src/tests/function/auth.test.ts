import request from "supertest";
import app from "../../server";
import {resetDb} from "./helpers";
import jwt from 'jsonwebtoken';


describe('POST /register', () => {
  beforeEach(resetDb);

  it('should return a valid jwt on register', async () => {
    await request(app)
      .post('/register')
      .send({
        email: "test@example.com",
        name: "Test Lim"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          student: {
            email: "test@example.com",
            name: "Test Lim"
          },
        })

        expect(res.body).toHaveProperty('token');
        const token = jwt.decode(res.body.token);
        expect(token).toMatchObject({
          id: 1,
          email: "test@example.com",
          name: "Test Lim",
        })
        expect(token).toHaveProperty('iat');
        expect(token).toHaveProperty('exp');
      })
  })

  it('should return a jwt with exp < 24hrs from now', async () => {
    await request(app)
      .post('/register')
      .send({
        email: "test@example.com",
        name: "Test Lim"
      })
      .expect(200)
      .expect(res => {
        const { exp } = jwt.decode(res.body.token) as { [exp: string]: number };
        const _23hrs = (Date.now() / 1000) + 60 * 60 * 23;
        const _25hrs = (Date.now() / 1000) + 60 * 60 * 25;
        expect(exp).toBeGreaterThan(_23hrs);
        expect(exp).toBeLessThan(_25hrs);
      })
  });

})