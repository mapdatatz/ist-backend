import { Router } from 'express'
import memberController from './controller'

const router = Router()

router.route('/').get(memberController.getInstitutes)
router.route('/:id').get(memberController.getInstitute)
router.route('/:id').patch(memberController.updateInstitute)

export default router
