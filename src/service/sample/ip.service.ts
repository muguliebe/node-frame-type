import axios from 'axios'
import ServiceProxy from '../../fwk/proxy/service.proxy'

export class IpService {
    async getIp(): Promise<string> {
        const ip = await axios.get('https://ifconfig.me')
        return ip.data
    }
}

export const serviceIp = new Proxy(new IpService(), ServiceProxy)
