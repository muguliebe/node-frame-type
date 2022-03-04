import { Router } from 'express'
import AsyncWrapper from '../lib/asyncWrapper'
import { EventEmitter } from 'tsee'
import { ipEvents } from '../subscriber/event/ip.event'
import { BaseRequest, BaseResponse } from '../types/base'

// initialize
const router = Router()

/**
 * Default Func for Controller
 */
export const initBatch = () => {
    router.get('/', AsyncWrapper(taskWrapper))

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
const taskWrapper = async (req: BaseRequest, res: BaseResponse) => {
    const result = task()
    if (res != null) res.json({ msg: result })
}

/**
 * 메인 작업
 */
const task = async () => {
    ipEvents.emit('update')
}
