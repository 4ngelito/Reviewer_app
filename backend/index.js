const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:8100', 'http://localhost:8101', 'http://192.168.8.45:8100'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SQLite Database Setup
let db;

async function initializeDatabase() {
  try {
    // Open database (creates file if it doesn't exist)
    db = await open({
      filename: path.join(__dirname, 'quiz_reviewer.db'),
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');

    // Create quizzes table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create questions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        option1 TEXT NOT NULL,
        option2 TEXT NOT NULL,
        option3 TEXT NOT NULL,
        option4 TEXT NOT NULL,
        correct_answer INTEGER NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `);

    // Create results table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        quiz_title TEXT NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        percentage INTEGER NOT NULL,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `);

    console.log('SQLite database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date() 
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Quiz Reviewer API',
    version: '1.0.0',
    endpoints: {
      quizzes: '/api/quizzes',
      results: '/api/results',
      health: '/api/health'
    }
  });
});

// ==================== QUIZ ENDPOINTS ====================

// GET all quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await db.all(`
      SELECT * FROM quizzes ORDER BY created_at DESC
    `);

    // Get questions for each quiz
    const quizzesWithQuestions = await Promise.all(
      quizzes.map(async (quiz) => {
        const questions = await db.all(
          `SELECT id, question, option1, option2, option3, option4, 
                  correct_answer as correctAnswer, quiz_id as quizId 
           FROM questions WHERE quiz_id = ?`,
          [quiz.id]
        );
        return {
          ...quiz,
          questions: questions.map(q => ({
            id: q.id,
            question: q.question,
            options: [q.option1, q.option2, q.option3, q.option4],
            correctAnswer: q.correctAnswer - 1,
            quizId: q.quizId
          }))
        };
      })
    );

    res.json(quizzesWithQuestions);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// GET quiz by ID
app.get('/api/quizzes/:id', async (req, res) => {
  try {
    const quiz = await db.get(
      'SELECT * FROM quizzes WHERE id = ?',
      [req.params.id]
    );

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questions = await db.all(
      `SELECT id, question, option1, option2, option3, option4, 
              correct_answer as correctAnswer, quiz_id as quizId 
       FROM questions WHERE quiz_id = ?`,
      [req.params.id]
    );

    res.json({
      ...quiz,
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        options: [q.option1, q.option2, q.option3, q.option4],
        correctAnswer: q.correctAnswer - 1,
        quizId: q.quizId
      }))
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// CREATE quiz
app.post('/api/quizzes', async (req, res) => {
  console.log('Create quiz request:', JSON.stringify(req.body, null, 2));
  
  const { title, description, questions } = req.body;

  // Validation
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required', field: 'title' });
  }
  if (!description || description.trim() === '') {
    return res.status(400).json({ error: 'Description is required', field: 'description' });
  }
  if (!questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'Questions must be an array', field: 'questions' });
  }
  if (questions.length === 0) {
    return res.status(400).json({ error: 'At least one question is required', field: 'questions' });
  }

  try {
    await db.exec('BEGIN TRANSACTION');

    // Insert quiz
    console.log('Inserting quiz:', { title, description });
    const result = await db.run(
      'INSERT INTO quizzes (title, description) VALUES (?, ?)',
      [title.trim(), description.trim()]
    );

    const quizId = result.lastID;
    console.log('Quiz created with ID:', quizId);

    // Insert questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      console.log(`Processing question ${i + 1}:`, JSON.stringify(question, null, 2));
      
      // Validate question
      if (!question.question || question.question.trim() === '') {
        throw new Error(`Question ${i + 1}: Question text is required`);
      }
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        throw new Error(`Question ${i + 1}: Must have exactly 4 options`);
      }
      
      // Validate all options are filled
      for (let j = 0; j < 4; j++) {
        if (!question.options[j] || question.options[j].trim() === '') {
          throw new Error(`Question ${i + 1}: Option ${j + 1} is required`);
        }
      }
      
      if (question.correctAnswer === undefined || question.correctAnswer === null) {
        throw new Error(`Question ${i + 1}: Correct answer is required`);
      }

      const [opt1, opt2, opt3, opt4] = question.options;
      
      // correctAnswer comes as 0-3 from frontend, convert to 1-4 for database
      const correctAnswerNum = Number(question.correctAnswer);
      
      if (isNaN(correctAnswerNum) || correctAnswerNum < 0 || correctAnswerNum > 3) {
        throw new Error(`Question ${i + 1}: Correct answer must be between 0 and 3 (got ${question.correctAnswer})`);
      }
      
      const correctAnswerDB = correctAnswerNum + 1; // Convert to 1-4 for database

      console.log(`Inserting question ${i + 1} for quiz ${quizId}:`, { 
        question: question.question.substring(0, 50) + '...', 
        correctAnswer: correctAnswerNum,
        correctAnswerDB
      });

      await db.run(
        `INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_answer) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          quizId,
          question.question.trim(),
          opt1.trim(),
          opt2.trim(),
          opt3.trim(),
          opt4.trim(),
          correctAnswerDB
        ]
      );
    }

    await db.exec('COMMIT');

    console.log(`Quiz ${quizId} created successfully with ${questions.length} questions`);

    res.status(201).json({
      id: quizId,
      title,
      description,
      questions: questions.map((q, i) => ({
        id: i + 1,
        ...q
      })),
      createdAt: new Date(),
      message: 'Quiz created successfully'
    });
  } catch (error) {
    await db.exec('ROLLBACK');
    console.error('Error creating quiz:', error);
    res.status(500).json({ 
      error: 'Failed to create quiz', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// UPDATE quiz
app.put('/api/quizzes/:id', async (req, res) => {
  const { title, description } = req.body;

  try {
    await db.run(
      'UPDATE quizzes SET title = ?, description = ? WHERE id = ?',
      [title, description, req.params.id]
    );

    res.json({ id: req.params.id, title, description });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// DELETE quiz
app.delete('/api/quizzes/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM quizzes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// ==================== QUESTIONS ENDPOINTS ====================

// ADD question to quiz
app.post('/api/quizzes/:id/questions', async (req, res) => {
  const { question, options, correctAnswer } = req.body;

  try {
    const result = await db.run(
      `INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_answer) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.params.id, question, options[0], options[1], options[2], options[3], correctAnswer + 1]
    );

    res.status(201).json({
      id: result.lastID,
      question,
      options,
      correctAnswer,
      quizId: req.params.id
    });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// ==================== RESULTS ENDPOINTS ====================

// SUBMIT quiz answers
app.post('/api/quizzes/:id/submit', async (req, res) => {
  const { answers } = req.body;

  try {
    // Get quiz
    const quiz = await db.get(
      'SELECT * FROM quizzes WHERE id = ?',
      [req.params.id]
    );

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Get questions
    const questions = await db.all(
      'SELECT * FROM questions WHERE quiz_id = ?',
      [req.params.id]
    );

    // Calculate score
    let score = 0;
    const userAnswers = [];

    for (let i = 0; i < questions.length; i++) {
      const userAnswer = answers[i].answer;
      const correctAnswer = questions[i].correct_answer - 1;
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) score++;

      userAnswers.push({
        questionId: questions[i].id,
        question: questions[i].question,
        userAnswer,
        correctAnswer,
        isCorrect
      });
    }

    const percentage = Math.round((score / questions.length) * 100);

    // Save result
    const result = await db.run(
      `INSERT INTO results (quiz_id, quiz_title, score, total_questions, percentage) 
       VALUES (?, ?, ?, ?, ?)`,
      [req.params.id, quiz.title, score, questions.length, percentage]
    );

    res.json({
      id: result.lastID,
      quizId: req.params.id,
      quizTitle: quiz.title,
      score,
      totalQuestions: questions.length,
      percentage,
      completedAt: new Date(),
      answers: userAnswers
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// GET all results
app.get('/api/results', async (req, res) => {
  try {
    const results = await db.all(
      'SELECT * FROM results ORDER BY completed_at DESC'
    );

    res.json(results.map(r => ({
      id: r.id,
      quizId: r.quiz_id,
      quizTitle: r.quiz_title,
      score: r.score,
      totalQuestions: r.total_questions,
      percentage: r.percentage,
      completedAt: r.completed_at
    })));
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// GET results for specific quiz
app.get('/api/quizzes/:id/results', async (req, res) => {
  try {
    const results = await db.all(
      'SELECT * FROM results WHERE quiz_id = ? ORDER BY completed_at DESC',
      [req.params.id]
    );

    res.json(results.map(r => ({
      id: r.id,
      quizId: r.quiz_id,
      quizTitle: r.quiz_title,
      score: r.score,
      totalQuestions: r.total_questions,
      percentage: r.percentage,
      completedAt: r.completed_at
    })));
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// ==================== SERVER START ====================

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Database file: ${path.join(__dirname, 'quiz_reviewer.db')}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();