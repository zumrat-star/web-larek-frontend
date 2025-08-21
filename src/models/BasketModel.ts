import { ICard } from '../types';
import { EventEmitter } from '../components/base/events';

export class BasketModel extends EventEmitter {
    items: Map<string, ICard> = new Map();

    getCounter(): number {
        return this.items.size;
    }

    getSumAllProducts(): number {
        return Array.from(this.items.values()).reduce((sum, item) => sum + (item.price || 0), 0);
    }

    setSelectedCard(card: ICard) {
        this.items.set(card.id, card);
        this.emit('basket:changed');
    }

    deleteCardToBasket(id: string) {
        this.items.delete(id);
        this.emit('basket:changed');
    }

    clearBasketProducts() {
        this.items.clear();
        this.emit('basket:changed');
    }

    checkProductInBasket(id: string): boolean {
        return this.items.has(id);
    }
}