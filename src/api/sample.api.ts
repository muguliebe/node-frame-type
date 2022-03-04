import { Router, Request, Response } from 'express'
import { InitRouterOut } from '../fwk/base/Base'
import AsyncWrapper from '../lib/asyncWrapper'
import { BaseRequest, BaseResponse } from '../types/base'
import { serviceSample, SampleSaveIn, InGetByName } from '../service/sample/sample.service'

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
    router.get('/text', AsyncWrapper(text))
    router.post('/', AsyncWrapper(save))

    return thisRouter
}

const text = async (req: BaseRequest, res: BaseResponse) => {
    const result = await serviceSample.sample('')
    res.json(result)
}

const get = async (req: BaseRequest, res: BaseResponse) => {
    const inGetByName: InGetByName = {
        day: req.body.day,
        time: req.body.time,
        name: req.body.name,
    }
    const result = await serviceSample.getByName(inGetByName)
    res.json(result)
}

const save = async (req: BaseRequest, res: BaseResponse) => {
    const inSave: SampleSaveIn = {
        name: req.body.name,
    }

    if (!inSave.name) {
        res.status(400).end()
    }

    await serviceSample.save(inSave)
    res.status(200).end()
}

export default this
