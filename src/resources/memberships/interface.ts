import { Document } from 'mongoose'

interface IMembership extends Document {
  _id?: string
  category: string
  fee: number
}

export default IMembership
