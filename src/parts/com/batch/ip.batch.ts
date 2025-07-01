import { Router } from 'express'
import { ipEvents } from '../subscriber/ip.event'
import { BaseRequest, BaseResponse } from '@/types/base'

// initialize
const router = Router()

/**
 * Default Func for Controller
 */
export const initBatch = () => {
    router.get('/', taskWrapper)

    return {
        schedule: '*/30 * * * *',
        task: task,
        isUse: true,
        router: {
            baseUrl: '/bat/ip',
            router: router,
        },
    }
}

/**
 * http 호출 받아 배치를 수행
 */
const taskWrapper = (req: BaseRequest, res: BaseResponse) => {
    if (res != null) res.json({ msg: 'ok' })
}

/**
 * 메인 작업
 */
const task = () => {
    try {
        const result = ipEvents.emit('update')
        log.debug(`ip.batch]: ${result}`)
    } catch (e) {
        log.error(`ip.batch] error occurred: ${e}`)
    }
}
