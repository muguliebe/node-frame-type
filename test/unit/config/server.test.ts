import {getServerConfig} from '@/config/server'

describe('Server Config', () => {
    const originalEnv = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...originalEnv }
    })

    afterAll(() => {
        process.env = originalEnv
    })

    it('should return default server config', () => {
        const config = getServerConfig()

        expect(config.port).toBe(3000)
        expect(config.environment).toBeDefined()
        expect(config.logLevel).toBe('info')
        expect(config.logDir).toBe('./log')
        expect(config.isCluster).toBe(false)
        expect(config.mqUse).toBe(false)
    })

    it('should use environment variables when provided', () => {
        process.env.PORT = '8080'
        process.env.NODE_ENV = 'production'
        process.env.LOG_LEVEL = 'debug'
        process.env.LOG_DIR = '/var/log'
        process.env.IS_CLUSTER = 'true'
        process.env.MQ_USE = 'true'

        const config = getServerConfig()

        expect(config.port).toBe(8080)
        expect(config.environment).toBe('production')
        expect(config.logLevel).toBe('debug')
        expect(config.logDir).toBe('/var/log')
        expect(config.isCluster).toBe(true)
        expect(config.mqUse).toBe(true)
    })
})