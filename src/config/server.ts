export interface ServerConfig {
    port: number
    environment: string
    logLevel: string
    logDir: string
    isCluster: boolean
    mqUse: boolean
}

export const getServerConfig = (): ServerConfig => ({
    port: parseInt(process.env.PORT || '3000'),
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    logDir: process.env.LOG_DIR || './log',
    isCluster: process.env.IS_CLUSTER === 'true',
    mqUse: process.env.MQ_USE === 'true',
})
