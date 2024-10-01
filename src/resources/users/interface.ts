import { Document } from 'mongoose'

interface IUser extends Document {
  name: string,
  email: string,
  mobile: string,
  password?: string,
  salt?: string,
  avatar?: string,
  signature?: string,
  isVerified?: boolean,
  isActive: boolean,
  isAdmin: boolean,
  accessLevel: number
}

export default IUser
