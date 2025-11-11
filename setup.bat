@echo off

echo 🚀 Setting up AI Studio...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js is not installed
    exit /b 1
)

echo ✅ Node.js check passed

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating backend .env file...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env and set your JWT_SECRET
)

REM Create necessary directories
if not exist data mkdir data
if not exist uploads mkdir uploads

REM Run database migrations
echo 🗄️  Running database migrations...
call npm run db:migrate

cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating frontend .env file...
    copy .env.example .env
)

cd ..

REM Install test dependencies
echo 📦 Installing E2E test dependencies...
cd tests
call npm install

cd ..

echo.
echo ✅ Setup complete!
echo.
echo To start the development servers:
echo   npm run dev
echo.
echo Or start them separately:
echo   Backend:  cd backend ^&^& npm run dev
echo   Frontend: cd frontend ^&^& npm run dev
echo.
echo To run with Docker:
echo   docker-compose up --build
echo.
echo To run tests:
echo   npm test

pause
