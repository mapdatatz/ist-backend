import { Request, Response, NextFunction } from 'express'

import Membership from './model'

const getMemberships = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbMemberships = await Membership.find().sort({ createdAt: -1 })
    res.status(200).json(dbMemberships)
  } catch (error) {
    next(error)
  }
}

const getMembership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const dbMembership = await Membership.findById(id)
    res.status(200).json(dbMembership)
  } catch (error) {
    next(error)
  }
}

const createMembership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, fee } = req.body
    const dbExist = await Membership.findOne({ category })
    if (dbExist) {
      return res.status(400).json({ message: `Membership ${category} already exists` })
    }
    const dbMembership = await Membership.create({ category, fee })
    res.status(201).json(dbMembership)
  } catch (error) {
    next(error)
  }
}

const exportMemberships = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbMemberships = await Membership.find()
    res.status(200).send(dbMemberships)
  } catch (error) {
    next(error)
  }
}

const updateMembership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { category, fee } = req.body
    const dbMembership = await Membership.findById(id)
    if (category) dbMembership.category = category
    if (fee) dbMembership.fee = fee
    await dbMembership.save()
    res.status(200).json(dbMembership)
  } catch (error) {
    next(error)
  }
}

const deleteMembership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const dbMembership = await Membership.findByIdAndDelete(id)
    res.status(200).json(dbMembership)
  } catch (error) {
    next(error)
  }
}

export default {
  getMemberships,
  getMembership,
  createMembership,
  exportMemberships,
  updateMembership,
  deleteMembership,
}
