import * as winston from 'winston'

declare global {
    type Log = winston.Logger
    const log: Log

    namespace NodeJS {
        interface Global {
            log: Log
        }
    }
}

export const setDefaultLogger = (logger: winston.Logger) => ((global as any).log = logger)
