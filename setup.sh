#!/bin/bash

echo "🚀 Setting up AI Studio..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Error: Node.js 20 or higher is required"
  exit 1
fi

echo "✅ Node.js version check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating backend .env file..."
  cp .env.example .env
  echo "⚠️  Please edit backend/.env and set your JWT_SECRET"
fi

# Create necessary directories
mkdir -p data uploads

# Run database migrations
echo "🗄️  Running database migrations..."
npm run db:migrate

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating frontend .env file..."
  cp .env.example .env
fi

cd ..

# Install test dependencies
echo "📦 Installing E2E test dependencies..."
cd tests
npm install

cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "Or start them separately:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "To run with Docker:"
echo "  docker-compose up --build"
echo ""
echo "To run tests:"
echo "  npm test"
