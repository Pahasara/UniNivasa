import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn()', () => {
    it('merges multiple class names', () => {
        expect(cn('text-sm', 'bg-red-500')).toBe('text-sm bg-red-500')
    })

    it('removes falsy values', () => {
        expect(cn('text-sm', false && 'bg-red-500', undefined)).toBe('text-sm')
    })

    it('handles conditional classes', () => {
        const active = true
        expect(cn('text-sm', active && 'font-bold')).toBe('text-sm font-bold')
    })
})
