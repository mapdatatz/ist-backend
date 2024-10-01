import mongoose, { Schema } from 'mongoose'
import IMember from './interface'

const AddressSchema = new Schema({
  country: { type: String },
  region: { type: String },
  Municipal: { type: String },
  ward: { type: String },
  street: { type: String },
  block: { type: String },
  plot: { type: String },
})

const EducationSchema = new Schema({
  level: { type: String },
  institution: { type: String },
  startYear: { type: Number },
  endYear: { type: Number },
  result: { type: String },
})

const QualificationSchema = new Schema({
  title: { type: String },
  description: { type: String },
  year: { type: Number },
})

const LicenseSchema = new Schema({
  name: { type: String },
  description: { type: String },
})

const ExpertiseSchema = new Schema({
  name: { type: String },
  description: { type: String },
})

const RefereesSchema = new Schema({
  name: { type: String },
  office: { type: String },
  email: { type: String },
  mobile: { type: String },
})

const EmploymentSchema = new Schema({
  company: { type: String },
  position: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
})



const MemberSchema = new Schema(
  {
    memberId: {type: Number, unique: true},
    name: {
      type: String,
      required: true,
    },
    email: { type: String },
    mobile: { type: String },
    regYear: { type: Number, default: new Date().getFullYear() },
    memberNo: { type: String },
    website: { type: String },
    tinNo: { type: String },
    vrnNo: { type: String },
    nextUpgrade: { type: Date },
    dateRegisterd: { type: Date, default: Date.now },
    dateUpgraded: { type: Date },
    membership: { type: Schema.Types.ObjectId, ref: 'memberships' },
    isCorporate: { type: Boolean, default: false },
    isFormDispatched: { type: Boolean, default: false },
    isFormSubmited: { type: Boolean, default: false },
    isFormReviewed: { type: Boolean, default: false },
    isFullRegistered: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    addresses: [AddressSchema],
    educations: [EducationSchema],
    qualifications: [QualificationSchema],
    licenses: [LicenseSchema],
    expertises: [ExpertiseSchema],
    referees: [RefereesSchema],
    employments: [EmploymentSchema],
  },
  { timestamps: true },
)

const Member = mongoose.model<IMember>('members', MemberSchema)

export default Member
