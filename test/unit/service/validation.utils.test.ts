import {
    isValidEmail,
    isValidName,
    validatePagination
} from '@/service/utils/validation.utils'

describe('Validation Utils', () => {
    describe('isValidEmail', () => {
        it('should return true for valid emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true)
            expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
            expect(isValidEmail('test+tag@example.org')).toBe(true)
        })

        it('should return false for invalid emails', () => {
            expect(isValidEmail('invalid-email')).toBe(false)
            expect(isValidEmail('test@')).toBe(false)
            expect(isValidEmail('@example.com')).toBe(false)
            expect(isValidEmail('')).toBe(false)
        })
    })

    describe('isValidName', () => {
        it('should return true for valid names', () => {
            expect(isValidName('John')).toBe(true)
            expect(isValidName('John Doe')).toBe(true)
            expect(isValidName(' Valid Name ')).toBe(true)
        })

        it('should return false for invalid names', () => {
            expect(isValidName('')).toBe(false)
            expect(isValidName('   ')).toBe(false)
            expect(isValidName(null as any)).toBe(false)
            expect(isValidName(undefined as any)).toBe(false)
        })
    })

    describe('validatePagination', () => {
        it('should return valid pagination parameters', () => {
            const result = validatePagination(2, 20)
            expect(result.page).toBe(2)
            expect(result.size).toBe(20)
        })

        it('should handle invalid page numbers', () => {
            expect(validatePagination(0, 10).page).toBe(1)
            expect(validatePagination(-5, 10).page).toBe(1)
            expect(validatePagination(NaN, 10).page).toBe(1)
        })

        it('should handle invalid size numbers', () => {
            expect(validatePagination(1, 0).size).toBe(1)
            expect(validatePagination(1, -10).size).toBe(1)
            expect(validatePagination(1, 150).size).toBe(100) // max limit
            expect(validatePagination(1, NaN).size).toBe(10) // default
        })
    })
})