import mongoose, { Schema } from 'mongoose'
import UserInterface from './interface'

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, unique: true },
    mobile: { type: String },
    password: { type: String },
    accessLevel: { type: Number, default: 0 },
    salt: { type: String },
    avatar: { type: String },
    signature: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const User = mongoose.model<UserInterface>('User', UserSchema)

export default User
