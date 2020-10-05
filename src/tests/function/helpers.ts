import request from "supertest";
import app from "../../server";
import {Attempt, Question, Student} from "../../types/domain";

export async function resetDb() {
  await request(app)
    .post('/resetdb')
    .send({
      ADMINSECRET: process.env.ADMIN_SECRET
    })
    .expect(200);
}

const students: {[name: string]: Student} = {
  ace: {
    email: "ace.tan.2017@sis.smu.edu.sg",
    name: "Ace Tan",
  },
  bob: {
    email: "bob.lim.2017@sis.smu.edu.sg",
    name: "Bob Lim",
  },
}

const questions: {[name: string]: Question} = {
  FizzBuzz: {
    name: "FizzBuzz",
    stars: 1,
    test_case_count: 4,
  },
  ChristmasTree: {
    name: "Christmas Tree",
    stars: 2,
    test_case_count: 6,
  },
  TicTacToe: {
    name: "TicTacToe",
    stars: 4,
    test_case_count: 5,
  }
}

const attempts: { [id: number]: Attempt } = {
  1: {
    id: 1,
    student_id: 1,
    question_id: 1,
    score: 4
  },
  2: {
    id: 2,
    student_id: 1,
    question_id: 2,
    score: 5
  },
  3: {
    id: 3,
    student_id: 1,
    question_id: 3,
    score: 3
  },
}

export async function createStudents() {
  for (const student of Object.values(students)) {
    await request(app)
      .post('/student')
      .send(student)
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject(student)
      );
  }
}

export async function createQuestions() {
  for (const question of Object.values(questions)) {
    await request(app)
      .post('/question')
      .send(question)
      .expect(200)
      .expect(res => expect(res.body).toMatchObject(question));
  }
}

export async function createAttempts() {
  for (const attempt of Object.values(attempts)) {
    await request(app)
      .post('/attempt')
      .send(attempt)
      .expect(res => expect(res.body).toMatchObject(attempt));
  }
}

export const data = {
  students,
  questions,
  attempts,
}
