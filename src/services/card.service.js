import { CardModel } from '*/models/card.model'
import { ColumnModel } from '*/models/column.model'

const createNew = async (data) => {
    try {
        const newCard = await CardModel.createNew(data)

        //Update cardOrder Array in Column collection
        const idNewCard = newCard.insertedId
        const result = await CardModel.getDataNewCard(idNewCard)
        await ColumnModel.pushCardOrder(result.columnId, idNewCard.toString())

        return newCard
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
        const updatedCard = await CardModel.update(id, updateData)
        const resultUpdatedCard = await CardModel.getDataNewCard(updatedCard._id)
        return resultUpdatedCard
    } catch (error) {
        throw new Error(error)
    }
}


export const CardService = { createNew, update }