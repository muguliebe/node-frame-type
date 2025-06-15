export interface DatabaseConfig {
    mongodb: {
        url: string
        connected: boolean
    }
    postgresql: {
        host: string
        port: number
        database: string
        user: string
        password: string
    }
}

export const getDatabaseConfig = (): DatabaseConfig => ({
    mongodb: {
        url: process.env.MONGO_URL || '',
        connected: process.env.MONGO_CONNECTED === 'true'
    },
    postgresql: {
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT || '5432'),
        database: process.env.PG_DATABASE || 'app',
        user: process.env.PG_USER || 'user',
        password: process.env.PG_PASSWORD || ''
    }
})