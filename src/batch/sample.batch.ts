import { Router } from 'express'
import AsyncWrapper from '../lib/asyncWrapper'
import { EventEmitter } from 'tsee'
import { BaseRequest, BaseResponse } from '../types/base'
import { BatchInitOut } from '../fwk/base/Base'
import { IpService } from '../service/sample/ip.service'
import { serviceSample } from '../service/sample/sample.service'

// initialize
const router = Router()

/**
 * Default Func for Controller
 */
export const initBatch = (): BatchInitOut => {
    return {
        schedule: '*/5 * * * *',
        task: task,
        isUse: true,
    }
}

/**
 * 메인 작업
 */
const task = async () => {
    serviceSample.sample('wow')
    await serviceSample.save({
        name: 'what',
    })
}
