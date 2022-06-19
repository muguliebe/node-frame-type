import {BatchInitOut} from '../fwk/base/Base'
import {serviceSample} from '../service/sample/sample.service'

// initialize

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
    log.debug(`sample.batch`)
    await serviceSample.save({
        name: 'what',
    })
}
