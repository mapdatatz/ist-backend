import { Router } from 'express'
import yearController from './controller'

const router = Router()

router.route('/').post(yearController.createYear)
router.route('/').get(yearController.getYears)
router.route('/:id').get(yearController.getYear)
router.route('/:id').patch(yearController.updateYear)
router.route('/:id').delete(yearController.deleteYear)
router.route('/data/export').get(yearController.exportYears)

export default router
