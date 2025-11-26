#!/bin/bash

# XAMPP Quiz Reviewer App Startup Script

echo "================================"
echo "Quiz Reviewer App - Quick Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "Error: npm is not installed"
    exit 1
fi

echo "✓ npm found: $(npm --version)"

echo ""
echo "Starting Backend Server..."
echo "================================"

# Navigate to backend and start server
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Start the backend
npm start &
BACKEND_PID=$!

echo ""
echo "Backend started with PID: $BACKEND_PID"
echo ""
sleep 2

echo "Starting Frontend App..."
echo "================================"

# Navigate back and start frontend
cd ..

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start the frontend
echo ""
echo "Starting Angular development server..."
ng serve

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
