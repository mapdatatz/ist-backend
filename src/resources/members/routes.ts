import { Router } from 'express'
import memberController from './controller'

const router = Router()

router.route('/').post(memberController.createMember)
router.route('/').get(memberController.getMembers)
router.route('/:id').get(memberController.getMember)
router.route('/:id').patch(memberController.updateMember)
router.route('/:id').delete(memberController.deleteMember)
router.route('/type/corporates').get(memberController.getCorporates)
router.route('/count/all').get(memberController.getCountAll)
router.route('/count/corp').get(memberController.getCountCorp)
router.route('/count/indi').get(memberController.getCountIndi)
router.route('/data/export').get(memberController.exportMembers)

// Address
router.route('/:id/addresses').post(memberController.addAddress)
router.route('/:id/addresses/:addressId').patch(memberController.updateAddress)
router.route('/:id/addresses/:addressId').delete(memberController.deleteAddress)

// Education
router.route('/:id/educations').post(memberController.addEducation)
router.route('/:id/educations/:educationId').patch(memberController.updateEducation)
router.route('/:id/educations/:educationId').delete(memberController.deleteEducation)

// Employment
router.route('/:id/employments').post(memberController.addEmployment)
router.route('/:id/employments/:employmentId').patch(memberController.updateEmployment)
router.route('/:id/employments/:employmentId').delete(memberController.deleteEmployment)


// Expertise
router.route('/:id/expertises').post(memberController.addExpertise)
router.route('/:id/expertises/:expertiseId').patch(memberController.updateExpertise)
router.route('/:id/expertises/:expertiseId').delete(memberController.deleteExpertise)


// License
router.route('/:id/licenses').post(memberController.addLicense)
router.route('/:id/licenses/:licenseId').patch(memberController.updateLicense)
router.route('/:id/licenses/:licenseId').delete(memberController.deleteLicense)


// Qualification
router.route('/:id/qualifications').post(memberController.addQualification)
router.route('/:id/qualifications/:qualificationId').patch(memberController.updateQualification)
router.route('/:id/qualifications/:qualificationId').delete(memberController.deleteQualification)



// Referees
router.route('/:id/referees').post(memberController.addReferee)
router.route('/:id/referees/:refereeId').patch(memberController.updateReferee)
router.route('/:id/referees/:refereeId').delete(memberController.deleteReferee)

export default router
