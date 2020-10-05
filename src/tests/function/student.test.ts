import {data, resetDb, createStudents, post, get, put, del} from "./helpers";

const { students } = data;

describe('POST /student', () => {
  beforeEach(resetDb);

  it('should create 2 students', createStudents);

  it('should not allow duplicate emails', async () => {
    await post('/student')
      .send({
        email: students.ace.email,
      })
      .expect(200);

    await post('/student')
      .send({
        email: students.ace.email,
      })
      .expect(400)
      .expect({"error": "Email taken"});
  });
});

describe('GET /student', () => {

  beforeEach(bootstrapDb);

  it('GET /student/1 => should return a student', async () => {
    await get('/student/1')
      .expect(200)
      .expect(res => expect(res.body).toMatchObject(students.ace));
  });

  it('GET /student => should return all students', async () => {
    await get('/student')
      .expect(200)
      .expect(res => expect(res.body).toMatchObject(Object.values(students)));
  });
});

describe('PUT /student', () => {

  beforeEach(bootstrapDb);

  it('should update a student', async () => {
    await put('/student/1')
      .send({
        name: "Jolene Goh",
        email: "rambugoh.2017@sis.smu.edu.sg"
      })
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject({
          id: 1,
          name: "Jolene Goh",
          email: "rambugoh.2017@sis.smu.edu.sg"
        })
      );
  });

  it('should update a student email', async () => {
    await put('/student/1')
      .send({
        email: "rambugoh.2017@sis.smu.edu.sg"
      })
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject({
          id: 1,
          name: students.ace.name,
          email: "rambugoh.2017@sis.smu.edu.sg"
        })
      );
  });

  it('should update a student name', async () => {
    await put('/student/1')
      .send({
        name: "Jolene Goh"
      })
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject({
          id: 1,
          name: "Jolene Goh",
          email: students.ace.email
        })
      );
  });

  it('should allow removal of name', async () => {
    await put('/student/1')
      .send({
        name: null,
      })
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject({
          id: 1,
          name: null,
          email: students.ace.email
        })
      );
  });

  it('should not allow removal of email', async () => {
    await put('/student/1')
      .send({
        email: null,
      })
      .expect(400);
  });

  it('should not be vulnerable to SQL injection', async () => {
    await put(`/student/1'OR 1=1';--`)
      .send({
        name: "SQL INJECTED",
      })
      .expect(400)
      .expect(res => expect(res).toHaveProperty('error'));
  });
});

describe('DELETE /student', () => {
  beforeEach(bootstrapDb);

  it('should delete a student', async () => {
    await del('/student/1')
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject({
          id: 1,
          ...students.ace
        })
      );
  });

  it('should error when deleting non-existent student', async () => {
    await del('/student/100')
      .expect(400)
      .expect(res =>
        expect(res.body).toMatchObject({
          error: "Invalid id",
        })
      );
  });

  it('should not be vulnerable to SQL injection', async () => {
    await del(`/student/1'OR 1=1';--`)
      .expect(400)
      .expect(res =>
        expect(res.body).toMatchObject({
          error: "Invalid id",
        })
      );
  });
});

/**
 * HELPERS
 */

async function bootstrapDb() {
  await resetDb();
  await createStudents();
}
