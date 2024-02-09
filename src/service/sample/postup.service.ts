import ServiceProxy from '@/fwk/proxy/service.proxy'

export default class PostupService {
    postUp() {
        log.debug('post up called')
    }
}

export const servicePostup = new Proxy(new PostupService(), ServiceProxy)
