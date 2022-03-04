import axios from 'axios'
import { serviceIp } from './sample/ip.service'
import ServiceProxy from '../fwk/proxy/service.proxy'

export class PingService {
    #msg = 'pong'

    constructor() {}

    async ping(): Promise<PingOut> {
        return { msg: this.#msg }
    }

    async getIp() {
        try {
            return await serviceIp.getIp()
        } catch (e) {
            log.error('request ifconfig.me err:', e)
        }
    }
}

interface PingOut {
    msg: string
}

export const servicePing = new Proxy(new PingService(), ServiceProxy)
