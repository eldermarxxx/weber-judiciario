import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Sem globals do Vitest, a limpeza entre testes precisa ser explícita.
afterEach(() => {
  cleanup()
})
