import { BatchInitOut } from '@/fwk/base/Base'
// import { serviceSample } from '@/service/core/sample/sample.service' // TODO: 서비스 구현 필요

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
        // TODO: sample service 구현 후 활성화
        // await serviceSample.save({
        //     name: 'what',
        // })
        log.debug('sample batch executed')
    } catch (e) {
        log.error(`sample.batch] error occurred: ${e}`)
    }
    log.debug(`sample.batch] end`)
}
