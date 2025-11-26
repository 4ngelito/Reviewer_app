# 🚀 Quick Start - Quiz Reviewer App

## ⚡ 5 Minute Setup with XAMPP

### What You Need
1. **XAMPP** with MySQL - Download: https://www.apachefriends.org/
2. **Node.js** - Download: https://nodejs.org/
3. This **Reviewer_app** folder

---

## ✅ Step 1: Start XAMPP MySQL

1. Open **XAMPP Control Panel**
2. Click **Start** next to **MySQL**
   - Wait for it to turn green
   - Shows "running on port 3306"

---

## ✅ Step 2: Create Database

Open browser: `http://localhost/phpmyadmin`

**Method 1: Using phpMyAdmin**
1. Click **SQL** tab
2. Paste: `CREATE DATABASE quiz_reviewer;`
3. Click **Go**

**OR Method 2: Command Line**
```bash
cd C:\xampp\mysql\bin
mysql -u root
CREATE DATABASE quiz_reviewer;
EXIT;
```

---

## ✅ Step 3: Install & Start Backend

Open Command Prompt:
```bash
cd path\to\Reviewer_app\backend

npm install

npm start
```

**Wait for message:** `Server running on http://localhost:3000`

---

## ✅ Step 4: Install & Start Frontend

Open **NEW** Command Prompt:
```bash
cd path\to\Reviewer_app

npm install

ng serve --poll=2000
```

**Wait for message:** `Application bundle generated successfully`

---

## ✅ Step 5: Open App

Open your browser:
```
http://localhost:4200
```

**Done! 🎉 App is ready to use**

---

## 📝 How to Use

### Create a Quiz
1. Click "Create New Quiz"
2. Enter Title & Description
3. Click "Add" to add question
4. Fill all fields, select correct answer
5. Click "Create Quiz"

### Take a Quiz
1. Click "Take Quiz"
2. Click "Start Quiz" on any quiz
3. Answer all questions
4. Click "Submit Quiz"

### View Results
1. Click "View Results"
2. Click result card to see details

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot GET /" | Make sure backend is running (Terminal 1) |
| MySQL Connection Error | Check XAMPP MySQL is green (running) |
| Port 3000 in use | `taskkill /F /IM node.exe` |
| Port 4200 in use | Kill process on 4200 |
| Quiz not saving | Check browser console (F12) for errors |

---

## 📞 Running on Startup (Easy Way)

**Windows Users:** Just double-click `start.bat` file!

It will automatically start both servers.

---

## 🎯 Default Ports

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- phpMyAdmin: `http://localhost/phpmyadmin`

---

**Enjoy! Happy Learning! 📚**
