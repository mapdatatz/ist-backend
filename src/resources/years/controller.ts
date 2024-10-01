import { Request, Response, NextFunction } from 'express'

import Year from './model'

const getYears = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbYears = await Year.find().sort({ createdAt: -1 })
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
    const dbExist = await Year.findOne({ year })
    if (dbExist) {
      return res.status(400).json({ message: `Year ${year} already exists` })
    }
    const dbYear = await Year.create({ year, expectedAmount })
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
