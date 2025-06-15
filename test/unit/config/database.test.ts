import {getDatabaseConfig} from '@/config/database'

describe('Database Config', () => {
    const originalEnv = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...originalEnv }
    })

    afterAll(() => {
        process.env = originalEnv
    })

    it('should return default database config', () => {
        const config = getDatabaseConfig()

        expect(config.mongodb).toHaveProperty('url')
        expect(config.mongodb).toHaveProperty('connected')
        expect(config.postgresql).toHaveProperty('host')
        expect(config.postgresql).toHaveProperty('port')
        expect(config.postgresql).toHaveProperty('database')
        expect(config.postgresql).toHaveProperty('user')
    })

    it('should use environment variables when provided', () => {
        process.env.MONGO_URL = 'mongodb://test:test@localhost:27017/test'
        process.env.MONGO_CONNECTED = 'true'
        process.env.PG_HOST = 'test.example.com'
        process.env.PG_PORT = '5433'
        process.env.PG_DATABASE = 'testdb'
        process.env.PG_USER = 'testuser'
        process.env.PG_PASSWORD = 'testpass'

        const config = getDatabaseConfig()

        expect(config.mongodb.url).toBe('mongodb://test:test@localhost:27017/test')
        expect(config.mongodb.connected).toBe(true)
        expect(config.postgresql.host).toBe('test.example.com')
        expect(config.postgresql.port).toBe(5433)
        expect(config.postgresql.database).toBe('testdb')
        expect(config.postgresql.user).toBe('testuser')
        expect(config.postgresql.password).toBe('testpass')
    })
})