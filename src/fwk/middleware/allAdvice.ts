// noinspection DuplicatedCode

import { NextFunction, Request, Response } from 'express'
import Transaction from '../../models/mongo/Transaction.model'
import { Address4, Address6 } from 'ip-address'
import { v4 as uuidv4 } from 'uuid'
import CommonArea from '../../models/entity/commonArea'
import os, { hostname } from 'os'
import { format } from 'date-fns'
import { BaseRequest, BaseResponse } from '../../types/base'
import amqp from 'amqplib'
import limit from 'simple-rate-limiter'

let osHostname = os.hostname()

const allAdvice = (req: Request, res: Response, next: NextFunction) => {
    // init ============================================================================================================
    const ip = getIp(req)
    let logStart = `Start => [from ${ip}] ${req.method} ${req.url.substring(0, 40)}`
    log.info(logStart)

    const method = req.method
    const url = req.url
    const start = process.hrtime()

    // make commons ====================================================================================================
    setCommonAreaWhenStart(req, res, ip)

    // after ===========================================================================================================
    res.once('finish', () => {
        const durationInMilliseconds = getActualRequestDurationInMilliseconds(start)
        const endDate = new Date()

        // - calc human size
        let conLength = Number(res.getHeader('content-length')) | 0
        let readableConLength = calcHumanSize(conLength)

        let endLog =
            `End      [to   ${ip}] ${method} ${url.substring(0, 40)} ${res.statusCode}` +
            ` [${durationInMilliseconds.toLocaleString()} ms] [deliver ${readableConLength}]`

        log.info(endLog)

        // db save =========================================================================================================
        const mongoConnected = process.env['MONGO_CONNECTED']
        if (mongoConnected && mongoConnected === 'true') {
            saveTr(req, res, durationInMilliseconds.toLocaleString(), conLength)
                .then()
                .catch(e => log.error('saveTr error occurred:', e))
        }
        if (process.env.MQ_USE && process.env.MQ_USE === 'true') {
            pubQueueLimit(req, res, durationInMilliseconds.toLocaleString(), conLength)
        }
    })

    next()
}

const getActualRequestDurationInMilliseconds = (start: [number, number]) => {
    const NS_PER_SEC = 1e9 // convert to nanoseconds
    const NS_TO_MS = 1e6 // convert to milliseconds
    const diff = process.hrtime(start)
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

const getIp = (req: Request) => {
    let ip: string | string[] | Address4 | undefined
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for']
    } else {
        ip = new Address6(req.ip).address4
    }
    try {
        if (!ip) {
            ip = req.ip
            if (ip.toString() === '::1') {
                ip = '127.0.0.1'
            }
        } else {
            if (ip instanceof Address4) {
                ip = ip.address
            }
        }
    } catch (e) {
        log.error(`can't recognize ip. just set x.x.x.x`)
        ip = 'x.x.x.x'
    }
    return ip
}

function setCommonAreaWhenStart(req: BaseRequest, res: BaseResponse, ip: string | string[]) {
    const commons = new CommonArea()
    commons.gid = uuidv4()
    commons.startDate = new Date()
    commons.ip = ip.toString()
    commons.url = req.url

    req.commons = commons
    res.commons = commons
}

async function saveTr(req: BaseRequest, res: BaseResponse, responseTime: String, contentLength: Number) {
    log.silly('allAdvice] saveTr start')
    const tr = new Transaction()
    tr.day = format(req.commons?.startDate!, 'yyMMdd')
    tr.time = format(req.commons?.startDate!, 'HHmmss')
    tr.url = req.commons?.url
    tr.ip = req.commons?.ip
    tr.gid = req.commons?.gid
    tr.host = osHostname
    tr.responseTime = Number(responseTime)
    tr.status = Number(res.statusCode)
    tr.message = res.statusMessage
    tr.contentLength = Number(contentLength)

    await tr.save()
    log.silly('allAdvice] saveTr end')
}

const calcHumanSize = (size: number): string => {
    let sizeReadable: string = '0 bytes'
    if (size < 1024) {
        sizeReadable = size + ' bytes'
    } else if (size >= 1024 && size < 1024 * 1024) {
        sizeReadable = Number(size / 1024) + ' KBytes'
    } else if (size >= 1024 * 1024) {
        sizeReadable = Number(size / 1024 / 1024) + ' MB'
    }
    return sizeReadable
}

const exchange = 'topic.log'
let channel

async function setQueue() {
    const connection = await amqp.connect(process.env.MQ_URL)
    channel = await connection.createConfirmChannel()
    await channel.assertExchange(exchange, 'topic', { durable: true })
}

const pubQueueLimit = limit(pubQueue).to(100).per(1000)

async function pubQueue(req: BaseRequest, res: BaseResponse, responseTime: String, contentLength: Number) {
    const tr = {
        day: format(req.commons?.startDate!, 'yyMMdd'),
        time: format(req.commons?.startDate!, 'HHmmss'),
        url: req.commons?.url,
        ip: req.commons?.ip,
        gid: req.commons?.gid,
        host: osHostname,
        responseTime: responseTime,
        status: res.statusCode,
        message: res.statusMessage,
        contentLength: contentLength,
        date: new Date(),
    }

    if (!channel) await setQueue()
    await channel.sendToQueue(exchange, Buffer.from(JSON.stringify(tr)), { persistent: true })
}

export default allAdvice
