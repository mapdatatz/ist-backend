import { Router } from 'express'
import quizController from './controller'

const router = Router()

router.route('/').post(quizController.createMembership)
router.route('/').get(quizController.getMemberships)
router.route('/:id').get(quizController.getMembership)
router.route('/:id').patch(quizController.updateMembership)
router.route('/:id').delete(quizController.deleteMembership)
router.route('/data/export').get(quizController.exportMemberships)

export default router
