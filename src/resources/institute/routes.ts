import { Router } from 'express'
import memberController from './controller'
import authenticateToken from '../../middlewares/verifyAuth';

const router = Router()

router.route('/').get(authenticateToken, memberController.getInstitutes)
router.route('/:id').get(authenticateToken, memberController.getInstitute)
router.route('/:id').patch(authenticateToken, memberController.updateInstitute)

export default router
