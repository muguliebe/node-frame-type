import axios from 'axios'
import service from '@/fwk/decorator/service.decorator'

@service
export class IpService {
    async getIp(): Promise<string> {
        const ip = await axios.get('https://ifconfig.me')
        return ip.data as string
    }
}

export const serviceIp = new IpService()
