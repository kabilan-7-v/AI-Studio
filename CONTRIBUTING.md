# Contributing to AI Studio

Thank you for your interest in contributing! This document provides guidelines for making contributions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ai-studio.git`
3. Install dependencies: `./setup.sh` (Linux/Mac) or `setup.bat` (Windows)
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Before Making Changes

1. Ensure you're on the latest version of `main`:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Making Changes

1. **Write Code**: Follow the existing code style and patterns
2. **Write Tests**: Add tests for new functionality
3. **Run Tests**: Ensure all tests pass
   ```bash
   npm test
   ```
4. **Run Linter**: Fix any linting issues
   ```bash
   npm run lint
   ```

### Code Style Guidelines

#### TypeScript
- Use strict mode (already configured)
- Avoid `any` type
- Use explicit return types for functions
- Use interfaces for object shapes

#### React Components
- Use functional components with hooks
- Use TypeScript for all components
- Add accessibility features (ARIA labels, keyboard navigation)
- Follow component structure:
  ```tsx
  interface ComponentProps {
    // props
  }

  export const Component: React.FC<ComponentProps> = ({ prop }) => {
    // hooks
    // handlers
    // render
  };
  ```

#### Backend Code
- Follow MVC pattern
- Use async/await for async operations
- Add proper error handling
- Validate inputs with Zod

### Testing Guidelines

#### Backend Tests
- Test happy paths and error cases
- Test authentication and authorization
- Test validation
- Use Supertest for API testing

#### Frontend Tests
- Test component rendering
- Test user interactions
- Test error states
- Test accessibility

#### E2E Tests
- Test complete user journeys
- Test error handling
- Test accessibility

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add dark mode toggle`
- `fix: resolve authentication bug`
- `test: add tests for generation API`
- `docs: update setup instructions`
- `refactor: simplify retry logic`

### Pull Request Process

1. **Update your branch** with the latest from main:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Push your changes**:
   ```bash
   git push origin your-feature-branch
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Screenshots for UI changes
   - Reference to related issues

4. **PR Description Template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests added/updated
   - [ ] All tests passing
   - [ ] Linting passing

   ## Checklist
   - [ ] Code follows project style
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)

   ## Screenshots (if applicable)
   ```

5. **Address Review Comments**:
   - Respond to all comments
   - Make requested changes
   - Push updates to the same branch

## Areas to Contribute

### High Priority
- [ ] Image resizing before upload
- [ ] Rate limiting on API endpoints
- [ ] Input sanitization for XSS prevention
- [ ] CSRF protection
- [ ] More comprehensive error handling

### Features
- [ ] Dark mode toggle
- [ ] Animations (Framer Motion)
- [ ] Code splitting and lazy loading
- [ ] CDN integration
- [ ] Image optimization

### Tests
- [ ] Increase test coverage
- [ ] Add more E2E test scenarios
- [ ] Add performance tests
- [ ] Add accessibility tests

### Documentation
- [ ] API usage examples
- [ ] Video tutorials
- [ ] Architecture diagrams
- [ ] Deployment guides

## Questions?

- Open an issue for bugs or feature requests
- Tag maintainers for urgent issues
- Be respectful and constructive

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
