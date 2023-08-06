export const ServiceProxy = {
    get(target, property, receiver) {
        if (typeof target[property] === 'function') {
            return async function (...args) {
                if (log.isSillyEnabled()) {
                    log.silly(`>>> ${target.constructor.name}.${property} start with ${args}`)
                } else {
                    log.debug(`>>> ${target.constructor.name}.${property} start`)
                }
                let result = await target[property].apply(target, args)
                if (log.isSillyEnabled()) {
                    log.silly(`<<< ${target.constructor.name}.${property} end: ${result}`)
                } else {
                    log.debug(`<<< ${target.constructor.name}.${property} end `)
                }
                return result
            }
        }
        return target[property]
    },
}

export default ServiceProxy
