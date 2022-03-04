import Sample from '../../models/mongo/Sample.model'
import { format } from 'date-fns'
import ServiceProxy from '../../fwk/proxy/service.proxy'
import { DecorateAll } from 'decorate-all'
import Test from '../../fwk/decorator/test.decorator'

class SampleService {
    constructor() {}

    async sample(a: string) {
        return 'good job'
    }

    async save(inSave: SampleSaveIn) {
        const now = new Date()
        const sample = new Sample()
        sample.day = format(now, 'yyMMdd')
        sample.time = format(now, 'HHmmss')
        sample.name = inSave.name

        return await sample.save()
    }

    async getByName(input: InGetByName) {
        log.debug(`sampleService] getByName start`)

        const find: InGetByName = {}
        if (input.day) find.day = input.day
        if (input.time) find.time = input.time
        if (input.name) find.name = input.name

        const result = await Sample.find().or([find])
        log.debug(result)
        log.debug(`sampleService] getByName end`)
        return result
    }
}

export interface SampleSaveIn {
    name: string
}

export interface InGetByName {
    day?: string
    time?: string
    name?: string
}

export const serviceSample = new Proxy(new SampleService(), ServiceProxy)
