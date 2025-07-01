export interface HealthResponse {
    status: 'OK' | 'ERROR'
    timestamp: string
    uptime: number
    version: string
    environment: string
    services: {
        ping: {
            msg: string
        }
        mongodb: boolean
        postgresql: boolean
    }
}