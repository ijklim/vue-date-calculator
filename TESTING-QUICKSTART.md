# Quick Start - Testing

## Run Tests Immediately

```bash
# Run all tests once
pnpm test:run

# Run tests in watch mode (auto-rerun on file changes)
pnpm test

# Run tests with visual UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

## Test Results

✅ **28 tests passing**

Coverage includes:
- Component mounting and initialization
- Date calculation functions (add/subtract)
- All time units (minutes, hours, days, weeks, months)
- Date formatting (12-hour format with AM/PM)
- Operation descriptions
- Edge cases (month overflow, year boundaries)
- Date validation

## Quick Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DateCalculator from '../components/DateCalculator.vue'

describe('My Test', () => {
  it('should work', () => {
    const wrapper = mount(DateCalculator)
    expect(wrapper.exists()).toBe(true)
  })
})
```

## What's Tested

✅ Date calculations (all units)
✅ Input validation
✅ Date formatting
✅ Edge cases
✅ Operation descriptions

See [TESTING.md](./TESTING.md) for comprehensive documentation.
