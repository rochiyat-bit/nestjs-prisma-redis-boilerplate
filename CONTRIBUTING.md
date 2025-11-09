# Contributing to NestJS Prisma Redis Boilerplate

Thank you for considering contributing to this project! This document outlines the process and guidelines for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Create a new issue with a clear title and description
3. Include steps to reproduce the bug
4. Provide error messages and logs if available
5. Specify your environment (OS, Node version, etc.)

### Suggesting Enhancements

1. Check if the enhancement has already been suggested
2. Create an issue with a clear description of the feature
3. Explain why this enhancement would be useful
4. Provide examples if possible

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/nestjs-prisma-redis-boilerplate.git
   cd nestjs-prisma-redis-boilerplate
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding standards
   - Write tests for new features
   - Update documentation if needed

4. **Run tests**
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Provide a clear description of your changes

## Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start database services**
   ```bash
   npm run docker:up
   ```

4. **Run migrations**
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Start development server**
   ```bash
   npm run start:dev
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Provide type definitions
- Avoid `any` type when possible

### NestJS Conventions

- Use dependency injection
- Follow module-based architecture
- Use DTOs for data validation
- Implement proper error handling

### File Naming

- Use kebab-case for file names: `auth.service.ts`
- Use PascalCase for class names: `AuthService`
- Use camelCase for variables and functions: `getUserById`

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Maximum line length: 100 characters
- Use meaningful variable names
- Add comments for complex logic

### Testing

- Write unit tests for services
- Write e2e tests for endpoints
- Aim for >80% code coverage
- Test edge cases and error scenarios

### Documentation

- Update README.md if needed
- Add JSDoc comments for public APIs
- Update Swagger decorators
- Keep CHANGELOG.md updated

## Project Structure

When adding new features, follow the existing structure:

```
src/modules/your-module/
├── dto/
│   ├── create-entity.dto.ts
│   └── update-entity.dto.ts
├── entities/
│   └── entity.entity.ts
├── your-module.controller.ts
├── your-module.service.ts
├── your-module.module.ts
└── your-module.service.spec.ts
```

## Commit Message Guidelines

Format: `type(scope): subject`

Example:
```
feat(auth): add password reset functionality
fix(todos): resolve pagination bug
docs(readme): update installation instructions
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

## Review Process

1. All PRs require at least one review
2. Address reviewer comments
3. Ensure CI/CD checks pass
4. Maintain clean commit history
5. Squash commits if needed

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Reach out to maintainers

Thank you for contributing! 🎉
