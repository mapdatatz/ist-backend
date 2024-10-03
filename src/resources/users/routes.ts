import { Router } from 'express'
import userController from './controller'
import upload from '../../middlewares/uploadExcelData'
import authenticateToken from '../../middlewares/verifyAuth';

const router = Router()

router.route('/').get(authenticateToken, userController.getAll)
router.route('/').post(authenticateToken, userController.addUser)
router.route('/:id').patch(authenticateToken, userController.updateUser)
router.route('/:id/reset/password').patch(authenticateToken, userController.resetPassword)
router.route('/:id/update/profile').patch(authenticateToken, userController.updateProfile)
router.route('/init').get(authenticateToken, userController.initUser)
router.route('/login').post(userController.loginUser)
router.route('/count/all').get(authenticateToken, userController.getCount)
router.route('/export').get(authenticateToken, userController.exportUsers)
router.route('/upload').post(upload.single('file'), userController.uploadUsers)

export default router
