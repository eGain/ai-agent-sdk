# Contributing

Thank you for your interest in contributing to the AI Agent SDK!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/egain/ai-agent-sdk.git
cd ai-agent/ai-agent-sdk

# Install dependencies
npm install

# Build
npm run build:all

# Run tests
npm test

# Watch mode
npm run dev
```

## Project Structure

```
ai-agent-sdk/
├── src/
│   ├── index.ts           # Main exports
│   ├── core/
│   │   ├── AiAgent.ts     # Main class
│   │   ├── api/           # API helpers
│   │   ├── auth/          # Authentication
│   │   ├── connection/    # WebSocket
│   │   ├── errors/        # Error classes
│   │   ├── events/        # Event emitter
│   │   ├── logging/       # Logging
│   │   ├── message/       # Message handling
│   │   └── queue/         # Message queue
│   └── browser/           # Browser-specific
├── docs/                  # VitePress docs
├── usage-examples/        # Example apps
└── dist/                  # Build output
```

## Code Style

- TypeScript strict mode
- ESLint for linting
- Prettier for formatting
- Comprehensive JSDoc comments

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Documentation

```bash
# Development server
npm run docs:dev

# Build docs
npm run docs:build

# Generate API reference
npm run docs:api
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Update documentation if needed
6. Run tests (`npm test`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new authentication strategy
fix: resolve connection timeout issue
docs: update authentication guide
test: add tests for message queue
refactor: simplify error handling
```

## Reporting Issues

When reporting issues, please include:

- SDK version
- Node.js/Browser version
- Minimal reproduction code
- Expected vs actual behavior
- Error messages and stack traces

## Questions?

Open a [GitHub Discussion](https://github.com/egain/ai-agent-sdk/discussions) for questions and ideas.
