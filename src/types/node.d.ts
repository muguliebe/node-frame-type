declare namespace NodeJS {
    interface Process {}
    interface ProcessEnv {
        NODE_ENV: string
        MONGO_URL: string
        MONGO_CONNECTED: string
        MQ_USE: string
        MQ_URL: string
        IS_CLUSTER: string
    }
}
