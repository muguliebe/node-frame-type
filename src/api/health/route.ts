import {BaseRequest, BaseResponse} from '@/types/base'
import {servicePing} from '@/service/core/ping.service'

export const get = async (req: BaseRequest, res: BaseResponse) => {
    const pingResult = await servicePing.ping()
    
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        services: {
            ping: pingResult,
            mongodb: process.env.MONGO_CONNECTED === 'true',
            postgresql: !!process.env.PG_HOST
        }
    })
}