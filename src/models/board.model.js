import Joi from 'joi'
import { getDB } from '*/config/mongodb'
import { ObjectId } from 'mongodb'
import { ColumnModel } from './column.model'
import { CardModel } from './card.model'

//Define board collection
const boardCollectionName = 'boards'
const boardCollectionSchema = Joi.object({
    title: Joi.string().required().min(3).max(30),
    columnOrder: Joi.array().items(Joi.string()).default([]),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
    _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
    return await boardCollectionSchema.validateAsync(data, { abortEarly: false }) //abortEarly dùng để chạy hết các lỗi ở condition, nếu true thì khi bị lỗi ở đâu sẽ stop ở đó
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const result = await getDB().collection(boardCollectionName).insertOne(value)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * @param {string} boardId
 * @param {string} ColumnId
 */
const pushColumnOrder = async (boardId, columnId) => {
    try {
        const result = await getDB().collection(boardCollectionName).findOneAndUpdate(
            { _id: boardId },
            { $push: { columnOrder: columnId } },
            { upsert: true, returnNewDocument: true } //trả về bản ghi sau khi đã update
        )
        return result.value
    } catch (error) {
        throw new Error(error)
    }
}

const getFullBoard = async (boardId) => {
    try {
        const result = await getDB().collection(boardCollectionName).aggregate([
            {
                $match: {
                    _id: ObjectId(boardId),
                    _destroy: false
                }
            },
            // { $addFields: { _id: { $toString: '$_id' } } },
            {
                $lookup: {
                    from: ColumnModel.columnCollectionName, //Collection name
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'columns'
                }
            },
            {
                $lookup: {
                    from: CardModel.cardCollectionName, //Collection name
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'cards'
                }
            }
        ]).toArray()
        return result[0] || {}
    } catch (error) {
        throw new Error(error)
    }
}

export const BoardModel = { createNew, pushColumnOrder, getFullBoard }