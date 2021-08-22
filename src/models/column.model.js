import Joi from 'joi'
import { getDB } from '*/config/mongodb'
import { ObjectId } from 'mongodb'

//Define Column collection
const columnCollectionName = 'columns'
const columnCollectionSchema = Joi.object({
    boardId: Joi.string().required(), // also ObjectId when create new
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
        const validationValue = await validateSchema(data)
        const insertValue = {
            ...validationValue,
            boardId: ObjectId(validationValue.boardId)
        }
        const result = await getDB().collection(columnCollectionName).insertOne(insertValue)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * @param {string} columnId
 * @param {string} cardId
 */
const pushCardOrder = async (columnId, cardId) => {
    try {
        const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
            { _id: columnId },
            { $push: { cardOrder: cardId } },
            { upsert: true, returnNewDocument: true } //trả về bản ghi sau khi đã update
        )
        return result.value
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const updateData = { ...data }
        if (data.boardId) updateData.boardId = ObjectId(data.boardId)
        const result = await getDB().collection(columnCollectionName).findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: updateData },
            { upsert: true, returnNewDocument: true } //trả về bản ghi sau khi đã update
        )
        return result.value
    } catch (error) {
        throw new Error(error)
    }
}

const getDataNewColumn = async (columnId) => {
    try {
        const result = await getDB().collection(columnCollectionName).findOne(
            { _id: columnId }
        )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const ColumnModel = {
    columnCollectionName,
    createNew,
    update,
    getDataNewColumn,
    pushCardOrder
}
