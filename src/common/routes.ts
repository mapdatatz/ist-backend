import { Router } from 'express'

const router: Router = Router()

import yearRouter from '../resources/years/routes'
import userRouter from '../resources/users/routes'
import paymentRouter from '../resources/payments/routes'
import membershipRouter from '../resources/memberships/routes'
import memberRouter from '../resources/members/routes'
import instituteRouter from '../resources/institute/routes'

router.use('/years', yearRouter)
router.use('/users', userRouter)
router.use('/members', memberRouter)
router.use('/payments', paymentRouter)
router.use('/institute', instituteRouter)
router.use('/memberships', membershipRouter)

export default router
