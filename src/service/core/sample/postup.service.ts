import service from '@/fwk/decorator/service.decorator'

@service
export default class PostupService {
    postUp() {
        log.debug('post up called')
    }
}

export const servicePostup = new PostupService()
