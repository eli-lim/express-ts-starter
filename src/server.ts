import express from "express";
import bodyParser from "body-parser";
import sql from "sql-template-strings";
import fs from 'fs';
import path from 'path';
import pool from "./db";
import { createUpdate } from "./db/helpers";
import {Attempt, Question, Student} from "./types/domain";

const app = express();

const ADMIN_SECRET = process.env.ADMIN_SECRET;

app.use(bodyParser.json());

app.get("/ping", (req, res) => {
  res.send("pong!");
})

if (!process.env.PRODUCTION) {
  app.post('/resetdb', async (req, res) => {
    const { ADMINSECRET } = req.body;
    if (ADMINSECRET === ADMIN_SECRET) {
      const setupSql = fs.readFileSync(path.join(__dirname, 'db', 'setup.sql')).toString();
      await pool.query(setupSql);
      res.status(200).send();
    } else {
      res.status(404).send();
    }
  })
}

/** Student Service **/
app.get('/student', async (req, res) => {
  const result = await pool.query(sql`SELECT * FROM student`);
  res.json(result.rows);
});

app.get('/student/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(sql`SELECT * FROM student WHERE id = ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ "error": "Invalid credentials" });
  }
})

app.post('/student', async (req, res) => {
  const { email, name } = req.body as Student;
  try {
    const result = await pool.query(sql`
        INSERT INTO student (email, name) 
        VALUES (${email}, ${name}) 
        RETURNING *
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ "error": "Email taken" });
  }
})

app.put('/student/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name } = req.body as Student;
  try {
    const { query, values } = createUpdate('student', Number(id), { email, name });
    const result = await pool.query(query, values);
    if (result.rowCount === 1) {
      res.json(result.rows[0]);
    } else {
      res.status(400).json({ error: "Invalid id" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid operation" });
  }
})

app.delete('/student/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(sql`
      DELETE FROM student
      WHERE id = ${id}
      RETURNING *;
    `);

    const deletedRow = result.rows[0];

    if (result.rowCount === 1) {
      res.json(deletedRow);
    } else {
      res.status(400).json({ error: "Invalid id" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
})

/**
 * ------------- QUESTION SERVICE --------------
 */
app.get('/question', async (req, res) => {
  const result = await pool.query(sql`SELECT * FROM question`);
  res.json(result.rows);
});

app.get('/question/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(sql`SELECT * FROM question WHERE id = ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
})

app.post('/question', async (req, res) => {
  const { name, stars, test_case_count } = req.body as Question;
  try {
    const result = await pool.query(sql`
        INSERT INTO question (name, stars, test_case_count) 
        VALUES (${name}, ${stars}, ${test_case_count}) 
        RETURNING *
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
})

app.put('/question/:id', async (req, res) => {
  const { id } = req.params;
  const { name, stars, test_case_count } = req.body as Question;
  try {
    const { query, values } = createUpdate('question', Number(id), { name, stars, test_case_count });
    const result = await pool.query(query, values);
    if (result.rowCount === 1) {
      res.json(result.rows[0]);
    } else {
      res.status(400).json({ error: "Invalid id" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid operation" });
  }
})

app.delete('/question/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(sql`
      DELETE FROM question
      WHERE id = ${id}
      RETURNING *;
    `);

    const deletedRow = result.rows[0];

    if (result.rowCount === 1) {
      res.json(deletedRow);
    } else {
      res.status(400).json({ error: "Invalid id" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
})

/**
 * ------------- ATTEMPT SERVICE --------------
 */
app.get('/attempt', async (req, res) => {
  const result = await pool.query(sql`SELECT * FROM attempt`);
  res.json(result.rows);
});

app.get('/attempt/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(sql`SELECT * FROM attempt WHERE id = ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
})

app.post('/attempt', async (req, res) => {
  const { student_id, question_id, score } = req.body as Attempt;
  try {
    const result = await pool.query(sql`
      INSERT INTO attempt (student_id, question_id, score) 
      VALUES (${student_id}, ${question_id}, ${score})
      RETURNING *
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
})

export default app;
