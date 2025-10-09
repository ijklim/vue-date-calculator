# Vue Date Calculator

A Vue 3 application for calculating dates with Vuetify UI components.

## Features

- ➕ Add or subtract time from the current date/time
- 📅 Support for multiple time units: minutes, hours, days, weeks, months
- ✅ Form validation and error handling
- 📱 Responsive design with Vuetify (two-column layout on md+ screens)
- 🎯 No external date manipulation libraries (pure JavaScript Date API)
- 🕐 12-hour time format with AM/PM
- 🧪 Comprehensive test coverage with Vitest

## Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Testing

This project includes a comprehensive test suite built with modern testing tools.

### Testing Libraries

- **[Vitest](https://vitest.dev/)** `^3.2.4` - Fast unit test framework built for Vite
- **[@vue/test-utils](https://test-utils.vuejs.org/)** `^2.4.6` - Official Vue 3 testing utilities
- **[@vitest/ui](https://vitest.dev/guide/ui.html)** `^3.2.4` - Interactive test runner with visual UI
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Code coverage reporting
- **[jsdom](https://github.com/jsdom/jsdom)** `^27.0.0` - DOM implementation for Node.js testing
- **[happy-dom](https://github.com/capricorn86/happy-dom)** `^19.0.2` - Alternative fast DOM implementation

### Running Tests

```bash
# Run tests in watch mode (recommended for development)
pnpm test

# Run tests once (for CI/CD)
pnpm test:run

# Run tests with interactive UI
pnpm test:ui

# Generate code coverage report
pnpm test:coverage
```

### Test Coverage

The test suite covers:
- ✅ Component mounting and rendering
- ✅ Date calculations (add/subtract for all time units)
- ✅ Input validation (null, negative, non-integer)
- ✅ Date formatting (12-hour format, conditional time display)
- ✅ Edge cases (month overflow, year boundaries, zero quantity)
- ✅ Operation descriptions and UI state

For detailed testing documentation, see [TESTING.md](./TESTING.md).

## Technology Stack

- **Vue 3** (Composition API with `<script setup>`)
- **TypeScript** (~5.3.0)
- **Vuetify 3** (^3.5.0) - Material Design component framework
- **Vite** (^7.1.9) - Fast build tool
- **Vitest** (^3.2.4) - Testing framework

## Usage

1. Enter a quantity (positive integer)
2. Select an operation (Add or Subtract)
3. Select a time unit (Minutes, Hours, Days, Weeks, or Months)
4. Click "Calculate" to see the result

### Time Display

- **Minutes & Hours**: Shows full date and time in 12-hour format (e.g., `2025-10-09 03:30:45 PM`)
- **Days, Weeks & Months**: Shows date only (e.g., `2025-10-15`)

## Deployment

This project includes automated GitHub Actions deployment via SSH.

```bash
# Deploy to server (automatically triggered on push to main)
git push origin main

# Manual deployment with dry-run option
# Go to Actions → Select workflow → Run workflow → Set dry_run to true
```

See `.github/workflows/deploy.yml` for deployment configuration.

## Project Structure

```
vue-date-calculator/
├── src/
│   ├── components/
│   │   ├── DateCalculator.vue       # Main calculator component
│   │   └── DateCalculator.spec.ts   # Component tests
│   ├── test/
│   │   └── setup.ts                 # Test setup and global mocks
│   ├── App.vue                      # Root component
│   └── main.ts                      # Application entry point
├── .github/
│   └── workflows/
│       └── deploy.yml               # CI/CD deployment workflow
├── vitest.config.ts                 # Vitest configuration
├── vite.config.ts                   # Vite configuration
├── TESTING.md                       # Detailed testing documentation
└── package.json                     # Project dependencies and scripts
```

## Development

```bash
# Start dev server with hot reload
pnpm dev

# Run type checking
vue-tsc

# Build for production
pnpm build

# Run tests in watch mode while developing
pnpm test
```

## License

Private project
