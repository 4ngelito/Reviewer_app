# Quiz Reviewer Backend

Node.js/Express backend for Quiz Reviewer App with MySQL database

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create MySQL Database

```sql
CREATE DATABASE quiz_reviewer;
```

### 3. Configure Environment (Optional)

Create `.env` file in backend folder:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=quiz_reviewer
PORT=3000
```

### 4. Start Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:3000`

## API Endpoints

### Quiz Management

- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

### Questions

- `POST /api/quizzes/:id/questions` - Add question to quiz

### Results

- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/results` - Get all results
- `GET /api/quizzes/:id/results` - Get results for specific quiz
