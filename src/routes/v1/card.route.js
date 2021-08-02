import express from 'express'
import { CardValidation } from '*/validations/card.validation'
import { CardController } from '*/controllers/card.controller'

const router = express.Router()

router.route('/')
    .post(CardValidation.createNew, CardController.createNew)

export const CardRoutes = router