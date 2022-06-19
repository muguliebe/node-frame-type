import axios from 'axios'
import ServiceProxy from '../../fwk/proxy/service.proxy'

export class IpService {
    async getIp(): Promise<string> {
        const ip = await axios.get('https://ifconfig.me')
        return ip.data as string
    }
}

export const serviceIp: IpService = new Proxy(new IpService(), ServiceProxy)
