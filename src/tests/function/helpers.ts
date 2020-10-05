require('../../env');
import request from "supertest";
import app from "../../server";
import {Attempt, Question, Student} from "../../types/domain";

export function post(endpoint: string) {
  return request(app)
    .post(endpoint)
    .set({
      ADMINSECRET: process.env.ADMIN_SECRET
    })
}

export function get(endpoint: string) {
  return request(app)
    .get(endpoint)
    .set({
      ADMINSECRET: process.env.ADMIN_SECRET
    })
}

export function put(endpoint: string) {
  return request(app)
    .put(endpoint)
    .set({
      ADMINSECRET: process.env.ADMIN_SECRET
    })
}

export function del(endpoint: string) {
  return request(app)
    .delete(endpoint)
    .set({
      ADMINSECRET: process.env.ADMIN_SECRET
    })
}

export async function resetDb() {
  await post('/resetdb')
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
    await post('/student')
      .send(student)
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject(student)
      );
  }
}

export async function createQuestions() {
  for (const question of Object.values(questions)) {
    await post('/question')
      .send(question)
      .expect(200)
      .expect(res => expect(res.body).toMatchObject(question));
  }
}

export async function createAttempts() {
  for (const attempt of Object.values(attempts)) {
    await post('/attempt')
      .send(attempt)
      .expect(res => expect(res.body).toMatchObject(attempt));
  }
}

export const data = {
  students,
  questions,
  attempts,
}
