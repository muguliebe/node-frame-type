import { EventEmitter } from 'tsee'
import IpModels from '@/models/mongodb/Ip.models'
import DateUtils from '@/utils/DateUtils'
import { serviceIp } from '@/service/external/ip.service'

export const ipEvents = new EventEmitter<{
    update: (ip?: string) => void
}>()

ipEvents.on('update', async ip => {
    if (!ip) {
        ip = await serviceIp.getIp()
    }
    const modelIp = new IpModels()
    modelIp.day = DateUtils.currentDate()
    modelIp.time = DateUtils.currentTime()
    modelIp.ip = ip
    await modelIp.save()
})
