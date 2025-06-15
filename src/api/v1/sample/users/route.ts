import {BaseRequest, BaseResponse} from '@/types/base'

export function get(req: BaseRequest, res: BaseResponse) {
    const key = req.query.key
    if(key === 'error')
        res.status(500).send('key is error')
    res.json({msg:'/users'})
}
