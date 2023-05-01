import ServerConfig, {ServerConfigIn} from './fwk/server.config'
import * as winston from 'winston'
import * as logging from './lib/logger'
import winstonDaily from 'winston-daily-rotate-file'
import Static from './lib/static'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import EventEmitter from 'events'
import Express from 'express'
import {servicePostup} from './service/sample/postup.service'
import cluster from 'cluster'
import os from 'os'

const emitter = new EventEmitter()
const totCpu = os.cpus().length
const app = Express()
let server: ServerConfig | undefined

export async function main() {
    const mainStart = process.hrtime()
    // environment -----------------------------------------------------------------------------------------------------
    const env = Static.NODE_ENV
    if (env.match('dev|test|stg|stg_bat|prd|prd-bat') === null) {
        throw new Error(`env(${env}) not matches in dev|test|stg|stg_bat|prd|prd-bat`)
    }
    // config.default.env 로드 후 => 환경별 env 파일 로드 하여 덮어씌우기
    dotenv.config({path: path.join(__dirname, `./config/config.default.env`)})
    if (fs.existsSync(path.join(__dirname, `./config/config.${env}.env`))) {
        const envConfig = dotenv.parse(fs.readFileSync(path.join(__dirname, `./config/config.${env}.env`)))
        for (const key in envConfig) {
            process.env[key] = envConfig[key]
        }
    }

    // secure 로드
    const envPlus = [env, 'default']
    let bExistSecure = false

    for (const ep of envPlus) {
        if (fs.existsSync(path.join(__dirname, `./config/secure/config.${ep}.env`))) {
            const envSecureConfig = dotenv.parse(
                fs.readFileSync(path.join(__dirname, `./config/secure/config.${ep}.env`))
            )
            for (const key in envSecureConfig) {
                process.env[key] = envSecureConfig[key]
            }
        }
        bExistSecure = true
    }
    if (!bExistSecure) {
        process.env['isSecureEnv'] = 'false'
        console.error('there is no secure env => must have secure env file for DB Connect at ./config/secure/..')
    }

    // winston ---------------------------------------------------------------------------------------------------------
    const logLevel = process.env.LOG_LEVEL
    // console.log(`log level set to ${logLevel}`)
    logging.setDefaultLogger(
        winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYMMDD:HHmmss.SSS',
                }),
                winston.format.printf(info => {
                    const logLevel = info.level.padEnd(5, ' ')
                    return `[${info.timestamp}:${logLevel}] ${info.message}`
                    // return `[${chalk.cyan(info.timestamp)}:${logLevel}] ${info.message}`
                })
            ),
            transports: [
                new winston.transports.Console({
                    level: logLevel,
                }),
                new winstonDaily({
                    level: logLevel,
                    datePattern: 'YYYYMMDD',
                    dirname: process.env.LOG_DIR || './log',
                    filename: `%DATE%.log`,
                    maxFiles: 30,
                    zippedArchive: true,
                }),
            ],
        })
    )

    // run server ------------------------------------------------------------------------------------------------------
    server = new ServerConfig(<ServerConfigIn>{
        app: app,
        apiPath: path.join(__dirname, './api'),
        batchPath: path.join(__dirname, './batch'),
        mqPath: path.join(__dirname, './subscriber/mq'),
        port: process.env.PORT || 3000,
        basePath: __dirname
    })
    if (process.env.NODE_ENV !== 'test') {
        await server.listen()
    }
    const mainEnd = process.hrtime(mainStart)
    log.debug(`main end: ${(mainEnd[0] * 1e9 + mainEnd[1]) / 1e9} sec`)

    emitter.emit('post')
    return server.app
}

emitter.on('post', async () => {
    log.silly('post event')
    servicePostup.postUp()
})

if (process.env['IS_CLUSTER'] === 'true') {
    if (cluster.isPrimary) {
        console.log(`Number of CPUs: ${totCpu}`)
        console.log(`Master pid: ${process.pid}`)

        for (let i = 0; i < totCpu; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`)
            cluster.fork()
        })
    } else {
        main().catch(e => {
            log.error(`error occurred at main() ${e}`)
            throw e
        })
    }
} else {
    main().catch(e => {
        log.error(`error occurred at main() ${e}`)
        throw e
    })
}

export default app
