import { Document } from 'mongoose'

interface IPayment extends Document {
  _id?: string
  name: string
  email: string
  mobile: string
  memberId: number
  member: string
  membership: string
  yearref: string
  year: number
  expectedAmount: number
  paidAmount: number
  remainAmount: number
  dueDate: Date
  paidDate: Date
  isCorporate: boolean
  isPaid: boolean
  isOverdue: boolean
}

export default IPayment
