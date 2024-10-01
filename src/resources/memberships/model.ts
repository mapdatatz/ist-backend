import mongoose, { Schema } from 'mongoose'
import IMembership from './interface'

const MembershipSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    fee: { type: Number },
  },
  { timestamps: true },
)

const Membership = mongoose.model<IMembership>('memberships', MembershipSchema)

export default Membership
