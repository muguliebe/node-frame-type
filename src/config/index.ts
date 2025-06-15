export * from './database'
export * from './server'

import {getDatabaseConfig} from './database'
import {getServerConfig} from './server'

export const config = {
    database: getDatabaseConfig(),
    server: getServerConfig()
}