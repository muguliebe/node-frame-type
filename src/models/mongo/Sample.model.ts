import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface ISample {
    day: string;
    time: string;
    name: string;
}

const sampleSchema = new mongoose.Schema<ISample>(
    {
        day: String,
        time: String,
        name: String,
    },
    {timestamps: true}
)
sampleSchema.plugin(mongoosePaginate)

const Sample: mongoose.Model<ISample> = mongoose.model<ISample>('sample', sampleSchema)
export default Sample
