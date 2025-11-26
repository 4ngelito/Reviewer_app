# 📚 Quiz Reviewer App - Complete Application

A full-stack quiz application built with **Ionic/Angular** frontend and **Node.js/Express** backend with **MySQL** database.

## ✨ Features

✅ **Create Custom Quizzes** - Add quizzes with multiple choice questions
✅ **Interactive Quiz Taking** - Answer questions with beautiful UI
✅ **Instant Scoring** - Get score and percentage immediately
✅ **Results History** - Track all quiz attempts
✅ **Search Quizzes** - Find quizzes by name or description
✅ **Responsive Design** - Works on mobile and desktop
✅ **Persistent Storage** - All data saved in MySQL

## 📋 Technology Stack

### Frontend
- **Ionic Framework** 8.0
- **Angular** 20
- **TypeScript**
- **SCSS**
- **RxJS**

### Backend
- **Node.js**
- **Express.js** 4.18
- **MySQL 2** (Promises)
- **CORS** & **Body-Parser**

### Database
- **MySQL** (XAMPP compatible)
- Auto-creating tables
- Proper relationships with Foreign Keys

---

## 🎯 Quick Start (5 Minutes)

### Prerequisites
- XAMPP with MySQL
- Node.js installed
- Git (optional)

### Installation
```bash
# 1. Start XAMPP MySQL (click Start in XAMPP Control Panel)

# 2. Create database via phpMyAdmin
# http://localhost/phpmyadmin
# SQL: CREATE DATABASE quiz_reviewer;

# 3. Install & Start Backend
cd backend
npm install
npm start
# Wait for: "Server running on http://localhost:3000"

# 4. Install & Start Frontend (NEW Terminal)
npm install
ng serve --poll=2000
# Wait for: "Application bundle generated successfully"

# 5. Open browser
# http://localhost:4200
```

**Or just double-click `start.bat`!** (Windows)

---

## 📁 Project Structure

```
Reviewer_app/
├── backend/                          # Express server
│   ├── index.js                      # Main server file
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Config template
│   └── README.md                     # Backend docs
│
├── src/                              # Frontend source
│   ├── app/
│   │   ├── components/               # Page components
│   │   │   ├── create-quiz/          # Create quiz page
│   │   │   ├── quiz-list/            # List & search quizzes
│   │   │   ├── take-quiz/            # Take quiz page
│   │   │   └── quiz-results/         # View results
│   │   ├── home/                     # Home page
│   │   ├── services/
│   │   │   └── quiz.ts               # API service
│   │   ├── models/
│   │   │   └── quiz.ts               # TypeScript interfaces
│   │   └── app-routing.module.ts     # Routes
│   ├── environments/
│   │   └── environment.ts            # API config
│   └── main.ts                       # Bootstrap
│
├── start.bat                         # Windows startup script
├── start.sh                          # Linux/Mac startup
├── QUICK_START.md                    # 5-minute guide
├── XAMPP_SETUP.md                    # Detailed XAMPP guide
├── SETUP_GUIDE.md                    # Full setup guide
├── package.json                      # Frontend dependencies
├── angular.json                      # Angular config
└── README.md                         # This file
```

---

## 🔌 API Endpoints

### Quiz Management
```
GET    /api/quizzes                  # Get all quizzes
GET    /api/quizzes/:id              # Get specific quiz
POST   /api/quizzes                  # Create quiz
PUT    /api/quizzes/:id              # Update quiz
DELETE /api/quizzes/:id              # Delete quiz
```

### Questions
```
POST   /api/quizzes/:id/questions    # Add question to quiz
```

### Results
```
POST   /api/quizzes/:id/submit       # Submit quiz answers
GET    /api/results                  # Get all results
GET    /api/quizzes/:id/results      # Get results for quiz
```

### Health Check
```
GET    /api/health                   # Server status
GET    /                             # API info
```

---

## 📊 Database Schema

### `quizzes` Table
```sql
id (INT, PK, Auto-increment)
title (VARCHAR 255)
description (TEXT)
created_at (TIMESTAMP)
```

### `questions` Table
```sql
id (INT, PK, Auto-increment)
quiz_id (INT, FK → quizzes)
question (TEXT)
option1 (VARCHAR 255)
option2 (VARCHAR 255)
option3 (VARCHAR 255)
option4 (VARCHAR 255)
correct_answer (INT 1-4)
```

### `results` Table
```sql
id (INT, PK, Auto-increment)
quiz_id (INT, FK → quizzes)
quiz_title (VARCHAR 255)
score (INT)
total_questions (INT)
percentage (INT)
completed_at (TIMESTAMP)
```

---

## 🎮 How to Use

### Create a Quiz
1. Click **"Create New Quiz"** from home
2. Enter **Title** and **Description**
3. Click **"Add"** button
4. Fill in:
   - Question text
   - 4 answer options
   - Select correct answer
5. Click **"Add Question"**
6. Repeat steps 3-5 for more questions
7. Click **"Create Quiz"** to save

### Take a Quiz
1. Click **"Take Quiz"** from home
2. See list of available quizzes
3. Click **"Start Quiz"** on desired quiz
4. Answer each question by clicking option
5. Navigate with **Previous/Next** buttons
6. Click **"Submit Quiz"** on last question
7. View results immediately

