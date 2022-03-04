import Express, { Request, Response, NextFunction } from 'express'
import http from 'http'
import Static from '../lib/static'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import path from 'path'
import { getAllFiles } from '../utils/zutils'
import allAdvice from './middleware/allAdvice'
import mongoose, { ConnectOptions } from 'mongoose'
import { BaseRequest, BaseResponse } from '../types/base'
import errorMiddleware from './middleware/error.middleware'
import notFoundErrorMiddleware from './middleware/not-found-error.middleware'
import readReadSync from 'recursive-readdir-sync'
import schedule from 'node-schedule'
import { InitRouterOut, BatchInitOut } from './base/Base'

export interface ServerConfigIn {
    app: Express.Application
    port: number
    apiPath: string
    batchPath: string
    mqPath: string
}

export default class ServerConfig {
    app: Express.Application
    port: number = 3000

    constructor({ app, port, apiPath, batchPath, mqPath }: ServerConfigIn) {
        this.app = app
        this.setDefault()
        this.setMiddleware()

        this.setMongo()
            .then(r => log.debug('mongo init ok'))
            .catch(e => log.error('mongo init err occurred:', e))

        try {
            this.bindController(apiPath)
            if (process.env.NODE_ENV !== 'test') {
                this.bindBatch(batchPath)
                this.bindSubscribeMq(mqPath)
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
        this.app.use(bodyParser.urlencoded({ extended: false }))
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

    async listen() {
        try {
            await this.app.listen(this.port, () => {
                log.info('==========================================================================')
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

    private bindController(controllerPath: string) {
        const controllers = path.join(controllerPath)
        log.debug(`controller bind start at ${controllerPath}`)

        getAllFiles(controllerPath)
            .filter(file => file.split('.').pop() === 'ts')
            .forEach(file => {
                try {
                    log.debug(`route bind: ${file}`)
                    const router = require(file).initRouter() as InitRouterOut
                    this.app.use(router.baseUrl, router.router)
                } catch (err) {
                    throw new Error(`bind err:${file}:${err}`)
                }
            })
    }

    private bindBatch(batchPath: string) {
        const controllers = path.join(batchPath)
        log.info(`>>>>> batch bind start at ${batchPath}`)

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
        log.info(`>>>>> mq bind start at ${mqPath}`)

        readReadSync(controllers)
            .filter((file: string) => file.split('.').pop() === 'ts')
            .forEach((file: string) => {
                try {
                    const consumer = require(file).initQueue()
                    log.info(`consumer bind: ${file}`)
                } catch (err) {
                    throw new Error(`${file}:${err}`)
                }
            })
    }

    private static async setMongo() {
        let option = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
        if (process.env.NODE_ENV === 'test') {
            option.useUnifiedTopology = false
        }
        try {
            const uri: string = process.env.MONGO_URL!
            await mongoose.connect(uri, option as ConnectOptions)
            log.debug('mongo connected')
        } catch (e) {
            log.error('mongo connect fail' + e)
        }
    }

    async closeMongo() {}

    private errorHandler() {
        // 404 handler
        this.app.use(notFoundErrorMiddleware)

        // 500 handler
        this.app.use(errorMiddleware)
    }
}
