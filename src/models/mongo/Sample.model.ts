import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const sampleSchema = new mongoose.Schema(
    {
        day: String,
        time: String,
        name: String,
    },
    { timestamps: true }
)
sampleSchema.plugin(mongoosePaginate)

export default mongoose.model('sample', sampleSchema, 'sample')
