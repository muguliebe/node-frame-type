import {Router} from 'express'
import {InitRouterOut} from '@/fwk/base/Base'
import {BaseRequest, BaseResponse} from '@/types/base'
import {InGetByName, SampleSaveIn, serviceSample} from '@/service/sample/sample.service'
import AsyncWrapper from '@/lib/AsyncWrapper'

// initialize
const router = Router()

/**
 * Default Func for Controller
 */
export const initRouter = (): InitRouterOut => {
    const thisRouter = {
        baseUrl: '/sam',
        router: router,
    }

    router.get('/', AsyncWrapper(get))
    router.post('/', AsyncWrapper(post))
    router.put('/:id', AsyncWrapper(put))

    return thisRouter
}

const get = async (req: BaseRequest, res: BaseResponse) => {
    const inGetByName: InGetByName = {
        day: req.body.day,
        time: req.body.time,
        name: req.body.name,
        page: parseInt(req.query.page as string) || 1,
        size: parseInt(req.query.size as string) || 2
    }
    const result = await serviceSample.getByName(inGetByName)
    res.json(result)
}

const post = async (req: BaseRequest, res: BaseResponse) => {
    const inSave: SampleSaveIn = {
        name: req.body.name,
    }

    if (!inSave.name) {
        res.status(400).end()
    }

    const result = await serviceSample.save(inSave)
    log.debug(`sampleApi] result: ${result}`)
    res.status(200).end()
}

const put = async (req: BaseRequest, res: BaseResponse) => {

    if (!req.body.name) {
        log.error('sampleApi] name is required')
        res.status(400).end('wow')
    }
    const result = await serviceSample.put(req.params.id, req.body.name)
    log.debug(`sampleApi] result: ${result}`)
    res.status(200).end()
}

export default router
