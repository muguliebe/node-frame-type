import {NextFunction, Request, Response} from 'express'

function notFoundErrorMiddleware(request: Request, response: Response, next: NextFunction) {
    const status = 404
    const message = 'Not Found'
    response.status(status).send({
        status,
        message,
    })
}

export default notFoundErrorMiddleware
