import request from "supertest";
import app from "../../server";
import {
  resetDb,
  createStudents,
  createAttempts,
  createQuestions,
  data
} from "./helpers";

describe ('POST /attempt', () => {
  beforeEach(async () => {
    await resetDb();
    await createStudents();
    await createQuestions();
  });

  it('should create 3 attempts', createAttempts);

  afterAll(resetDb);
})

describe ('GET /attempt', () => {

  beforeEach(bootstrapDb);

  it('GET /attempt/1 => should return a attempt', async () => {
    await request(app)
      .get('/attempt/1')
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject(data.attempts[1])
      )
  })

  it('GET /attempt => should return all attempts', async () => {
    await request(app)
      .get('/attempt')
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject(Object.values(data.attempts))
      )
  })
})

/**
 * HELPERS
 */

async function bootstrapDb() {
  await resetDb();
  await createStudents();
  await createQuestions();
  await createAttempts();
}
