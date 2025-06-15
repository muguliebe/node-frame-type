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

export interface HealthCheckResponse {
    status: 'OK' | 'ERROR'
    timestamp: string
    uptime: number
    version: string
    environment: string
    services: {
        ping: any
        mongodb: boolean
        postgresql: boolean
    }
}