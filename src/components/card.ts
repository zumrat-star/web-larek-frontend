import { Component } from './base/component';
import { ICard } from '../types';
import { ensureElement } from '../utils/utils';

export class Card extends Component<ICard> {
    protected _categoryElement: HTMLSpanElement;
    protected _titleElement: HTMLHeadingElement;
    protected _imageElement: HTMLImageElement;
    protected _priceElement: HTMLSpanElement;
    protected _buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._categoryElement = ensureElement<HTMLSpanElement>('.card__category', container);
        this._titleElement = ensureElement<HTMLHeadingElement>('.card__title', container);
        this._imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this._priceElement = ensureElement<HTMLSpanElement>('.card__price', container);
        this._buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);
    }

    setData(data: ICard) {
        if (data.category) this.category = data.category;
        if (data.title) this.title = data.title;
        if (data.image) this.image = data.image;
        if (data.price !== undefined) this.price = data.price;
    }

    set category(value: string) {
        this.setText(this._categoryElement, value);
    }

    set title(value: string) {
        this.setText(this._titleElement, value);
    }

    set image(value: string) {
        this._imageElement.src = value;
        this._imageElement.alt = this.title;
    }

    set price(value: number) {
        this.setText(this._priceElement, value ? `${value} синапсов` : 'Бесценно');
    }

    set buttonText(value: string) {
        this.setText(this._buttonElement, value);
    }

    set buttonDisabled(state: boolean) {
        this.setDisabled(this._buttonElement, state);
    }
}