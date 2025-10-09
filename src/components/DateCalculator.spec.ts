import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DateCalculator from '../components/DateCalculator.vue'

describe('DateCalculator', () => {
  let wrapper: any

  beforeEach(() => {
    // Mock current date to make tests deterministic
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15T10:30:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Component Mounting', () => {
    it('should render the component', () => {
      wrapper = mount(DateCalculator)
      expect(wrapper.exists()).toBe(true)
    })

    it('should have component instance', () => {
      wrapper = mount(DateCalculator)
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Initial State', () => {
    it('should have correct default operator and time unit', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      expect(vm.operator).toBe('add')
      expect(vm.timeUnit).toBe('days')
      expect(vm.result).toBe(null)
      expect(vm.errorMessage).toBe('')
    })

    it('should have isFormValid initially false', () => {
      wrapper = mount(DateCalculator)
      expect(wrapper.vm.isFormValid).toBe(false)
    })
  })

  describe('Date Calculation Functions', () => {
    it('should add days correctly using internal function', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const baseDate = new Date('2025-01-15T10:30:00')
      const result = vm.calculateDate(baseDate, 5, 'days', 'add')

      expect(result).toBeInstanceOf(Date)
      expect(result.getDate()).toBe(20) // 15 + 5 = 20
      expect(result.getMonth()).toBe(0) // January
    })

    it('should add hours correctly', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const baseDate = new Date('2025-01-15T10:30:00')
      const result = vm.calculateDate(baseDate, 3, 'hours', 'add')

      expect(result.getHours()).toBe(13) // 10 + 3 = 13
    })

    it('should add minutes correctly', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const baseDate = new Date('2025-01-15T10:30:00')
      const result = vm.calculateDate(baseDate, 45, 'minutes', 'add')

      expect(result.getMinutes()).toBe(15) // 30 + 45 = 75 minutes = 15 past the hour
      expect(result.getHours()).toBe(11) // Hour incremented
    })

    it('should add weeks correctly', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const baseDate = new Date('2025-01-15T10:30:00')
      const result = vm.calculateDate(baseDate, 2, 'weeks', 'add')

      expect(result.getDate()).toBe(29) // 15 + 14 = 29
    })

    it('should add months correctly', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const baseDate = new Date('2025-01-15T10:30:00')
      const result = vm.calculateDate(baseDate, 3, 'months', 'add')

      expect(result.getMonth()).toBe(3) // January (0) + 3 = April (3)
    })

    it('should subtract days correctly', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const baseDate = new Date('2025-01-15T10:30:00')
      const result = vm.calculateDate(baseDate, 5, 'days', 'subtract')

      expect(result.getDate()).toBe(10) // 15 - 5 = 10
    })

    it('should subtract hours correctly', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const baseDate = new Date('2025-01-15T10:30:00')
      const result = vm.calculateDate(baseDate, 2, 'hours', 'subtract')

      expect(result.getHours()).toBe(8) // 10 - 2 = 8
    })

    it('should subtract months correctly', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const baseDate = new Date('2025-01-15T10:30:00')
      const result = vm.calculateDate(baseDate, 2, 'months', 'subtract')

      expect(result.getMonth()).toBe(10) // January (0) - 2 = November previous year (10)
      expect(result.getFullYear()).toBe(2024)
    })
  })

  describe('Date Formatting', () => {
    it('should format date with time for hours unit', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      vm.timeUnit = 'hours'
      const date = new Date('2025-01-15T15:30:45')
      const formatted = vm.formatDateTime(date)

      expect(formatted).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (AM|PM)/)
      expect(formatted).toContain('PM') // 15:30 = 3:30 PM
    })

    it('should format date without time for days unit', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      vm.timeUnit = 'days'
      const date = new Date('2025-01-15T15:30:45')
      const formatted = vm.formatDateTime(date)

      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(formatted).not.toContain(':')
    })

    it('should format date with time for minutes unit', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      vm.timeUnit = 'minutes'
      const date = new Date('2025-01-15T10:30:45')
      const formatted = vm.formatDateTime(date)

      expect(formatted).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (AM|PM)/)
      expect(formatted).toContain('AM') // 10:30 = 10:30 AM
    })

    it('should use 12-hour format with AM', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      vm.timeUnit = 'hours'
      const date = new Date('2025-01-15T09:30:45')
      const formatted = vm.formatDateTime(date)

      expect(formatted).toContain('09:30:45 AM')
    })

    it('should use 12-hour format with PM', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      vm.timeUnit = 'hours'
      const date = new Date('2025-01-15T14:30:45')
      const formatted = vm.formatDateTime(date)

      expect(formatted).toContain('02:30:45 PM')
    })

    it('should handle midnight correctly', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      vm.timeUnit = 'hours'
      const date = new Date('2025-01-15T00:30:45')
      const formatted = vm.formatDateTime(date)

      expect(formatted).toContain('12:30:45 AM')
    })

    it('should handle noon correctly', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      vm.timeUnit = 'hours'
      const date = new Date('2025-01-15T12:30:45')
      const formatted = vm.formatDateTime(date)

      expect(formatted).toContain('12:30:45 PM')
    })
  })

  describe('Operation Description', () => {
    it('should return empty string when no result', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      expect(vm.operationDescription).toBe('')
    })

    it('should show correct description for adding days (simulated)', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      vm.quantity = 5
      vm.operator = 'add'
      vm.timeUnit = 'days'
      vm.inputDate = new Date()
      vm.result = new Date()

      expect(vm.operationDescription).toBe('Adding 5 days')
    })

    it('should show correct description for subtracting hours (simulated)', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      vm.quantity = 3
      vm.operator = 'subtract'
      vm.timeUnit = 'hours'
      vm.inputDate = new Date()
      vm.result = new Date()

      expect(vm.operationDescription).toBe('Subtracting 3 hours')
    })

    it('should use singular form for quantity of 1', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      vm.quantity = 1
      vm.operator = 'add'
      vm.timeUnit = 'days'
      vm.inputDate = new Date()
      vm.result = new Date()

      expect(vm.operationDescription).toBe('Adding 1 day')
    })
  })

  describe('Edge Cases', () => {
    it('should handle adding 0 quantity', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const baseDate = new Date('2025-01-15T10:30:00')
      const result = vm.calculateDate(baseDate, 0, 'days', 'add')

      expect(result.getTime()).toBe(baseDate.getTime())
    })

    it('should handle month overflow correctly', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      // January 31 + 1 month should be February 28
      const baseDate = new Date('2025-01-31T10:00:00')
      const result = vm.calculateDate(baseDate, 1, 'months', 'add')

      expect(result.getMonth()).toBe(1) // February
      expect(result.getDate()).toBe(28) // Feb 28 (2025 is not a leap year)
    })

    it('should handle year boundaries', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const baseDate = new Date('2024-12-31T23:00:00')
      const result = vm.calculateDate(baseDate, 2, 'hours', 'add')

      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(0) // January
      expect(result.getDate()).toBe(1)
    })
  })

  describe('Date Validation', () => {
    it('should validate valid dates', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const validDate = new Date('2025-01-15')
      expect(vm.isValidDate(validDate)).toBe(true)
    })

    it('should reject invalid dates', () => {
      wrapper = mount(DateCalculator)
      const vm = wrapper.vm

      const invalidDate = new Date('invalid')
      expect(vm.isValidDate(invalidDate)).toBe(false)
    })
  })
})
