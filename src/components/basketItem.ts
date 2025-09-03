import { Component } from './base/component';
import { ICard, IEvents } from '../types';
import { ensureElement } from '../utils/utils';

export class BasketItem extends Component<ICard> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    item: ICard,
    index: number
  ) {
    super(container);
    
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    this._index.textContent = (index + 1).toString();
    this._title.textContent = item.title;
    this._price.textContent = `${item.price} синапсов`;

    this._button.addEventListener('click', () => {
      events.emit('basket:remove', { id: item.id });
    });
  }
}