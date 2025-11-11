# Quick Start Guide

Get AI Studio running in 5 minutes!

## Prerequisites

- Node.js 20+
- npm

## Option 1: Automated Setup (Recommended)

### Linux/Mac
```bash
cd ai-studio
chmod +x setup.sh
./setup.sh
```

### Windows
```bash
cd ai-studio
setup.bat
```

Then start the servers:
```bash
npm run dev
```

Visit http://localhost:3000

## Option 2: Docker (Easiest)

```bash
cd ai-studio
docker-compose up --build
```

Visit http://localhost

## Option 3: Manual Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env and set JWT_SECRET
npm run db:migrate
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

## First Steps

1. **Sign Up**: Create an account at http://localhost:3000/signup
2. **Upload**: Click to upload a fashion image (JPEG/PNG, max 10MB)
3. **Generate**: Add a prompt and select a style
4. **Wait**: Generation takes 1-2 seconds (20% chance of retry)
5. **View**: See your result and check the history sidebar

## Running Tests

```bash
# All tests
npm test

# Backend only
cd backend && npm test

# Frontend only
cd frontend && npm test

# E2E tests (after starting servers)
cd tests && npm test
```

## Common Issues

**Port already in use**
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`

**Database errors**
- Delete `backend/data/` and run `npm run db:migrate` again

**JWT errors**
- Set a proper JWT_SECRET in `backend/.env`

## Next Steps

- Read the full [README.md](./README.md)
- Check the [API Documentation](./OPENAPI.yaml)
- See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Open an issue on GitHub
- Review [EVAL.md](./EVAL.md) for feature locations
