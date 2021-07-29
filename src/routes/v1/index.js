import express from 'express'
import { HttpStatusCode } from '*/utilities/constants'
import { BoardRoutes } from './board.route'

const router = express.Router()

router.get('/status', (req, res) => {
    res.status(HttpStatusCode.OK).json({
        status: 'Ok!'
    })
})

router.use('/boards', BoardRoutes)

export const apiV1 = router;