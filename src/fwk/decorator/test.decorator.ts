import { copyMetadata } from 'decorate-all/src/lib/copy-metadata'

function Test<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    return (target: any) => {
        let descriptors = Object.getOwnPropertyDescriptors(target.prototype)
        let base = Object.getPrototypeOf(target)
        while (base.prototype) {
            const baseDescriptors = Object.getOwnPropertyDescriptors(base.prototype)
            descriptors = { ...baseDescriptors, ...descriptors }
            base = Object.getPrototypeOf(base)
            console.log(base)
        }

        for (const [propName, descriptor] of Object.entries(descriptors)) {
            const isMethod = typeof descriptor.value == 'function' && propName != 'constructor'
            if (!isMethod) continue
            const originalMethod = descriptor.value
            // if (originalMethod != descriptor.value) {
            //     copyMetadata(originalMethod, descriptor.value)
            // }
            Object.defineProperty(target.prototype, propName, descriptor)
        }
    }
}

export default Test
