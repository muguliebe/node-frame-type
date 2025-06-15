import {BatchInitOut} from '@/fwk/base/Base'
import {serviceSample} from '@/service/core/sample/sample.service'

// initialize

/**
 * Default Func for Controller
 */
export const initBatch = (): BatchInitOut => {
    return {
        schedule: '*/5 * * * *', // 5 min
        task: task,
        isUse: true,
    }
}

/**
 * 메인 작업
 */
const task = async () => {
    log.debug(`sample.batch] start`)

    try {
        await serviceSample.save({
            name: 'what',
        })
    } catch (e) {
        log.error(`sample.batch] error occurred: ${e}`)
    }
    log.debug(`sample.batch] end`)
}
