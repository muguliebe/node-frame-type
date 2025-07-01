function service<T extends { new (...args: any[]): {} }>(constructor: T) {
    const instance = new constructor()
    const className = constructor.name

    Object.getOwnPropertyNames(constructor.prototype)
        .filter(prop => typeof constructor.prototype[prop] === 'function' && prop !== 'constructor')
        .forEach(method => {
            const originalMethod = constructor.prototype[method]

            // Modify the method to add logging
            constructor.prototype[method] = function (...args: any[]) {
                log.debug(`>>> ${className}.${method} start with ${JSON.stringify(args)}`)
                const result = originalMethod.apply(this, args)
                log.debug(`<<< ${className}.${method} end: ${result}`)
                return result
            }
        })

    return class extends constructor {
        constructor(...args: any[]) {
            super(...args)
            return instance
        }
    }
}

export default service
