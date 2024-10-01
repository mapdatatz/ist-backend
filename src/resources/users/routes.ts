import { Router } from 'express'
import userController from './controller'
import upload from '../../middlewares/uploadExcelData'

const router = Router()

router.route('/').get(userController.getAll)
router.route('/').post(userController.addUser)
router.route('/:id').patch(userController.updateUser)
router.route('/:id/reset/password').patch(userController.resetPassword)
router.route('/:id/update/profile').patch(userController.updateProfile)
router.route('/init').get(userController.initUser)
router.route('/login').post(userController.loginUser)
router.route('/count/all').get(userController.getCount)
router.route('/export').get(userController.exportUsers)
router.route('/upload').post(upload.single('file'), userController.uploadUsers)

export default router
