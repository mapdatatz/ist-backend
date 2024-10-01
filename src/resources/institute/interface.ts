import { Document } from 'mongoose'

interface IInstitute extends Document {
  _id?: string
  name: string
  country: string
  region: string
  municipal: number
  ward: string
  street: string
  block: string
  plot: string
  website: string
  tollfree: string
  email: string
  mobile: string
  postal: string
  logo: string
  sign: string
}

export default IInstitute
