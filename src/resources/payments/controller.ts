import { Request, Response, NextFunction } from 'express'

import Payment from './model'
import Member from '../members/model'
import Year from '../years/model'

const getPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, page, limit, name }: any = req.query
    let filters: any = {}
    let skip = 0
    if (page && limit) {
      skip = (page - 1) * limit
    }

    if (name) {
      filters.name = new RegExp(name, 'i')
    }

    if (year) {
      filters.year = Number(year)
    }
    const dbPayments = await Payment.find(filters)
      .skip(skip)
      .limit(limit)
      .populate('membership')
      .sort({ createdAt: -1 })

    const count = await Payment.countDocuments(filters)

    res.status(200).json({ data: dbPayments, total: count })
  } catch (error) {
    next(error)
  }
}

const getPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const dbPayment = await Payment.findById(id).populate('membership')
    res.status(200).json(dbPayment)
  } catch (error) {
    next(error)
  }
}

const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year } = req.body
    const dbExist = await Payment.findOne({ year })
    if (dbExist) {
      return res.status(400).json({ message: `Payment Ledger for year ${year} already exists` })
    }
    const dbMembers = await Member.find({ isActive: true, yearRegistered: { $gte: year } }).populate('membership')
    if (dbMembers.length == 0) {
      return res.status(400).json({ message: `No active members found` })
    }

    const dbYear = await Year.findOne({ year })
    if (!dbYear) {
      return res.status(400).json({ message: `Year ${year} not found` })
    }

    for (let i = 0; i < dbMembers.length; i++) {
      const dbMember: any = dbMembers[i]
      await Payment.create({
        name: dbMember?.name,
        mobile: dbMember?.mobile,
        email: dbMember?.email,
        memberId: dbMember?.memberId,
        isCorporate: dbMember?.isCorporate,
        member: dbMember._id,
        membership: dbMember.membership,
        year,
        expectedAmount: dbMember?.membership?.fee,
        paidAmount: 0,
        remainAmount: dbMember?.membership?.fee,
        dueDate: new Date(dbYear.year, 12, 31),
        yearref: dbYear._id,
      })
    }
    res.status(201).json(dbYear)
  } catch (error) {
    next(error)
  }
}

const exportPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbPayments = await Payment.find().populate('membership')
    res.status(200).send(dbPayments)
  } catch (error) {
    next(error)
  }
}
const updatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { fullname, email, mobile, membership, nextUpgrade, college, workplace, isCorporate, memberNo } = req.body
    const dbExist = await Payment.findOne({ email })
    if (dbExist && dbExist._id != id) {
      return res.status(400).json({ message: `Member with email ${email} already exists` })
    }
    const dbPayment = await Payment.findByIdAndUpdate(id, {
      fullname,
      email,
      mobile,
      membership,
      nextUpgrade,
      college,
      workplace,
      isCorporate,
      memberNo,
    })
    res.status(200).json(dbPayment)
  } catch (error) {
    next(error)
  }
}


const updateAmount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { expectedAmount } = req.body
    const dbExist = await Payment.findById(id)
    if (!dbExist) {
      return res.status(400).json({ message: `Payment does not exist` })
    }
    const dbPayment = await Payment.findByIdAndUpdate(id, {
      expectedAmount,
      remainAmount: expectedAmount
    })
    res.status(200).json(dbPayment)
  } catch (error) {
    next(error)
  }
}

const updatePaydate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { paidDate } = req.body
    const dbExist = await Payment.findById(id)
    if (!dbExist) {
      return res.status(400).json({ message: `Payment do not exist` })
    }

    const dbPayment = await Payment.findByIdAndUpdate(id, {
      paidDate,
    })
    res.status(200).json(dbPayment)
  } catch (error) {
    next(error)
  }
}

const memberPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { paidAmount, paymentRef, paidDate } = req.body
    const dbExist = await Payment.findById(id)
    if (dbExist?.isPaid) {
      return res.status(400).json({ message: `Payment already made` })
    }
    const dbMember = await Payment.findByIdAndUpdate(id, {
      paidAmount,
      remainAmount: 0,
      isPaid: true,
      paidDate: paidDate? paidDate : new Date(),
      paymentRef,
    })
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const memberPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { member } = req.params
    const dbMember = await Payment.find({ member }).populate('membership').sort({ year: -1 })
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const getChartTotals = async (req: any, res: Response, next: NextFunction) => {
  try {
    const years: any = JSON.parse(req.query.years)
    const result = await Payment.aggregate([
      {
        $facet: {
          existingYears: [
            {
              $match: {
                year: { $in: years },
              },
            },
            {
              $group: {
                _id: '$year',
                Expected: { $sum: '$expectedAmount' },
                Paid: { $sum: '$paidAmount' },
              },
            },
            {
              $project: {
                _id: 0,
                year: '$_id',
                Expected: 1,
                Paid: 1,
                Debt: { $subtract: ['$Expected', '$Paid'] },
              },
            },
          ],
        },
      },
      {
        $project: {
          data: {
            $map: {
              input: years,
              as: 'year',
              in: {
                $mergeObjects: [
                  { year: '$$year', Expected: 0, Paid: 0, Debt: 0 },
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$existingYears',
                          as: 'e',
                          cond: { $eq: ['$$year', '$$e.year'] },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unwind: '$data',
      },
      {
        $replaceRoot: { newRoot: '$data' },
      },
    ])

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const getYearTotals = async (req: any, res: Response, next: NextFunction) => {
  try {
    const year = Number(req.query.year)
    const result = await Payment.aggregate([
      {
        $facet: {
          existingYear: [
            {
              $match: {
                year: year,
              },
            },
            {
              $group: {
                _id: '$year',
                Expected: { $sum: '$expectedAmount' },
                Paid: { $sum: '$paidAmount' },
              },
            },
            {
              $project: {
                _id: 0,
                year: '$_id',
                Expected: 1,
                Paid: 1,
                Debt: { $subtract: ['$Expected', '$Paid'] },
              },
            },
          ],
        },
      },
      {
        $project: {
          data: {
            $mergeObjects: [{ year: year, Expected: 0, Paid: 0, Debt: 0 }, { $arrayElemAt: ['$existingYear', 0] }],
          },
        },
      },
      {
        $replaceRoot: { newRoot: '$data' },
      },
    ])

    const data = result.length > 0 ? result[0] : { year: year, Expected: 0, Paid: 0, Debt: 0 }
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

const getCategoryTotals = async (req: any, res: Response, next: NextFunction) => {
  try {
    const year = Number(req.query.year)
    const result = await Payment.aggregate([
      {
        $match: {
          year: year,
        },
      },
      {
        $lookup: {
          from: 'memberships',
          localField: 'membership',
          foreignField: '_id',
          as: 'membershipData',
        },
      },
      {
        $unwind: '$membershipData',
      },
      {
        $group: {
          _id: '$membershipData.category',
          Paid: { $sum: '$paidAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          Paid: 1,
        },
      },
    ])

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

const deletePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const dbPayment = await Payment.findByIdAndDelete(id)
    res.status(200).json(dbPayment)
  } catch (error) {
    next(error)
  }
}

export default {
  getPayments,
  getPayment,
  getYearTotals,
  getChartTotals,
  createPayment,
  updatePaydate,
  updateAmount,
  exportPayments,
  memberPayments,
  getCategoryTotals,
  updatePayment,
  memberPayment,
  deletePayment,
}
