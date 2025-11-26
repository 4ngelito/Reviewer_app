# ✅ COMPLETE STARTUP GUIDE

## What You Need Running (3 Things):

### 1️⃣ MySQL Database (XAMPP)
**Status:** MUST BE RUNNING
- Open XAMPP Control Panel
- Click **Start** next to MySQL
- Wait for GREEN indicator ✅

### 2️⃣ Backend Server (Node.js)
**Status:** CURRENTLY RUNNING ✅
- Terminal shows: "Server running on http://localhost:3000"
- Keep this terminal open

### 3️⃣ Frontend App (Ionic/Angular)
**Status:** Run in new terminal
```bash
cd c:/Users/Angelito/Desktop/Reviewer_app
ng serve --poll=2000
```
- Open: http://localhost:4200

---

## Database Setup (ONE TIME ONLY)

Open http://localhost/phpmyadmin in your browser

Copy and paste this SQL, then click Go:

```sql
CREATE DATABASE IF NOT EXISTS quiz_reviewer;
USE quiz_reviewer;

CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  question TEXT NOT NULL,
  option1 VARCHAR(255) NOT NULL,
  option2 VARCHAR(255) NOT NULL,
  option3 VARCHAR(255) NOT NULL,
  option4 VARCHAR(255) NOT NULL,
  correct_answer INT NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  quiz_title VARCHAR(255) NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  percentage INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);
```

---

## Test Backend Connection

Open browser and visit:
```
http://localhost:3000/api/health
```

Should show:
```json
{
  "status": "OK",
  "message": "Backend server is running"
}
```

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `ERR_CONNECTION_REFUSED` | Backend not running. Run `npm start` in backend folder |
| `ECONNREFUSED` on localhost:3306 | MySQL not running. Start in XAMPP |
| Database doesn't exist | Create database via phpMyAdmin (see above) |
| Port 3000 already in use | Close other applications using port 3000 |

---

## Quick Checklist

- [ ] MySQL running (XAMPP green indicator)
- [ ] Database created (quiz_reviewer)
- [ ] Backend started (`npm start`)
- [ ] Backend shows "Server running on http://localhost:3000"
- [ ] http://localhost:3000/api/health returns OK
- [ ] Frontend running (`ng serve`)
- [ ] App opens at http://localhost:4200

If all checked ✅, you're ready to create quizzes!
