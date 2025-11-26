# Quiz Reviewer App - Complete Setup Guide

A full-stack quiz application built with Ionic, Angular, Express, and MySQL.

## Features

✅ **Create Quizzes** - Add custom quizzes with multiple questions
✅ **Take Quizzes** - Answer questions with interactive UI
✅ **Score Results** - Get immediate feedback with percentage and score
✅ **View History** - Track all quiz attempts and results
✅ **Search Quizzes** - Find quizzes by title or description
✅ **Responsive Design** - Beautiful UI for all devices
✅ **Database Storage** - All data persisted in MySQL

## Tech Stack

### Frontend
- Ionic Framework
- Angular 20
- TypeScript
- HTML/CSS/SCSS
- RxJS

### Backend
- Node.js
- Express.js
- MySQL 2
- CORS & Body Parser

## Prerequisites

1. **Node.js** (v14 or higher)
   - Download from https://nodejs.org/

2. **MySQL Server**
   - Download from https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP with MySQL

3. **Ionic CLI**
   ```bash
   npm install -g @ionic/cli
   ```

## Installation & Setup

### Step 1: Clone or Extract Project
```bash
cd Reviewer_app
```

### Step 2: Setup Backend

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE quiz_reviewer;
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Start Backend Server**
   ```bash
   npm start
   ```
   - Server will run on `http://localhost:3000`
   - You should see: "Server running on http://localhost:3000"
   - Database will auto-initialize with required tables

### Step 3: Setup Frontend

1. **Install Frontend Dependencies** (in new terminal)
   ```bash
   npm install
   ```

2. **Start Frontend Application**
   ```bash
   ng serve
   # or
   ionic serve
   ```
   - App will run on `http://localhost:4200`
   - Wait for "Application bundle generated successfully" message

### Step 4: Access the App

Open browser and go to: `http://localhost:4200`

## How to Use

### Creating a Quiz
1. Click "Create New Quiz" from home
2. Enter quiz title and description
3. Click "Add" to add questions
4. Fill in question text and all 4 options
5. Select the correct answer
6. Click "Create Quiz" to save

### Taking a Quiz
1. Click "Take Quiz" from home
2. Browse and click "Start Quiz" on any quiz
3. Answer all questions by clicking on options
4. Use Previous/Next buttons to navigate
5. Click "Submit Quiz" to finish

### Viewing Results
1. Click "View Results" from home
2. Click on any result card to see details
3. View score, percentage, and correct/wrong count
4. Take another quiz or go back to home

## API Endpoints

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

### Questions
- `POST /api/quizzes/:id/questions` - Add question

### Results
- `POST /api/quizzes/:id/submit` - Submit answers
- `GET /api/results` - Get all results
- `GET /api/quizzes/:id/results` - Get quiz results

## Database Schema

### quizzes
```sql
id (INT, Primary Key)
title (VARCHAR)
description (TEXT)
created_at (TIMESTAMP)
```

### questions
```sql
id (INT, Primary Key)
quiz_id (INT, Foreign Key)
question (TEXT)
option1, option2, option3, option4 (VARCHAR)
correct_answer (INT)
```

### results
```sql
id (INT, Primary Key)
quiz_id (INT, Foreign Key)
quiz_title (VARCHAR)
score (INT)
total_questions (INT)
percentage (INT)
completed_at (TIMESTAMP)
```

## Troubleshooting

### "Cannot GET /" Error
- Make sure backend is running on port 3000
- Check `ng serve` is running frontend on port 4200
- Backend server must start before frontend

### MySQL Connection Error
- Ensure MySQL is running
- Check database `quiz_reviewer` exists
- Verify credentials in backend/index.js

### Port Already in Use
```bash
# Kill process using port 3000 (backend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process using port 4200 (frontend)
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Quiz Not Showing
- Refresh page (Ctrl+F5)
- Check browser console for errors (F12)
- Verify backend is responding to API calls

## Project Structure

```
Reviewer_app/
├── backend/
│   ├── index.js (Express server)
│   ├── package.json
│   └── README.md
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── create-quiz/
│   │   │   ├── quiz-list/
│   │   │   ├── take-quiz/
│   │   │   └── quiz-results/
│   │   ├── home/
│   │   ├── models/
│   │   │   └── quiz.ts
│   │   ├── services/
│   │   │   └── quiz.ts
│   │   └── app-routing.module.ts
│   └── environments/
│       └── environment.ts
├── package.json
├── ionic.config.json
└── angular.json
```

## Running Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm start
```

### Terminal 2 - Frontend
```bash
ng serve
```

Then open: `http://localhost:4200`

## Features Demo

- ✅ Full CRUD operations
- ✅ Real-time score calculation
- ✅ Quiz history tracking
- ✅ Search functionality
- ✅ Responsive mobile design
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications

## Production Build

### Frontend
```bash
ng build --prod
```

### Backend
- Keep backend as is or deploy to cloud service

## Support

If you encounter issues:
1. Check all prerequisites are installed
2. Ensure MySQL server is running
3. Verify ports 3000 and 4200 are available
4. Check console for error messages
5. Review logs in both terminals

## License

This project is open source and available under the MIT License.

---

**Happy Learning! 🎓**
