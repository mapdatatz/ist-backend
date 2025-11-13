import { Request, Response, NextFunction } from 'express'
import xlsx from 'xlsx'
import Member from './model'
import Payment from '../payments/model'
import Membership from '../memberships/model'
import Year from '../years/model'
import getNextSequenceValue from '../../common/sequence'
import IMember from './interface'
import mongoose from 'mongoose'

const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, name }: any = req.query
    let filters: any = {}
    let skip = 0
    if (name) {
      filters.name = new RegExp(name, 'i')
    }
    if (page && limit) {
      skip = (page - 1) * limit
    }
    const dbMembers = await Member.find(filters).skip(skip).limit(limit).populate('membership').sort({ createdAt: -1 })
    const count = await Member.countDocuments(filters)
    res.status(200).json({ data: dbMembers, total: count })
  } catch (error) {
    next(error)
  }
}

const getCorporates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, name }: any = req.query
    let filters: any = { isCorporate: true }
    let skip = 0
    if (name) {
      filters.name = new RegExp(name, 'i')
    }
    if (page && limit) {
      skip = (page - 1) * limit
    }
    const dbMembers = await Member.find(filters).skip(skip).limit(limit).populate('membership').sort({ createdAt: -1 })
    const count = await Member.countDocuments(filters)
    res.status(200).json({ data: dbMembers, total: count })
  } catch (error) {
    next(error)
  }
}

const getMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const dbMember = await Member.findById(id).populate('membership')
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const createMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, mobile, membership, nextUpgrade, website, tinNo, isCorporate, memberNo, dateRegistered } =
      req.body
    const dbExist = await Member.findOne({ email })
    if (dbExist) {
      return res.status(400).json({ message: `Member with email ${email} already exists` })
    }
    const year = new Date(dateRegistered).getFullYear()
    const dbYear = await Year.findOne({ year })
    if (!dbYear) {
      return res.status(400).json({ message: `Year ${year} not added` })
    }
    const memberId = await getNextSequenceValue('memberId')
    const dbMember: any = await Member.create({
      memberId,
      name,
      email,
      mobile,
      membership,
      nextUpgrade,
      website,
      tinNo,
      isCorporate,
      memberNo,
      yearRegistered: year,
      dateRegistered,
    })

    // const dbMembership = await Membership.findById(membership)

    // await Payment.create({
    //   name: dbMember?.name,
    //   mobile: dbMember?.mobile,
    //   memberId: dbMember?.memberId,
    //   email: dbMember?.email,
    //   isCorporate: dbMember?.isCorporate,
    //   member: dbMember._id,
    //   membership: dbMembership?._id,
    //   year: year,
    //   expectedAmount: dbMembership?.fee,
    //   paidAmount: 0,
    //   remainAmount: dbMembership?.fee,
    //   dueDate: new Date(year, 12, 31),
    //   yearref: dbYear._id,
    // })
    await dbMember.save()
    res.status(201).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const exportMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbMembers = await Member.find().populate('membership')
    res.status(200).send(dbMembers)
  } catch (error) {
    next(error)
  }
}

const getCountAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await Member.countDocuments()
    res.status(200).json(count)
  } catch (error) {
    next(error)
  }
}

const getCountCorp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await Member.countDocuments({ isCorporate: true })
    res.status(200).json(count)
  } catch (error) {
    next(error)
  }
}
const getCountIndi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await Member.countDocuments({ isCorporate: true })
    res.status(200).json(count)
  } catch (error) {
    next(error)
  }
}

const updateMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, email, mobile, membership, dateRegistered, nextUpgrade, website, tinNo, isCorporate, memberNo } =
      req.body
    const dbExist = await Member.findOne({ name })
    if (dbExist && dbExist._id != id) {
      return res.status(400).json({ message: `Member with email ${email} already exists` })
    }

    if (dateRegistered) {
      const year = new Date(dateRegistered).getFullYear()

      const dbYear = await Year.findOne({ year })
      if (!dbYear) {
        return res.status(400).json({ message: `Year ${year} not added` })
      }
      const dbMember = await Member.findByIdAndUpdate(id, {
        name,
        email,
        mobile,
        membership,
        nextUpgrade,
        website,
        tinNo,
        isCorporate,
        memberNo,
        dateRegistered,
        yearRegistered: year,
      })
      res.status(200).json(dbMember)
    }

    const dbMember = await Member.findByIdAndUpdate(id, {
      name,
      email,
      mobile,
      membership,
      nextUpgrade,
      website,
      tinNo,
      isCorporate,
      memberNo,
    })
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const uploadMembers = async (req: any, res: Response, next: NextFunction) => {
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
        const memberId = await getNextSequenceValue('memberId')
        let existingMember = await Member.findOne({ name: row.NAME })

        if (existingMember) {
          // Update existing member
          existingMember.memberId = memberId
          existingMember.name = row.NAME
          existingMember.membership = row.MEMBERSHIP
          existingMember.title = row.TITLE
          existingMember.isCorporate = row.CORPORATE == 'Y' ? true : false
          existingMember.dateRegistered = new Date(row.REGISTERED)
          await existingMember.save()
          pass.push(row.NAME)
          passCount++
        } else {
          // Create new Member if not found
          const newMember: IMember = new Member({
            memberId: memberId,
            name: row.NAME,
            membership: row.MEMBERSHIP,
            title: row.TITLE,
            isCorporate: row.CORPORATE == 'Y' ? true : false,
            dateRegistered: new Date(row.REGISTERED),
          })
          await newMember.save()
          pass.push(row.NAME)
          passCount++
        }
      } catch (error) {
        fail.push(row.NAME)
        failCount++
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).send({ message: `Validation Error: ${error.message}` })
        } else if (error.code === 11000) {
          return res.status(409).send({ message: `Name ${row.NAME} already exists.` })
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

const deleteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const dbMember = await Member.findByIdAndDelete(id)
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

// ADDRESS
const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = req.body
    const dbMember = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }
    dbMember.addresses.push(data)
    await dbMember.save()
    res.status(201).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, addressId } = req.params
    const data = req.body

    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const address = dbMember.addresses.id(addressId)
    if (!address) {
      return res.status(404).json({ message: 'Address not found' })
    }

    Object.assign(address, data)
    await dbMember.save()
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, addressId } = req.params
    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const address = dbMember.addresses.id(addressId)
    if (!address) {
      return res.status(404).json({ message: 'Address not found' })
    }
    dbMember.addresses.pull(addressId)
    await dbMember.save()

    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

