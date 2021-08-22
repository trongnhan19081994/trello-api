import Joi from 'joi'
import { getDB } from '*/config/mongodb'
import { ObjectId } from 'mongodb'

//Define Card collection
const cardCollectionName = 'cards'
const cardCollectionSchema = Joi.object({
    boardId: Joi.string().required(), // also ObjectId when create new
    columnId: Joi.string().required(), // also ObjectId when create new
    title: Joi.string().required().min(3).max(30).trim(),
    cover: Joi.string().default(null),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await cardCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validationValue = await validateSchema(data)
        const insertValue = {
            ...validationValue,
            boardId: ObjectId(validationValue.boardId),
            columnId: ObjectId(validationValue.columnId)
        }
        const result = await getDB().collection(cardCollectionName).insertOne(insertValue)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const getDataNewCard = async (cardId) => {
    try {
        const result = await getDB().collection(cardCollectionName).findOne(
            { _id: cardId }
        )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * @param {Array of string card id} ids
 */

const deleteMany = async (ids) => {
    try {
        const transformIds = ids.map(i => ObjectId(i))
        const result = await getDB().collection(cardCollectionName).updateMany(
            { _id: { $in: transformIds } },
            { $set: { _destroy: true } }
        )
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const updateData = { ...data }
        if (data.boardId) updateData.boardId = ObjectId(data.boardId)
        if (data.columnId) updateData.columnId = ObjectId(data.columnId)
        const result = await getDB().collection(cardCollectionName).findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: updateData },
            { upsert: true, returnNewDocument: true } //trả về bản ghi sau khi đã update
        )
        return result.value
    } catch (error) {
        throw new Error(error)
    }
}

export const CardModel = {
    cardCollectionName,
    createNew,
    getDataNewCard,
    deleteMany,
    update
}