import { Component } from './base/component';
import { ICard } from '../types';
import { EventEmitter } from './base/events';
import { Card } from './card';


export class Catalog extends Component<{ items: ICard[] }> {
    protected _cards: HTMLElement[];

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this._cards = [];
    }

    update(items: ICard[]) {
        this.clear();
        
        items.forEach(item => {
            const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
            if (!cardTemplate) return;
            
            const cardElement = cardTemplate.content.cloneNode(true) as DocumentFragment;
            const cardContainer = cardElement.firstElementChild as HTMLElement;
            
            const card = new Card(cardContainer);
            card.setData(item);
            
            // Добавляем карточку в DOM
            this.container.appendChild(cardContainer);
            
            // Сохраняем ссылку на DOM-элемент (не экземпляр Card)
            this._cards.push(cardContainer);
            
            // Обработчик клика
            cardContainer.addEventListener('click', () => {
                this.events.emit('card:select', { card: item });
            });
        });
    }

    clear() {
        // Удаляем все DOM-элементы карточек
        this._cards.forEach(card => card.remove());
        this._cards = [];
    }
}