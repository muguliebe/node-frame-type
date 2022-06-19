import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const transactionSchema = new mongoose.Schema(
    {
        day: String,
        time: String,
        app: String,
        method: String,
        url: String,
        env: String,
        ip: String,
        host: String,
        responseTime: Number,
        status: String,
        message: String,
        contentLength: Number,
        gid: String,
    },
    {timestamps: true}
)
transactionSchema.plugin(mongoosePaginate)

export default mongoose.model('transaction', transactionSchema, 'transaction')
