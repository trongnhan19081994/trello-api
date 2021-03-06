import { ColumnModel } from '*/models/column.model'
import { BoardModel } from '*/models/board.model'
import { CardModel } from '*/models/card.model'

const createNew = async (data) => {
    try {
        //transaction mongodb
        const newColumn = await ColumnModel.createNew(data)

        //Update columnOrder Array in board collection
        const idNewColumn = newColumn.insertedId
        const result = await ColumnModel.getDataNewColumn(idNewColumn)
        await BoardModel.pushColumnOrder(result.boardId, idNewColumn.toString())

        newColumn.cards = []

        return newColumn
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const updateData = {
            ...data,
            updatedAt: Date.now()
        }
        if (updateData._id) delete updateData._id
        if (updateData.cards) delete updateData.cards

        const updatedColumn = await ColumnModel.update(id, updateData)
        const resultUpdatedColumn = await ColumnModel.getDataNewColumn(updatedColumn._id)
        if (resultUpdatedColumn._destroy) {
            //delete many cards in this column
            CardModel.deleteMany(resultUpdatedColumn.cardOrder)
        }

        return resultUpdatedColumn
    } catch (error) {
        throw new Error(error)
    }
}

export const ColumnService = { createNew, update }