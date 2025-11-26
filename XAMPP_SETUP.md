# Quiz Reviewer App - XAMPP Setup Guide

Complete setup guide for running the Quiz Reviewer App with XAMPP, MySQL, and phpMyAdmin.

## Prerequisites

### 1. Download & Install XAMPP
- Download from: https://www.apachefriends.org/download.html
- Choose the version with MySQL and PHP
- Install to default location (C:\xampp on Windows)

### 2. Download & Install Node.js
- Download from: https://nodejs.org/
- Choose LTS version
- Install with default settings

### 3. Verify Installations
```bash
node --version
npm --version
```

## XAMPP Configuration

### Step 1: Start XAMPP MySQL

1. Open **XAMPP Control Panel**
   - Windows: `C:\xampp\xampp-control.exe`

2. Start **MySQL**
   - Click "Start" button next to "MySQL"
   - You should see port 3306 running
   - Status should show green

3. Start **Apache** (Optional, only needed if using phpMyAdmin)
   - Click "Start" button next to "Apache"

### Step 2: Create Database in phpMyAdmin

1. Open Browser: http://localhost/phpmyadmin

2. Click on **SQL** tab

3. Paste this SQL command:
```sql
CREATE DATABASE quiz_reviewer;
```

4. Click **Go**

Database is now created! Tables will auto-create when you start the backend.

### Alternative: Using MySQL Command Line

1. Open Command Prompt as Administrator

2. Navigate to MySQL bin folder:
```bash
cd C:\xampp\mysql\bin
```

3. Login to MySQL:
```bash
mysql -u root
```

4. Create database:
```sql
CREATE DATABASE quiz_reviewer;
EXIT;
```

## Project Setup

### Step 1: Extract Project Files
- Extract Reviewer_app folder to your desired location
- Example: `C:\Users\YourName\Desktop\Reviewer_app`

### Step 2: Install Dependencies

Open Command Prompt and navigate to project:
```bash
cd Reviewer_app
```

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

### Step 3: Update Backend Configuration (if needed)

Edit `backend/.env` if you have a MySQL password:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=quiz_reviewer
DB_PORT=3306
PORT=3000
```

## Running the Application

### Easiest Way: Use Startup Script

**Windows:**
1. Double-click `start.bat` in project folder
2. Two command windows will open
3. Wait for messages saying servers started
4. Open browser: http://localhost:4200

**Alternative: Manual Start**

Open **2 Command Prompts**:

**Terminal 1 - Backend:**
```bash
cd Reviewer_app\backend
npm start
```
You should see: "Server running on http://localhost:3000"

**Terminal 2 - Frontend:**
```bash
cd Reviewer_app
ng serve --poll=2000
```
You should see: "Application bundle generated successfully"

Then open: http://localhost:4200

## Using the App

### Create Quiz
1. Click "Create New Quiz"
2. Enter title and description
3. Click "Add" button to add questions
4. Fill in all fields and select correct answer
5. Click "Create Quiz"

### Take Quiz
1. Click "Take Quiz"
2. Select any quiz from the list
3. Answer all questions
4. Click "Submit Quiz" to finish

### View Results
1. Click "View Results"
2. Click on any result to see details
3. View score, percentage, and analysis

## Troubleshooting

### Problem: "Cannot GET /" Error
**Solution:**
- Make sure backend is running (Terminal 1)
- Make sure frontend is running (Terminal 2)
- MySQL must be running in XAMPP
- Open http://localhost:4200 (not 3000)

### Problem: MySQL Connection Error
**Solution:**
- Check XAMPP Control Panel - MySQL must be green (running)
- Verify database created: Open http://localhost/phpmyadmin
- Check database name is "quiz_reviewer"

### Problem: Port 3000 Already in Use
**Solution:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with number)
taskkill /PID <PID> /F
```

### Problem: Port 4200 Already in Use
**Solution:**
```bash
# Find process using port 4200
netstat -ano | findstr :4200

# Kill process
taskkill /PID <PID> /F
```

### Problem: Quiz Not Showing After Creation
**Solution:**
1. Refresh page (Ctrl+F5)
2. Check browser console for errors (F12)
3. Verify MySQL is running
4. Check backend terminal for error messages

### Problem: "npm: command not found"
**Solution:**
- Node.js not installed properly
- Restart computer after installing Node.js
- Add Node.js to PATH manually if needed

## Ports Reference

- **Frontend App:** http://localhost:4200
- **Backend API:** http://localhost:3000
- **phpMyAdmin:** http://localhost/phpmyadmin
- **Apache Web Server:** http://localhost
- **MySQL:** localhost:3306

## File Structure

```
Reviewer_app/
├── backend/
│   ├── index.js          (Express server)
│   ├── package.json
│   ├── .env              (MySQL config)
│   └── README.md
├── src/
│   ├── app/
│   │   ├── components/   (Quiz pages)
│   │   ├── services/     (API calls)
│   │   └── models/       (Data types)
│   └── environments/     (API config)
├── start.bat             (Windows startup)
├── start.sh              (Linux/Mac startup)
├── package.json          (Frontend deps)
└── XAMPP_SETUP.md        (This file)
```

## Database Schema

### quizzes table
- `id` - Unique quiz ID
- `title` - Quiz title
- `description` - Quiz description
- `created_at` - Creation date

### questions table
- `id` - Unique question ID
- `quiz_id` - Links to quiz
- `question` - Question text
- `option1, option2, option3, option4` - Answer options
- `correct_answer` - Correct option (1-4)

### results table
- `id` - Unique result ID
- `quiz_id` - Quiz taken
- `quiz_title` - Quiz title
- `score` - Correct answers
- `total_questions` - Total questions
- `percentage` - Score percentage
- `completed_at` - When taken

## Tips & Best Practices

1. **Always start XAMPP MySQL first** before running the app

2. **Keep both terminals open** while developing
   - One for backend (cannot close)
   - One for frontend (can refresh)

3. **Check backend terminal** if something doesn't work
   - Errors appear in backend terminal
   - Frontend errors appear in browser console (F12)

4. **Backup your database**
   - Use phpMyAdmin to export
   - Settings > Export > Choose "quiz_reviewer"

5. **For production:**
   - Build frontend: `ng build --prod`
   - Deploy backend to cloud service
   - Use actual MySQL server, not XAMPP

## Support Resources

- Angular Docs: https://angular.io/docs
- Ionic Docs: https://ionicframework.com/docs
- Express Docs: https://expressjs.com/
- MySQL Docs: https://dev.mysql.com/doc/
- XAMPP Docs: https://www.apachefriends.org/

---

**Ready to create awesome quizzes! 🚀**
