import { ICard, IBasketModel, IEvents } from '../types'
import { EventEmitter } from '../components/base/events'

export class BasketModel extends EventEmitter implements IBasketModel {
  private _items: Map<string, ICard> = new Map()
  constructor(private events: IEvents) {
    super()
  }

  get items(): ReadonlyMap<string, ICard> {
    return this._items
  }

  getCounter(): number {
    return this._items.size
  }

  getSumAllProducts(): number {
    return Array.from(this._items.values()).reduce((sum, item) => {
      return sum + (item.price ?? 0)
    }, 0)
  }

  setSelectedCard(card: ICard): void {
    if (!card?.id) {
      console.error('Некорректный объект карточки')
      return
    }
    this._items.set(card.id, card)
    this.events.emit('basket:changed')
  }

  deleteCardToBasket(id: string): boolean {
    if (!this._items.has(id)) {
      console.warn(`Попытка удаления несуществующего товара: ${id}`)
      return false
    }
    this._items.delete(id)
    this.events.emit('basket:changed')
    return true
  }

  clearBasketProducts(): void {
    this._items.clear()
    this.events.emit('basket:changed')
  }

  checkProductInBasket(id: string): boolean {
    return this._items.has(id)
  }
}
