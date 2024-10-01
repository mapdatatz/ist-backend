import { Router } from 'express'
import paymentController from './controller'

const router = Router()

router.route('/').post(paymentController.createPayment)
router.route('/').get(paymentController.getPayments)
router.route('/:id').get(paymentController.getPayment)
router.route('/:id').patch(paymentController.updatePayment)
router.route('/:id').delete(paymentController.deletePayment)
router.route('/:id/pay').post(paymentController.memberPayment)
router.route('/data/export').get(paymentController.exportPayments)
router.route('/data/chart').get(paymentController.getChartTotals)
router.route('/data/year').get(paymentController.getYearTotals)
router.route('/members/:member').get(paymentController.memberPayments)
router.route('/data/category').get(paymentController.getCategoryTotals)

export default router
