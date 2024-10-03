import { Router } from 'express'
import membershipController from './controller'
import authenticateToken from '../../middlewares/verifyAuth'

const router = Router()

router.route('/').post(authenticateToken, membershipController.createMembership)
router.route('/').get(authenticateToken, membershipController.getMemberships)
router.route('/:id').get(authenticateToken, membershipController.getMembership)
router.route('/:id').patch(authenticateToken, membershipController.updateMembership)
router.route('/:id').delete(authenticateToken, membershipController.deleteMembership)
router.route('/data/export').get(authenticateToken, membershipController.exportMemberships)

export default router
