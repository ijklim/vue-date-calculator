<script setup lang="ts">
import { ref, computed } from 'vue'
import packageJson from '../../package.json'

// Types
type Operator = 'add' | 'subtract'
type TimeUnit = 'minutes' | 'hours' | 'days' | 'weeks' | 'months'

interface SelectOption {
  title: string
  value: string
}

// Form state
const formRef = ref()
const isFormValid = ref(false)
const quantity = ref<number | null>(1)
const operator = ref<Operator>('add')
const timeUnit = ref<TimeUnit>('days')

// Calculation state
const isCalculating = ref(false)
const inputDate = ref<Date | null>(null)
const result = ref<Date | null>(null)
const errorMessage = ref('')
const quantityError = ref('')

// Options
const operatorOptions: SelectOption[] = [
  { title: 'Add', value: 'add' },
  { title: 'Subtract', value: 'subtract' }
]

const timeUnitOptions: SelectOption[] = [
  { title: 'Minutes', value: 'minutes' },
  { title: 'Hours', value: 'hours' },
  { title: 'Days', value: 'days' },
  { title: 'Weeks', value: 'weeks' },
  { title: 'Months', value: 'months' }
]

// Validation rules
const quantityRules = [
  (v: number | null) => v !== null && v !== undefined || 'Quantity is required',
  (v: number | null) => v !== null && !isNaN(v) || 'Must be a valid number',
  (v: number | null) => v !== null && Number.isInteger(v) || 'Must be a whole number',
  (v: number | null) => v !== null && v >= 0 || 'Must be a positive number'
]

// Computed
const operationDescription = computed(() => {
  if (!quantity.value || !inputDate.value || !result.value) return ''

  const operation = operator.value === 'add' ? 'Adding' : 'Subtracting'
  const unitName = timeUnit.value
  const quantityValue = quantity.value
  const unit = quantityValue === 1 ? unitName.slice(0, -1) : unitName

  return `${operation} ${quantityValue} ${unit}`
})

// Date calculation functions (without external libraries)
function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}

function addHours(date: Date, hours: number): Date {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7)
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  const day = result.getDate()

  result.setMonth(result.getMonth() + months)

  // Handle case where the day doesn't exist in the target month
  // (e.g., Jan 31 + 1 month should be Feb 28/29, not Mar 3)
  if (result.getDate() !== day) {
    result.setDate(0) // Set to last day of previous month
  }

  return result
}

function calculateDate(baseDate: Date, qty: number, unit: TimeUnit, op: Operator): Date {
  const amount = op === 'add' ? qty : -qty

  switch (unit) {
    case 'minutes':
      return addMinutes(baseDate, amount)
    case 'hours':
      return addHours(baseDate, amount)
    case 'days':
      return addDays(baseDate, amount)
    case 'weeks':
      return addWeeks(baseDate, amount)
    case 'months':
      return addMonths(baseDate, amount)
    default:
      throw new Error(`Unknown time unit: ${unit}`)
  }
}

// Format date function
function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  // Only show time for minutes and hours
  if (timeUnit.value === 'minutes' || timeUnit.value === 'hours') {
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // 0 should be 12
    const hoursStr = String(hours).padStart(2, '0')

    return `${year}-${month}-${day} ${hoursStr}:${minutes}:${seconds} ${ampm}`
  }

  return `${year}-${month}-${day}`
}

// Validate date
function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}

// Calculate function
async function calculate() {
  errorMessage.value = ''
  quantityError.value = ''

  // Validate form
  const { valid } = await formRef.value.validate()
  if (!valid) {
    return
  }

  // Additional validation
  if (quantity.value === null || quantity.value === undefined) {
    quantityError.value = 'Quantity is required'
    return
  }

  if (quantity.value < 0) {
    quantityError.value = 'Quantity must be positive'
    return
  }

  if (!Number.isInteger(quantity.value)) {
    quantityError.value = 'Quantity must be a whole number'
    return
  }

  isCalculating.value = true

  try {
    // Simulate a slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))

    const now = new Date()
    inputDate.value = now

    const calculatedDate = calculateDate(
      now,
      quantity.value,
      timeUnit.value,
      operator.value
    )

    // Validate the result
    if (!isValidDate(calculatedDate)) {
      throw new Error('Calculated date is invalid')
    }

    // Check for date overflow (year must be between 1000 and 9999)
    const year = calculatedDate.getFullYear()
    if (year < 1000 || year > 9999) {
      throw new Error('Calculated date is out of valid range (year must be between 1000 and 9999)')
    }

    result.value = calculatedDate
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'An error occurred during calculation'
    result.value = null
  } finally {
    isCalculating.value = false
  }
}
</script>

<template>
  <VCard class="mx-auto" elevation="8">
    <VCardTitle class="text-h4 text-center py-2 bg-primary">
      Date Calculator
    </VCardTitle>

    <VCardText class="pa-6">
      <VRow>
        <!-- Input Section -->
        <VCol cols="12" md="6">
          <VForm ref="formRef" v-model="isFormValid" @submit.prevent="calculate">
            <!-- Quantity Input -->
            <VTextField
              v-model.number="quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              :rules="quantityRules"
              :error-messages="quantityError"
              density="comfortable"
              class="mb-4"
              required
            />

            <!-- Operator Select -->
            <VSelect
              v-model="operator"
              label="Operation"
              :items="operatorOptions"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <!-- Time Unit Select -->
            <VSelect
              v-model="timeUnit"
              label="Time Unit"
              :items="timeUnitOptions"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <!-- Calculate Button -->
            <VBtn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="isCalculating"
              :disabled="!isFormValid"
              class="mb-4"
            >
              Calculate
            </VBtn>

            <!-- Error Display -->
            <VAlert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </VAlert>
          </VForm>
        </VCol>

        <!-- Divider for mobile -->
        <VCol cols="12" class="d-md-none">
          <VDivider />
        </VCol>

        <!-- Output Section -->
        <VCol cols="12" md="6">
          <VCard v-if="result" variant="tonal" color="primary" class="pa-4">
            <VCardSubtitle class="text-overline mb-2">
              Current Date/Time
            </VCardSubtitle>
            <VCardText class="text-h6 py-2">
              {{ inputDate ? formatDateTime(inputDate) : '' }}
            </VCardText>

            <VDivider class="my-4" />

            <VCardSubtitle class="text-overline mb-2">
              Calculated Date/Time
            </VCardSubtitle>
            <VCardText class="text-h6 py-2">
              {{ formatDateTime(result) }}
            </VCardText>

            <VDivider class="my-4" />

            <VCardSubtitle class="text-overline mb-2">
              Operation
            </VCardSubtitle>
            <VCardText class="text-body-1">
              {{ operationDescription }}
            </VCardText>
          </VCard>

          <VCard v-else variant="outlined" class="pa-4 text-center">
            <VCardText class="text-body-1 text-medium-emphasis">
              Results will appear here after calculation
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>

    <VCardActions class="px-6 justify-end bg-blue-grey-lighten-5">
      <span class="text-caption text-medium-emphasis">
        v{{ packageJson.version }}
      </span>
    </VCardActions>
  </VCard>
</template>

<style scoped>
.v-card-title {
  word-break: break-word;
}
</style>
