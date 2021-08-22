import Joi from 'joi'
import { HttpStatusCode } from '*/utilities/constants'

const createNew = async (req, res, next) => {
    const condition = Joi.object({
        title: Joi.string().required().min(3).max(30)
    })
    try {
        await condition.validateAsync(req.body, { abortEarly: false }) //abortEarly dùng để chạy hết các lỗi ở condition, nếu true thì khi bị lỗi ở đâu sẽ stop ở đó
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(error).message
        })
    }
}

const update = async (req, res, next) => {
    const condition = Joi.object({
        title: Joi.string().min(3).max(30),
        columnOrder: Joi.array().items(Joi.string())
    })
    try {
        await condition.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true // Dùng để update những cái khác title vẫn được, vd như là cardOrder
        })
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(error).message
        })
    }
}

export const BoardValidation = { createNew, update }