# Testing Documentation

## Testing Stack

This project uses a modern testing stack optimized for Vue 3 + Vite applications:

### Core Testing Libraries

- **[Vitest](https://vitest.dev/)** `^3.2.4` - Fast unit test framework built for Vite
  - Jest-compatible API
  - Native ESM and TypeScript support
  - Built-in code coverage with V8
  - Fast watch mode with HMR

- **[@vue/test-utils](https://test-utils.vuejs.org/)** `^2.4.6` - Official Vue 3 testing utilities
  - Component mounting and wrapper utilities
  - DOM interaction helpers
  - Props, events, and slots testing

- **[@vitest/ui](https://vitest.dev/guide/ui.html)** `^3.2.4` - Interactive test runner UI
  - Visual test execution
  - Real-time test results
  - Code coverage visualization

- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Code coverage via V8
  - Line, branch, function coverage
  - HTML, JSON, and text reports

- **[jsdom](https://github.com/jsdom/jsdom)** `^27.0.0` - DOM implementation for Node.js
  - Browser-like environment for tests
  - DOM API simulation

- **[happy-dom](https://github.com/capricorn86/happy-dom)** `^19.0.2` - Alternative DOM implementation
  - Faster than jsdom (optional alternative)

## Test Configuration

### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,              // Enable global test APIs (describe, it, expect)
    environment: 'jsdom',       // Use jsdom for DOM simulation
    setupFiles: ['./src/test/setup.ts'],  // Setup file for Vuetify mocks
    coverage: {
      provider: 'v8',           // Use V8 for coverage
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/main.ts',
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### `src/test/setup.ts`
Global test setup file that:
- Configures Vue Test Utils to stub Vuetify components
- Suppresses unnecessary console warnings in tests
- Provides consistent test environment

## Running Tests

### Watch Mode (Development)
Run tests continuously as you code:
```bash
pnpm test
```

### Single Run (CI/Production)
Run all tests once and exit:
```bash
pnpm test:run
```

### Interactive UI
Launch the visual test runner:
```bash
pnpm test:ui
```
Then open http://localhost:51204/__vitest__/

### With Coverage
Generate code coverage reports:
```bash
pnpm test:coverage
```
Coverage reports will be generated in the `coverage/` directory.

## Test Structure

### Component Tests
Located alongside components: `src/components/*.spec.ts`

Example test structure:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DateCalculator from '../components/DateCalculator.vue'

describe('DateCalculator', () => {
  let wrapper: any

  beforeEach(() => {
    // Setup before each test
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15T10:30:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('should render the component', () => {
    wrapper = mount(DateCalculator)
    expect(wrapper.exists()).toBe(true)
  })
})
```

## Test Coverage

Current test coverage for `DateCalculator.vue`:

### Test Categories

1. **Component Mounting** - Basic rendering and initialization
2. **Initial State** - Default values and initial UI state
3. **Date Calculation - Addition** - Adding minutes, hours, days, weeks, months
4. **Date Calculation - Subtraction** - Subtracting time units
5. **Validation** - Input validation (null, negative, non-integer)
6. **Date Formatting** - 12-hour format, AM/PM, conditional time display
7. **Operation Description** - Human-readable operation summaries
8. **Edge Cases** - Month overflow, year boundaries, zero quantity

### Key Features Tested

✅ Add/subtract time calculations
✅ Input validation (required, positive, integer)
✅ Date formatting (with/without time based on unit)
✅ 12-hour time format with AM/PM
✅ Month overflow handling (e.g., Jan 31 + 1 month = Feb 28)
✅ Year boundary transitions
✅ Singular/plural unit names
✅ Version display from package.json

## Writing New Tests

### Testing Guidelines

1. **Use descriptive test names**
   ```typescript
   it('should add 5 days correctly', async () => { ... })
   ```

2. **Mock time for deterministic tests**
   ```typescript
   vi.setSystemTime(new Date('2025-01-15T10:30:00'))
   ```

3. **Test both happy paths and edge cases**
   - Valid inputs
   - Invalid inputs
   - Boundary conditions

4. **Clean up after tests**
   ```typescript
   afterEach(() => {
     vi.useRealTimers()
     wrapper?.unmount()
   })
   ```

5. **Use async/await for reactive updates**
   ```typescript
   await vm.calculate()
   expect(vm.result).toBeInstanceOf(Date)
   ```

## Continuous Integration

The test suite can be integrated into CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run tests
  run: pnpm test:run

- name: Generate coverage
  run: pnpm test:coverage
```

## Troubleshooting

### Vuetify Component Warnings
If you see warnings about Vuetify components, ensure `src/test/setup.ts` stubs them properly.

### Flaky Date Tests
Use `vi.useFakeTimers()` and `vi.setSystemTime()` to make date-dependent tests deterministic.

### Import Errors
Ensure TypeScript can resolve `@/` alias by checking `vitest.config.ts` resolve settings.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils Guide](https://test-utils.vuejs.org/guide/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Future Enhancements

- [ ] Add E2E tests with Playwright or Cypress
- [ ] Add visual regression tests
- [ ] Add accessibility tests with axe-core
- [ ] Improve coverage to 100%
- [ ] Add performance benchmarks