### View Results
1. Click **"View Results"** from home
2. See all quiz attempts
3. Click any result to see:
   - Score & Percentage
   - Correct/Wrong count
   - Detailed analysis

---

## 🐛 Troubleshooting

### "Cannot GET /" Error
```
✗ Frontend not running or backend not accessible
✓ Solution:
  - Ensure backend started (Terminal 1): "Server running on http://localhost:3000"
  - Ensure frontend started (Terminal 2): "Application bundle generated"
  - Open http://localhost:4200 (not 3000)
```

### MySQL Connection Error
```
✗ Database not running or incorrect credentials
✓ Solution:
  - Open XAMPP Control Panel
  - Ensure MySQL shows "running" (green)
  - Check database exists: phpMyAdmin → Look for "quiz_reviewer"
  - Verify credentials in backend/.env
```

### Port Already in Use
```
✗ Port 3000 or 4200 already in use
✓ Solution (Windows):
  # For port 3000:
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # For port 4200:
  netstat -ano | findstr :4200
  taskkill /PID <PID> /F
```

### Quiz Not Saving
```
✗ Backend error or validation failed
✓ Solution:
  - Check backend terminal for error messages
  - Open browser console (F12) → Console tab
  - Fill ALL quiz and question fields
  - Ensure at least one question added
  - Check MySQL is running
```

### Data Not Loading
```
✗ CORS, API URL, or network issue
✓ Solution:
  - Refresh page (Ctrl+F5)
  - Check browser console (F12) for CORS errors
  - Verify environment.ts has correct apiUrl
  - Test API directly: http://localhost:3000/api/quizzes
```

---

## 🚀 Running the App

### Option 1: Automatic (Windows)
```bash
Double-click: start.bat
```

### Option 2: Two Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # First time only
npm start
```

**Terminal 2 - Frontend:**
```bash
npm install  # First time only
ng serve --poll=2000
```

### Option 3: Manual Command Line (Windows)
```bash
npm install
cd backend
start "Backend" cmd /k npm start
cd ..
start "Frontend" cmd /k ng serve --poll=2000
```

---

## 📱 Responsive Design

- ✅ Mobile First
- ✅ Tablet Optimized
- ✅ Desktop Compatible
- ✅ Ionic Components
- ✅ Touch Friendly UI

---

## 🔐 Security Notes

- Change MySQL password in production
- Never commit `.env` file with real credentials
- Use HTTPS in production
- Validate all inputs on backend
- Use environment variables for sensitive data

---

## 🎓 Learning Resources

- **Angular**: https://angular.io/
- **Ionic**: https://ionicframework.com/
- **Express**: https://expressjs.com/
- **MySQL**: https://dev.mysql.com/doc/
- **TypeScript**: https://www.typescriptlang.org/

---

## 📝 Complete Functionality Checklist

✅ Frontend
- [x] Standalone components
- [x] Reactive forms validation
- [x] HTTP interceptor ready
- [x] Error handling
- [x] Loading states
- [x] Toast notifications
- [x] Search functionality
- [x] Responsive design
- [x] Dark mode ready structure

✅ Backend
- [x] Express server with CORS
- [x] MySQL connection pool
- [x] Database auto-initialization
- [x] CRUD endpoints
- [x] Error handling
- [x] Health check endpoint
- [x] Proper response formats
- [x] Input validation

✅ Database
- [x] Quiz table with timestamps
- [x] Questions with foreign keys
- [x] Results tracking
- [x] Cascading deletes
- [x] Proper indexing ready

✅ Documentation
- [x] QUICK_START.md (5-min guide)
- [x] XAMPP_SETUP.md (detailed)
- [x] SETUP_GUIDE.md (comprehensive)
- [x] This README.md
- [x] Backend README.md
- [x] Startup scripts (Windows & Linux)

---

## 💡 Future Enhancements

- [ ] User authentication/login
- [ ] Quiz categories/tags
- [ ] Timer for quiz
- [ ] Difficulty levels
- [ ] Question bank/pool
- [ ] Analytics dashboard
- [ ] Multiple attempts tracking
- [ ] Export results to PDF
- [ ] Social sharing
- [ ] Leaderboard

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Report bugs
2. Suggest features
3. Improve documentation
4. Optimize code

---

## 📄 License

This project is open source under the MIT License.

---

## 🙋 Support

If you encounter issues:

1. **Check Documentation**
   - Read QUICK_START.md
   - Review XAMPP_SETUP.md
   - Check component comments

2. **Check Logs**
   - Backend terminal for server errors
   - Browser console (F12) for frontend errors
   - XAMPP Control Panel for MySQL status

3. **Common Issues**
   - XAMPP MySQL not running
   - Node.js not installed
   - Port already in use
   - Database not created
   - Backend URL incorrect

---

## 🎉 Success Checklist

- [ ] XAMPP MySQL running
- [ ] Database "quiz_reviewer" created
- [ ] Backend started successfully
- [ ] Frontend loaded at localhost:4200
- [ ] Can create a quiz
- [ ] Can take a quiz
- [ ] Can see results
- [ ] Data persists after refresh

**If all checked ✅ - You're ready to use the app!**

---

**Built with ❤️ using Ionic, Angular, Express, and MySQL**

**Happy Learning! 🎓📚✨**
