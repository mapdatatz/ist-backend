import { Request, Response, NextFunction } from 'express'

import Year from './model'
import Payment from '../payments/model'
import Member from '../members/model'

const getYears = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbYears = await Year.find().sort({ year: -1 })
    res.status(200).json(dbYears)
  } catch (error) {
    next(error)
  }
}

const getYear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const dbYear = await Year.findById(id)
    res.status(200).json(dbYear)
  } catch (error) {
    next(error)
  }
}

const createYear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, expectedAmount } = req.body
    const dbCheck = await Year.findOne({ year })
    if (dbCheck) {
      return res.status(400).json({ message: `Year ${year} already exists` })
    }
    const dbYear = await Year.create({ year, expectedAmount })

    if (!dbYear) {
      return res.status(400).json({ message: `Failed to create the year ${year}` })
    }

    // const dbExist = await Payment.findOne({ year })
    // if (dbExist) {
    //   return res.status(400).json({ message: `Payment Ledger for year ${year} already exists` })
    // }
    // const dbMembers = await Member.find({ isActive: true }).populate('membership')
    // if (dbMembers.length == 0) {
    //   return res.status(400).json({ message: `No active members found` })
    // }

    // for (let i = 0; i < dbMembers.length; i++) {
    //   const dbMember: any = dbMembers[i]
    //   await Payment.create({
    //     name: dbMember?.name,
    //     mobile: dbMember?.mobile,
    //     email: dbMember?.email,
    //     memberId: dbMember?.memberId,
    //     isCorporate: dbMember?.isCorporate,
    //     member: dbMember._id,
    //     membership: dbMember.membership,
    //     year,
    //     expectedAmount: dbMember?.membership?.fee,
    //     paidAmount: 0,
    //     remainAmount: dbMember?.membership?.fee,
    //     dueDate: new Date(dbYear.year, 12, 31),
    //     yearref: dbYear._id,
    //   })
    // }
    res.status(201).json(dbYear)
  } catch (error) {
    next(error)
  }
}

const exportYears = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbYears = await Year.find()
    res.status(200).send(dbYears)
  } catch (error) {
    next(error)
  }
}

const updateYear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { year, expectedAmount } = req.body

    const dbYear = await Year.findById(id)
    if (!dbYear) {
      return res.status(404).json({ message: 'Year not found' })
    }

    if (year && year !== dbYear.year) {
      const existingYear = await Year.findOne({ year })
      if (existingYear) {
        return res.status(400).json({ message: 'Year already exists' })
      }
      dbYear.year = year
    }

    if (expectedAmount) {
      dbYear.expectedAmount = expectedAmount
    }

    await dbYear.save()

    res.status(200).json(dbYear)
  } catch (error) {
    next(error)
  }
}

const deleteYear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const dbYear = await Year.findByIdAndDelete(id)
    res.status(200).json(dbYear)
  } catch (error) {
    next(error)
  }
}

export default {
  getYears,
  getYear,
  createYear,
  exportYears,
  updateYear,
  deleteYear,
}
