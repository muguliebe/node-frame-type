import Sample, {ISample} from '../../models/mongo/Sample.model'
import ServiceProxy from '../../fwk/proxy/service.proxy'
import DateUtils from "../../utils/DateUtils";
import {Error} from "mongoose";

class SampleService {

    async save(inSave: SampleSaveIn): Promise<ISample> {
        const sample = new Sample()
        sample.day = DateUtils.currentDate()
        sample.time = DateUtils.currentTime()
        sample.name = inSave.name
        return await sample.save()
    }

    async put(inId: string, inName: string) {
        log.info(`sampleService] inId:${inId}, name:${inName}`)

        // validation
        if (!inId) {
            throw new Error(`inId is required`)
        }
        if (!inName) {
            throw new Error(`inName is required`)
        }

        // main
        const filter = {
            _id: inId
        }
        await Sample.findByIdAndUpdate(filter, {name: inName}, {
            upsert: false,
            rawResult: true
        })

        return Sample.findById(inId);
    }

    async getByName(input: InGetByName) {
        log.debug(`sampleService] getByName start`)

        const find: InGetByName = {}
        if (input.day) find.day = input.day || DateUtils.currentDate()
        if (input.time) find.time = input.time
        if (input.name) find.name = input.name

        const result = await Sample.find(find)
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

export const serviceSample: SampleService = new Proxy(new SampleService(), ServiceProxy)
