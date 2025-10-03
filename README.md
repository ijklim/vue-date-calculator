# Vue Date Calculator

A Vue 3 application for calculating dates with Vuetify UI components.

## Features

- Add or subtract time from the current date/time
- Support for multiple time units: minutes, hours, days, weeks, months
- Form validation and error handling
- Responsive design with Vuetify
- No external date manipulation libraries (pure JavaScript Date API)

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

## Technology Stack

- Vue 3 (Composition API with `<script setup>`)
- TypeScript
- Vuetify 3
- Vite

## Usage

1. Enter a quantity (positive integer)
2. Select an operation (Add or Subtract)
3. Select a time unit (Minutes, Hours, Days, Weeks, or Months)
4. Click "Calculate" to see the result
