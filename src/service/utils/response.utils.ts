import {ApiResponse} from '@/models/dto'

export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
})

export const createErrorResponse = (message: string): ApiResponse => ({
    success: false,
    message,
    timestamp: new Date().toISOString()
})

export const createPaginationResponse = <T>(
    data: T[],
    page: number,
    size: number,
    total: number
) => ({
    data,
    pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size)
    }
})