// EDUCATION

const addEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = req.body
    const dbMember = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }
    dbMember.educations.push(data)
    await dbMember.save()
    res.status(201).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const updateEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, educationId } = req.params
    const data = req.body

    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const address = dbMember.educations.id(educationId)
    if (!address) {
      return res.status(404).json({ message: 'Education not found' })
    }

    Object.assign(address, data)
    await dbMember.save()
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const deleteEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, educationId } = req.params
    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const address = dbMember.educations.id(educationId)
    if (!address) {
      return res.status(404).json({ message: 'Education not found' })
    }
    dbMember.educations.pull(educationId)
    await dbMember.save()

    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

// EMPLOYMENT

const addEmployment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = req.body
    const dbMember = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }
    dbMember.employments.push(data)
    await dbMember.save()
    res.status(201).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const updateEmployment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, employmentId } = req.params
    const data = req.body

    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const employment = dbMember.employments.id(employmentId)
    if (!employment) {
      return res.status(404).json({ message: 'Education not found' })
    }

    Object.assign(employment, data)
    await dbMember.save()
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const deleteEmployment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, employmentId } = req.params
    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const employment = dbMember.employments.id(employmentId)
    if (!employment) {
      return res.status(404).json({ message: 'Employment not found' })
    }
    dbMember.employments.pull(employmentId)
    await dbMember.save()

    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

// EXPERTISES

const addExpertise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = req.body
    const dbMember = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }
    dbMember.expertises.push(data)
    await dbMember.save()
    res.status(201).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const updateExpertise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, expertiseId } = req.params
    const data = req.body

    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const expertise = dbMember.expertises.id(expertiseId)
    if (!expertise) {
      return res.status(404).json({ message: 'Expertise not found' })
    }

    Object.assign(expertise, data)
    await dbMember.save()
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const deleteExpertise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, expertiseId } = req.params
    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const expertise = dbMember.expertises.id(expertiseId)
    if (!expertise) {
      return res.status(404).json({ message: 'Expertise not found' })
    }
    dbMember.expertises.pull(expertiseId)
    await dbMember.save()

    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

// LICENSES

const addLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = req.body
    const dbMember = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }
    dbMember.licenses.push(data)
    await dbMember.save()
    res.status(201).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const updateLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, licenseId } = req.params
    const data = req.body

    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const license = dbMember.licenses.id(licenseId)
    if (!license) {
      return res.status(404).json({ message: 'License not found' })
    }

    Object.assign(license, data)
    await dbMember.save()
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const deleteLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, licenseId } = req.params
    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const license = dbMember.licenses.id(licenseId)
    if (!license) {
      return res.status(404).json({ message: 'License not found' })
    }
    dbMember.licenses.pull(licenseId)
    await dbMember.save()

    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

// QUALIFICATIONS

const addQualification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = req.body
    const dbMember = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }
    dbMember.qualifications.push(data)
    await dbMember.save()
    res.status(201).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const updateQualification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, qualificationId } = req.params
    const data = req.body

    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const qualification = dbMember.qualifications.id(qualificationId)
    if (!qualification) {
      return res.status(404).json({ message: 'Qualification not found' })
    }

    Object.assign(qualification, data)
    await dbMember.save()
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const deleteQualification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, qualificationId } = req.params
    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const qualification = dbMember.qualifications.id(qualificationId)
    if (!qualification) {
      return res.status(404).json({ message: 'Qualification not found' })
    }
    dbMember.qualifications.pull(qualificationId)
    await dbMember.save()

    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

// REFEREES

const addReferee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = req.body
    const dbMember = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }
    dbMember.referees.push(data)
    await dbMember.save()
    res.status(201).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const updateReferee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, refereeId } = req.params
    const data = req.body

    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const referee = dbMember.referees.id(refereeId)
    if (!referee) {
      return res.status(404).json({ message: 'Referee not found' })
    }

    Object.assign(referee, data)
    await dbMember.save()
    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

const deleteReferee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, refereeId } = req.params
    const dbMember: any = await Member.findById(id)
    if (!dbMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const referee = dbMember.referees.id(refereeId)
    if (!referee) {
      return res.status(404).json({ message: 'Referee not found' })
    }
    dbMember.referees.pull(refereeId)
    await dbMember.save()

    res.status(200).json(dbMember)
  } catch (error) {
    next(error)
  }
}

export default {
  getMembers,
  getCorporates,
  getMember,
  getCountAll,
  getCountCorp,
  getCountIndi,
  createMember,
  uploadMembers,
  exportMembers,
  updateMember,
  deleteMember,

  addAddress,
  updateAddress,
  deleteAddress,

  addEducation,
  updateEducation,
  deleteEducation,

  addEmployment,
  updateEmployment,
  deleteEmployment,

  addExpertise,
  updateExpertise,
  deleteExpertise,

  addQualification,
  updateQualification,
  deleteQualification,

  addReferee,
  updateReferee,
  deleteReferee,

  addLicense,
  updateLicense,
  deleteLicense,
}
