import { Request, Response, NextFunction } from 'express'

import Institute from './model'

const getInstitutes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbInstitutes = await Institute.find()
    res.status(200).json(dbInstitutes[0])
  } catch (error) {
    next(error)
  }
}

const getInstitute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const dbInstitute = await Institute.findById(id)
    res.status(200).json(dbInstitute)
  } catch (error) {
    next(error)
  }
}

const updateInstitute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, country, region, municipal, ward, email, mobile, postal, street, block,plot, website, tollfree } = req.body
    const dbMember = await Institute.findByIdAndUpdate(
      id,
      {
        name,
        country,
        region,
        municipal,
        ward,
        postal,
        email,
        mobile,
        street,
        block,
        plot,
        website,
        tollfree
      },
      { new: true },
    )
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

export default {
  getInstitutes,
  getInstitute,
  updateInstitute,
}
