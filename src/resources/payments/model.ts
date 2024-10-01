import mongoose, { Schema } from 'mongoose'
import IMember from './interface'

const PaymentSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    memberId: { type: Number },
    year: { type: Number },
    expectedAmount: { type: Number },
    paidAmount: { type: Number },
    remainAmount: { type: Number },
    paymentRef: { type: String },
    dueDate: { type: Date },
    paidDate: { type: Date },
    yearref: { type: Schema.Types.ObjectId, ref: 'years' },
    member: { type: Schema.Types.ObjectId, ref: 'members' },
    membership: { type: Schema.Types.ObjectId, ref: 'memberships' },
    isCorporate: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    isOverdue: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const Member = mongoose.model<IMember>('payments', PaymentSchema)

export default Member
