import {BaseRequest, BaseResponse} from '@/types/base'
import {servicePing} from '@/service/ping.service'

export const get = async (req: BaseRequest, res: BaseResponse) => {
    const result = await servicePing.ping()
    res.json(result)
}

export const post = async (req: BaseRequest, res: BaseResponse) => {
    const result = await servicePing.getIp()
    res.json(result)
}