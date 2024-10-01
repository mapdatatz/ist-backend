import { Document } from 'mongoose'

interface IYear extends Document {
  _id?: string
  year: number
  expectedAmount: number
  paidAmount: number
  debtAmount: number
}

export default IYear
