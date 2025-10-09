import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock Vuetify components globally
config.global.stubs = {
  VCard: true,
  VCardTitle: true,
  VCardText: true,
  VCardSubtitle: true,
  VCardActions: true,
  VForm: true,
  VTextField: true,
  VSelect: true,
  VBtn: true,
  VAlert: true,
  VRow: true,
  VCol: true,
  VDivider: true,
}

// Suppress Vuetify warnings in tests
global.console.warn = vi.fn()
