import { Request, Response } from 'express'
import CommonArea from '../../models/entity/commonArea'

export interface BaseRequest extends Request {
    gid?: string
    commons?: CommonArea
}
export interface BaseResponse extends Response {
    gid?: string
    commons?: CommonArea
}
