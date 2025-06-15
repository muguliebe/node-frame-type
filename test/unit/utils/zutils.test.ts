import { getAllFiles } from '../../../src/utils/zutils'

describe('zutils', () => {
    test('getAllFiles should return all files in directory', () => {
        const files = getAllFiles('./src/utils')
        expect(files.length).toBeGreaterThan(0)
        expect(files.some(file => file.includes('zutils.ts'))).toBe(true)
    })

    test('getAllFiles should handle empty arrayOfFiles parameter', () => {
        // This test covers line 7 where arrayOfFiles is reassigned
        const files = getAllFiles('./src/utils', undefined)
        expect(Array.isArray(files)).toBe(true)
        expect(files.length).toBeGreaterThan(0)
    })

    test('getAllFiles should recursively find files in subdirectories', () => {
        const files = getAllFiles('./src')
        expect(files.length).toBeGreaterThan(0)
        expect(files.some(file => file.includes('service'))).toBe(true)
        expect(files.some(file => file.includes('api'))).toBe(true)
    })
})