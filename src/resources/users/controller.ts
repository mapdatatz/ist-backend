import { Request, Response, NextFunction } from 'express'
import xlsx from 'xlsx'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from './model'
import Institute from '../institute/model'
import { JWT_SECRET_KEY, JWT_EXPIRES_IN } from '../../config'
import IUser from './interface'
import mongoose from 'mongoose'

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    const users = await User.find().skip(skip).limit(limit)
    const total = await User.countDocuments()
    res.status(200).json({ records: users, total })
  } catch (error) {
    next(error)
  }
}

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, mobile, accessLevel, email, password } = req.body
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'Sorry, Email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      mobile,
      accessLevel,
      password: hashedPassword,
    })

    const userData = {
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      accessLevel: user.accessLevel,
      isActive: user.isActive,
      isVerified: user.isVerified,
    }

    res.status(200).json({ user: userData })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, mobile, accessLevel, email, isActive, isAdmin } = req.body
    const exists = await User.findOne({ email })
    if (exists && exists._id != id) {
      return res.status(400).json({ message: 'Sorry, Email already exists.' })
    }

    const user = await User.findByIdAndUpdate(id, {
      name,
      email,
      mobile,
      isActive,
      isAdmin,
      accessLevel,
    })

    const userData = {
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      accessLevel: user.accessLevel,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    }

    res.status(200).json({ user: userData })
  } catch (error) {
    next(error)
  }
}

const uploadUsers = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.')
    }

    let pass: any = []
    let passCount: number = 0
    let fail: any = []
    let failCount: number = 0

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' })

    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const rows: any = xlsx.utils.sheet_to_json(worksheet)

    for (let row of rows) {
      try {
        let existingUser = await User.findOne({ email: row.EMAIL })

        if (existingUser) {
          // Update existing user
          existingUser.name = row.NAME
          existingUser.mobile = row.MOBILE
          await existingUser.save()
          pass.push(row.EMAIL)
          passCount++
        } else {
          // Create new user if not found
          const newUser: IUser = new User({
            name: row.NAME,
            email: row.EMAIL,
            mobile: row.MOBILE,
            isActive: true,
            isAdmin: false,
            isEnrolled: false,
            accessLevel: 0,
          })
          await newUser.save()
          pass.push(row.EMAIL)
          passCount++
        }
      } catch (error) {
        fail.push(row.EMAIL)
        failCount++
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).send({ message: `Validation Error: ${error.message}` })
        } else if (error.code === 11000) {
          return res.status(409).send({ message: `Email ${row.EMAIL} already exists.` })
        } else {
          throw error
        }
      }
    }

    res.status(200).send({ message: 'File uploaded successfully.', data: { pass, passCount, fail, failCount } })
  } catch (error) {
    next(error)
  }
}

const exportUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find()
    res.status(200).send(users)
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { password } = req.body
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({ message: 'Sorry, User does not exist.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const updated = await User.findByIdAndUpdate(id, {
      password: hashedPassword,
    })

    const userData = {
      name: updated.name,
      email: updated.email,
      mobile: updated.mobile || '',
      accessLevel: updated.accessLevel,
      isActive: updated.isActive,
      isVerified: updated.isVerified,
    }

    res.status(200).json({ user: userData })
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, mobile, email } = req.body
    const user = await User.findOne({ email })
    if (user && user?._id === id) {
      return res.status(400).json({ message: 'Sorry, Email already exists.' })
    }
    const updated = await User.findByIdAndUpdate(
      id,
      {
        name,
        mobile,
        email,
      },
      { new: true },
    )

    const userData = {
      id: updated?._id,
      name: updated.name,
      email: updated.email,
      mobile: updated.mobile || '',
      accessLevel: updated.accessLevel,
      isActive: updated.isActive,
      isVerified: updated.isVerified,
    }

    res.status(200).json({ user: userData })
  } catch (error) {
    next(error)
  }
}

const initUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hashedPassword = await bcrypt.hash('admin@IST2025', 10)
    const exists = await User.findOne({ email: 'istsurveyors@gmail.com' })
    if (exists) return
    const user = await User.create({
      name: 'Super Admin',
      email: 'istsurveyors@gmail.com',
      mobile: '+255713039313',
      password: hashedPassword,
      accessLevel: 9,
      isAdmin: true,
      isVerified: true,
    })

    await Institute.create({
      name: 'Institution of Surveyors of Tanzania',
      country: 'Tanzania',
      region: 'Dar es salaam',
      municipal: 'Kinondoni',
      ward: 'Sinza A',
      plot: '853',
      email: 'info@ist.com',
      mobile: '+255755054521',
      postal: '78494',
      website: "https://ist.co.tz"
    })
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const token = jwt.sign({ name: user.name, userId: user?._id, email }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN })

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      accessLevel: user.accessLevel,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    }

    res.status(200).json({ user: userData, token })
  } catch (error) {
    next(error)
  }
}

const getCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await User.countDocuments()
    res.status(200).json(count)
  } catch (error) {
    next(error)
  }
}

export default {
  getAll,
  addUser,
  updateUser,
  initUser,
  exportUsers,
  updateProfile,
  uploadUsers,
  resetPassword,
  loginUser,
  getCount,
}
