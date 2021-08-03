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

export const CardService = { createNew }