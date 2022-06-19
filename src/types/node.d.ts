declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string
        MONGO_URL: string
        MONGO_CONNECTED: string
        MQ_USE: string
        MQ_URL: string
        APP_NAME: string
    }
}
