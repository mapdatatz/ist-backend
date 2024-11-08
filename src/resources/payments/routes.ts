import { Router } from 'express'
import paymentController from './controller'
import authenticateToken from '../../middlewares/verifyAuth'

const router = Router()

router.route('/').post(authenticateToken, paymentController.createPayment)
router.route('/').get(authenticateToken, paymentController.getPayments)
router.route('/:id').get(authenticateToken, paymentController.getPayment)
router.route('/:id').patch(authenticateToken, paymentController.updatePayment)
router.route('/:id').delete(authenticateToken, paymentController.deletePayment)
router.route('/:id/paydate').patch(authenticateToken, paymentController.updatePaydate)
router.route('/:id/pay').post(authenticateToken, paymentController.memberPayment)
router.route('/data/export').get(authenticateToken, paymentController.exportPayments)
router.route('/data/chart').get(authenticateToken, paymentController.getChartTotals)
router.route('/data/year').get(authenticateToken, paymentController.getYearTotals)
router.route('/members/:member').get(authenticateToken, paymentController.memberPayments)
router.route('/data/category').get(authenticateToken, paymentController.getCategoryTotals)

export default router
