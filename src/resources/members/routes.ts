import { Router } from 'express'
import memberController from './controller'
import authenticateToken from '../../middlewares/verifyAuth';

const router = Router()

router.route('/').post(authenticateToken, memberController.createMember)
router.route('/').get(authenticateToken, memberController.getMembers)
router.route('/:id').get(authenticateToken, memberController.getMember)
router.route('/:id').patch(authenticateToken, memberController.updateMember)
router.route('/:id').delete(authenticateToken, memberController.deleteMember)
router.route('/type/corporates').get(authenticateToken, memberController.getCorporates)
router.route('/count/all').get(authenticateToken, memberController.getCountAll)
router.route('/count/corp').get(authenticateToken, memberController.getCountCorp)
router.route('/count/indi').get(authenticateToken, memberController.getCountIndi)
router.route('/data/export').get(authenticateToken, memberController.exportMembers)

// Address
router.route('/:id/addresses').post(authenticateToken, memberController.addAddress)
router.route('/:id/addresses/:addressId').patch(authenticateToken, memberController.updateAddress)
router.route('/:id/addresses/:addressId').delete(authenticateToken, memberController.deleteAddress)

// Education
router.route('/:id/educations').post(authenticateToken, memberController.addEducation)
router.route('/:id/educations/:educationId').patch(authenticateToken, memberController.updateEducation)
router.route('/:id/educations/:educationId').delete(authenticateToken, memberController.deleteEducation)

// Employment
router.route('/:id/employments').post(authenticateToken, memberController.addEmployment)
router.route('/:id/employments/:employmentId').patch(authenticateToken, memberController.updateEmployment)
router.route('/:id/employments/:employmentId').delete(authenticateToken, memberController.deleteEmployment)


// Expertise
router.route('/:id/expertises').post(authenticateToken, memberController.addExpertise)
router.route('/:id/expertises/:expertiseId').patch(authenticateToken, memberController.updateExpertise)
router.route('/:id/expertises/:expertiseId').delete(authenticateToken, memberController.deleteExpertise)


// License
router.route('/:id/licenses').post(authenticateToken, memberController.addLicense)
router.route('/:id/licenses/:licenseId').patch(authenticateToken, memberController.updateLicense)
router.route('/:id/licenses/:licenseId').delete(authenticateToken, memberController.deleteLicense)


// Qualification
router.route('/:id/qualifications').post(authenticateToken, memberController.addQualification)
router.route('/:id/qualifications/:qualificationId').patch(authenticateToken, memberController.updateQualification)
router.route('/:id/qualifications/:qualificationId').delete(authenticateToken, memberController.deleteQualification)



// Referees
router.route('/:id/referees').post(authenticateToken, memberController.addReferee)
router.route('/:id/referees/:refereeId').patch(authenticateToken, memberController.updateReferee)
router.route('/:id/referees/:refereeId').delete(authenticateToken, memberController.deleteReferee)

export default router
