import { Router } from 'express'
import yearController from './controller'
import authenticateToken from '../../middlewares/verifyAuth';

const router = Router()

router.route('/').post(authenticateToken, yearController.createYear)
router.route('/').get(authenticateToken, yearController.getYears)
router.route('/:id').get(authenticateToken, yearController.getYear)
router.route('/:id').patch(authenticateToken, yearController.updateYear)
router.route('/:id').delete(authenticateToken, yearController.deleteYear)
router.route('/data/export').get(authenticateToken, yearController.exportYears)

export default router
