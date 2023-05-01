import {IRouter, Router} from 'express'

export interface InitRouterOut {
    baseUrl?: string
    router: IRouter
}

export interface BatchInitOut {
    schedule: string
    task: () => void
    isUse: boolean
    router?: {
        baseUrl: string
        router: Router
    }
}
