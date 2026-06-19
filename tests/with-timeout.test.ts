import { describe, it, expect, vi, afterEach } from 'vitest'
import { withTimeout, TIMEOUT_MESSAGE } from '@/lib/with-timeout'

/**
 * Guards the auth timeout path: a hung Supabase call (e.g. signInWithPassword
 * that never settles on a flaky network) must reject after the timeout so the
 * sign-in spinner recovers instead of buffering forever.
 */
describe('withTimeout', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('rejects with a timeout error when the promise hangs past the limit', async () => {
    vi.useFakeTimers()
    const neverSettles = new Promise<string>(() => {}) // mimics a hung auth fetch

    const raced = withTimeout(neverSettles, 20000)
    const assertion = expect(raced).rejects.toThrow(TIMEOUT_MESSAGE)

    // Advance past the 20s timeout so the timer fires.
    await vi.advanceTimersByTimeAsync(20000)
    await assertion
  })

  it('resolves with the original value when it settles before the timeout', async () => {
    vi.useFakeTimers()
    const fast = Promise.resolve({ ok: true })

    await expect(withTimeout(fast, 20000)).resolves.toEqual({ ok: true })
  })

  it('rejects with the original error when it rejects before the timeout', async () => {
    vi.useFakeTimers()
    const failing = Promise.reject(new Error('Invalid login credentials'))

    await expect(withTimeout(failing, 20000)).rejects.toThrow('Invalid login credentials')
  })

  it('does not time out a promise that resolves just before the deadline', async () => {
    vi.useFakeTimers()
    const justInTime = new Promise<string>((resolve) => setTimeout(() => resolve('done'), 19999))

    const raced = withTimeout(justInTime, 20000)
    await vi.advanceTimersByTimeAsync(19999)
    await expect(raced).resolves.toBe('done')
  })
})
