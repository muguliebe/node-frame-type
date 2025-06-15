import {
    createSuccessResponse,
    createErrorResponse,
    createPaginationResponse
} from '@/service/utils/response.utils'

describe('Response Utils', () => {
    describe('createSuccessResponse', () => {
        it('should create success response with data', () => {
            const data = { id: 1, name: 'test' }
            const result = createSuccessResponse(data)

            expect(result.success).toBe(true)
            expect(result.data).toEqual(data)
            expect(result.timestamp).toBeDefined()
            expect(result.message).toBeUndefined()
        })

        it('should create success response with data and message', () => {
            const data = { id: 1, name: 'test' }
            const message = 'Operation successful'
            const result = createSuccessResponse(data, message)

            expect(result.success).toBe(true)
            expect(result.data).toEqual(data)
            expect(result.message).toBe(message)
            expect(result.timestamp).toBeDefined()
        })
    })

    describe('createErrorResponse', () => {
        it('should create error response with message', () => {
            const message = 'Something went wrong'
            const result = createErrorResponse(message)

            expect(result.success).toBe(false)
            expect(result.message).toBe(message)
            expect(result.timestamp).toBeDefined()
            expect(result.data).toBeUndefined()
        })
    })

    describe('createPaginationResponse', () => {
        it('should create pagination response', () => {
            const data = [{ id: 1 }, { id: 2 }]
            const page = 1
            const size = 10
            const total = 25
            const result = createPaginationResponse(data, page, size, total)

            expect(result.data).toEqual(data)
            expect(result.pagination.page).toBe(page)
            expect(result.pagination.size).toBe(size)
            expect(result.pagination.total).toBe(total)
            expect(result.pagination.totalPages).toBe(3) // Math.ceil(25/10)
        })
    })
})