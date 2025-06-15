import {BaseRequest, BaseResponse} from '@/types/base'

export const get = async (req: BaseRequest, res: BaseResponse) => {
    res.json({
        message: 'API Root',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    })
}
