import {BaseRequest, BaseResponse} from '../../../../types/base'

export function get(req: BaseRequest, res: BaseResponse) {
    res.json({msg:'/users'})
}
