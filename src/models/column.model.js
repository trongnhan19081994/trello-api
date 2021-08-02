import Joi from 'joi'
import { getDB } from '*/config/mongodb'
import { ObjectId } from 'mongodb'

//Define Column collection
const columnCollectionName = 'columns'
const columnCollectionSchema = Joi.object({
    boardId: Joi.string().required(),
    title: Joi.string().required().min(3).max(30).trim(),
    cardOrder: Joi.array().items(Joi.string()).default([]),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await columnCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const result = await getDB().collection(columnCollectionName).insertOne(value)
        return result
    } catch (error) {
        throw new Error(error)
    }
}
//Đã import { ObjectId } from 'mongodb'
const update = async (id, data) => {
    try {
        const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: data },
            { upsert: true, returnNewDocument: true } //trả về bản ghi sau khi đã update
        )
        return result.value
    } catch (error) {
        throw new Error(error)
    }
}

export const ColumnModel = { createNew, update }
