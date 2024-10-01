import mongoose, { Schema } from 'mongoose'
import IYear from './interface'

const YearSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    expectedAmount: { type: Number },
    paidAmount: { type: Number },
    debtAmount: { type: Number },
  },
  { timestamps: true },
)

const Year = mongoose.model<IYear>('years', YearSchema)

export default Year
