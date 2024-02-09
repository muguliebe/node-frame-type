import {serviceIp} from './sample/ip.service'
import ServiceProxy from '@/fwk/proxy/service.proxy'

export class PingService {
    #msg = 'pong'

    async ping(): Promise<PingOut> {
        return {msg: this.#msg};
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

export const servicePing: PingService = new Proxy(new PingService(), ServiceProxy)
