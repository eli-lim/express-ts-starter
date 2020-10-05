DROP TABLE IF EXISTS student CASCADE;
CREATE TABLE student
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT (now() at time zone 'GMT+8')
);

DROP TABLE IF EXISTS question CASCADE;
CREATE TABLE question
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    stars INT NOT NULL,
    test_case_count INT NOT NULL
);

DROP TABLE IF EXISTS attempt CASCADE;
CREATE TABLE attempt
(
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    question_id INT NOT NULL REFERENCES question(id) ON DELETE CASCADE,
    score INT, -- number of test cases correct
    created_at TIMESTAMP DEFAULT (now() at time zone 'GMT+8')
);