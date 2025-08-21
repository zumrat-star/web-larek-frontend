import { Component } from './base/component';
import { ICard } from '../types/index';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<{ items: ICard[]; total: number }> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => {
            events.emit('order:open');
        });
    }

    set items(items: ICard[]) {
        this._list.innerHTML = '';
        
        items.forEach((item, index) => {
            const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
            if (!itemTemplate) return;
            
            const itemElement = itemTemplate.content.cloneNode(true) as DocumentFragment;
            const itemContainer = itemElement.firstElementChild as HTMLElement;
            
            // Заполняем данные элемента корзины
            const indexElement = itemContainer.querySelector('.basket__item-index');
            const titleElement = itemContainer.querySelector('.card__title');
            const priceElement = itemContainer.querySelector('.card__price');
            const deleteButton = itemContainer.querySelector('.basket__item-delete');
            
            if (indexElement) indexElement.textContent = (index + 1).toString();
            if (titleElement) titleElement.textContent = item.title;
            if (priceElement) priceElement.textContent = `${item.price} синапсов`;
            
            if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                    this.events.emit('basket:remove', { id: item.id });
                });
            }
            
            this._list.appendChild(itemContainer);
        });
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

    set buttonState(disabled: boolean) {
        this.setDisabled(this._button, disabled);
    }
}