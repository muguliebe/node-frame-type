/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-var-requires */
import Express from 'express'
import Static from '../lib/static'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import path from 'path'
import {getAllFiles} from '../utils/zutils'
import allAdvice from './middleware/allAdvice'
import mongoose, {ConnectOptions} from 'mongoose'
import errorMiddleware from './middleware/error.middleware'
import notFoundErrorMiddleware from './middleware/not-found-error.middleware'
import readReadSync from 'recursive-readdir-sync'
import schedule from 'node-schedule'
import {BatchInitOut, InitRouterOut} from './base/Base'
import cluster from 'cluster'

export interface ServerConfigIn {
    app: Express.Application
    port: number
    apiPath: string
    batchPath: string
    mqPath: string
    basePath: string
}

export default class ServerConfig {
    app: Express.Application
    port: number

    constructor({app, port = 3000, apiPath, batchPath, mqPath, basePath}: ServerConfigIn) {
        this.app = app
        this.setDefault()
        this.setMiddleware()
        log.debug(`set port:${port}`)
        this.port = port

        this.setMongo()
            .then(() => log.debug('mongo init ok'))
            .catch(e => log.error('mongo init err occurred:', e))

        try {
            this.bindController(apiPath, basePath)
            if (process.env.NODE_ENV !== 'test') {
                if (cluster.worker?.id === 1 || process.env['IS_CLUSTER'] === 'false' || process.env['IS_CLUSTER'] === undefined) {
                    this.bindBatch(batchPath)
                }
                if( process.env.MQ_USE == 'true' ) {
                    this.bindSubscribeMq(mqPath)
                }
            }
        } catch (e) {
            throw new Error(`bind error occurred: ${e}`)
        }

        this.errorHandler()
    }

    private setDefault() {
        this.app.use(cors())
        this.app.set('env', Static.NODE_ENV)
        this.app.set('port', this.port)
        this.app.use(bodyParser.urlencoded({extended: false}))
        this.app.use(bodyParser.json())
        this.app.use(helmet())
    }

    private setMiddleware() {
        this.app.use(allAdvice)
    }

    async setMongo() {
        if (process.env.MONGO_URL) {
            await ServerConfig.setMongo()
            process.env.MONGO_CONNECTED = 'true'
        } else {
            log.info(`there is no 'MONGO_URL' in env`)
            process.env.MONGO_CONNECTED = 'false'
        }
    }

    listen() {
        try {
            this.app.listen(this.port, () => {
                log.info('==========================================================================')
                log.info(`PID               : ${process.pid}`)
                log.info(`Cluster ID        : ${cluster.worker?.id}`)
                log.info('environment       : ' + Static.NODE_ENV)
                log.info(`LOG Level         : ${process.env.LOG_LEVEL}`)
                log.info(`Listening on port : ${this.port}`)
                log.info(`secure env check  : ${!!process.env['isSecureEnv']}`)
                // log.info(`uptime            : ${DateUtils.diffSeconds(DateUtils.getUptime())}`)
                log.info('==========================================================================')
            })
        } catch (error) {
            log.error(`listen error: ${error}`)
        }
    }

    private bindController(controllerPath: string, basePath: string) {
        const controllers = path.join(controllerPath)
        log.debug(`>>>>> controller bind start at ${controllers} <<<<<`)

        getAllFiles(controllers)
            .filter(file => file.split('.').pop() === 'ts')
            .forEach(file => {
                try {
                    log.debug(`route bind: ${file}`)

                    // get path from physical file path
                    const relativePath = file.replace(basePath, '')
                    const routeApi = relativePath.split('.')[0]
                    let route = routeApi.replace('/api', '')

                    // get from exported router
                    const router = require(file).initRouter() as InitRouterOut
                    route = router?.baseUrl || route
                    this.app.use(route, router.router)
                } catch (err) {
                    throw new Error(`bind err:${file}:${err}`)
                }
            })
    }

    private bindBatch(batchPath: string) {
        const controllers = path.join(batchPath)
        log.info(`>>>>> batch bind start at ${batchPath} <<<<<`)

        readReadSync(controllers)
            .filter((file: string) => file.split('.').pop() === 'ts')
            .forEach((file: string) => {
                try {
                    const batch = require(file).initBatch() as BatchInitOut
                    log.info(`batch bind: ${file}, isUse: ${batch.isUse}`)
                    if (batch.isUse) {
                        schedule.scheduleJob(batch.schedule, batch.task)
                        if (batch.router) {
                            this.app.use(batch.router.baseUrl, batch.router.router)
                        }
                        log.info(`schedule register: ${file}`)
                    }
                } catch (err) {
                    throw new Error(`${file}:${err}`)
                }
            })
    }

    private bindSubscribeMq(mqPath: string) {
        const controllers = path.join(mqPath)
        log.info(`>>>>> mq bind start at ${mqPath} <<<<<`)

        readReadSync(controllers)
            .filter((file: string) => file.split('.').pop() === 'ts')
            .forEach((file: string) => {
                try {
                    require(file).initQueue()
                    log.info(`consumer bind: ${file}`)
                } catch (err) {
                    throw new Error(`${file}:${err}`)
                }
            })
    }

    private static async setMongo() {
        const option = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
        if (process.env.NODE_ENV === 'test') {
            option.useUnifiedTopology = false
        }
        try {
            if (!process.env.MONGO_URL) {
                throw Error('MONGO_URL is not a defined')
            }
            const uri: string = process.env.MONGO_URL
            await mongoose.connect(uri, option as ConnectOptions)
            log.debug('mongo connected')
        } catch (e) {
            log.error(`mongo connect fail:${e}`)
            throw e
        }
    }

    private errorHandler() {
        // 404 handler
        this.app.use(notFoundErrorMiddleware)

        // 500 handler
        this.app.use(errorMiddleware)
    }
}
