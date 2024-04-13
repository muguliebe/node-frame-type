import DateUtils from '../../../src/utils/DateUtils'

describe('DateUtils', () => {
    test('format', () => {
        const result = DateUtils.format('YYYYMMDD')
        expect(result).not.toBeNull()
    })
    test('currentFullTime', () => {
        const result = DateUtils.currentFullTime()
        expect(result.length).toBe(17)
    })
    test('now', () => {
        const result = DateUtils.now()
        expect(result).not.toBeNull()
    })
    test('uptime', () => {
        const result = DateUtils.uptime()
        expect(result.length).toBe(19)
    })
})
