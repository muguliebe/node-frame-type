import { serviceIp } from './ip.service'
import service from '@/fwk/decorator/service.decorator'

@service
export class PingService {
    #msg = 'pong'

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

// export const servicePing: PingService = new Proxy(new PingService(), ServiceProxy)
export const servicePing = new PingService()
