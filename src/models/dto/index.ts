// Data Transfer Objects
export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    timestamp: string
}

export interface PaginationRequest {
    page: number
    size: number
}

export interface PaginationResponse<T> {
    data: T[]
    pagination: {
        page: number
        size: number
        total: number
        totalPages: number
    }
}

// Re-export all DTOs from parts for convenience
export * from '../../parts/user/dto/user.dto'
export * from '../../parts/sample/dto/sample.dto'
export * from '../../parts/com/dto/ping.dto'
export * from '../../parts/com/dto/common.dto'
export * from '../../parts/health/dto/health.dto'
