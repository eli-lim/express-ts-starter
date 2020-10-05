import {createQuestions, data, del, get, put, resetDb} from "./helpers";

const { questions } = data;

describe ('POST /question', () => {
  beforeEach(resetDb);
  it('should create 3 questions', createQuestions);
  afterAll(resetDb);
})

describe ('GET /question', () => {

  beforeEach(bootstrapDb);

  it('GET /question/1 => should return a question', async () => {
    await get('/question/1')
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject(questions.FizzBuzz)
      )
  })

  it('GET /question => should return all questions', async () => {
    await get('/question')
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject(Object.values(questions))
      )
  })
})

describe('PUT /question', () => {

  beforeEach(bootstrapDb);

  it('should update a question\'s fields', async () => {
    await put('/question/1')
      .send({
        name: 'Some Question',
      })
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject({
          id: 1,
          name: 'Some Question',
          stars: questions.FizzBuzz.stars,
          test_case_count: questions.FizzBuzz.test_case_count,
        })
      )

    await put('/question/1')
      .send({
        stars: 10,
        test_case_count: 50
      })
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject({
          id: 1,
          name: 'Some Question',
          stars: 10,
          test_case_count: 50,
        })
      )
  })

  it('should not be vulnerable to SQL injection', async () => {
    await put(`/question/1'OR 1=1';--`)
      .send({
        name: "SQL INJECTED",
      })
      .expect(400)
      .expect(res => expect(res).toHaveProperty('error'));
  })

})

describe('DELETE /question', () => {
  beforeEach(bootstrapDb);

  it('should delete a question', async () => {
    await del('/question/1')
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject({
          name: "FizzBuzz",
          stars: 1,
          test_case_count: 4,
        })
      )
  })

  it('should error when deleting non-existent question', async () => {
    await del('/question/100')
      .expect(400)
      .expect(res =>
        expect(res.body).toMatchObject({
          error: "Invalid id",
        })
      )
  })

  it('should not be vulnerable to SQL injection', async () => {
    await del(`/question/1'OR 1=1';--`)
      .expect(400)
      .expect(res =>
        expect(res.body).toMatchObject({
          error: "Invalid id",
        })
      )
  })
})

/**
 * HELPERS
 */

async function bootstrapDb() {
  await resetDb();
  await createQuestions();
}
