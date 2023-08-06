import {NextFunction, Request, RequestHandler, Response} from 'express'

declare function AsyncWrapper(
    func: (req: Request, res: Response, next?: NextFunction) => Promise<Response | void>
): RequestHandler

export = AsyncWrapper
