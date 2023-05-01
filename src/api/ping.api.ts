import {Request, Response, Router} from 'express'
import {InitRouterOut} from '../fwk/base/Base'
import AsyncWrapper from '../lib/asyncWrapper'
import {BaseRequest, BaseResponse} from '../types/base'
import {ipEvents} from '../subscriber/event/ip.event'
import {servicePing} from '../service/ping.service'
import cluster from 'cluster'

// initialize
const router = Router()

/**
 * Default Func for Controller
 */
export const initRouter = (): InitRouterOut => {
    const thisRouter = {
        router: router,
    }

    router.get('/', AsyncWrapper(ping))
    router.get('/ip', AsyncWrapper(ip))

    return thisRouter
}

const ping = async (req: BaseRequest, res: BaseResponse) => {
    log.debug(`gid: ${req.commons?.gid}, cluster:${cluster.worker?.id}`)

    const result = await servicePing.ping()
    res.json(result)
}
const ip = async (req: Request, res: Response) => {
    const result = await servicePing.getIp()
    ipEvents.emit('update', result)
    res.json(result)
}
