import { Document } from 'mongoose'


export interface IAddress {
  country: string
  region: string
  Municipal: string
  ward: string
  street: string
  block: string
  plot: string
}

export interface IEducation {
  level: string
  institution: string
  startYear: number
  endYear: number
  result: string
}

export interface IQualification {
  title: string
  description: string
  year: number
}

export interface ILicense {
  name: string
  description: string
}

export interface IExpertise {
  title: string
  description: string
  year: number
}

export interface IReferees {
  name: string
  email: string
  mobile: string
  relation: string
}

export interface IEmployement {
  company: string
  position: string
  startDate: Date
  endDate: Date
  description: string
}

interface IMember extends Document {
  _id?: string
  memberId: number
  name: string
  email: string
  mobile: string
  memberNo: string
  title: string
  website: string
  tinNo: string
  vrnNo: string
  nextUpgrade: Date
  membership: string
  isFormDispatched: boolean
  isFormSubmited: boolean
  isFormReviewed: boolean
  isFullRegistered: boolean
  isCorporate: boolean
  dateRegistered: Date
  yearRegistered: number
  dateUpgraded: Date
  isActive: boolean
  addresses: IAddress[]
  educations: IEducation[]
  qualifications: IQualification[]
  licenses: ILicense[]
  expertises: IExpertise[]
  referees: IReferees[]
  employments: IEmployement[]
}

export default IMember
