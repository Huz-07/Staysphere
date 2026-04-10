# Contributing to StaySphere

Thank you for your interest in contributing to StaySphere! 🎉

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your feature or fix

```bash
git checkout -b feature/your-feature-name
```

4. **Install dependencies** for both frontend and backend:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

5. **Set up environment variables** — copy the example files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Development Workflow

- Run the **backend**: `cd backend && npm run dev`
- Run the **frontend**: `cd frontend && npm start`
- Make sure MongoDB is running locally before starting the backend

## Commit Guidelines

Use clear, descriptive commit messages:

```
feat: add room availability filter
fix: resolve booking date validation error
docs: update API endpoint documentation
style: format booking form CSS
refactor: extract auth middleware logic
```

## Pull Request Process

1. Ensure your code runs without errors
2. Update documentation if you've changed APIs or features
3. Write a clear PR description explaining **what** and **why**
4. Link any related issues

## Code Style

- Use **2-space indentation** (enforced by `.editorconfig`)
- Use **ES6+** syntax (arrow functions, const/let, template literals)
- Follow existing naming conventions in the codebase

## Reporting Bugs

Open an issue with:
- A clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

Open an issue with the `enhancement` label and describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

---

Thank you for helping make StaySphere better! 🏠
