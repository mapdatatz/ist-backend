import mongoose, { Schema } from 'mongoose'
import IInstitute from './interface'

const InstituteSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: { type: String },
    region: { type: String },
    municipal: { type: String },
    ward: { type: String },
    street: { type: String },
    block: { type: String },
    plot: { type: String },
    website: { type: String },
    tollfree: { type: String },
    email: { type: String },
    mobile: { type: String },
    postal: { type: String },
    logo: { type: String },
    sign: { type: String },
  },
  { timestamps: true },
)

const Institute = mongoose.model<IInstitute>('institutes', InstituteSchema)

export default Institute
