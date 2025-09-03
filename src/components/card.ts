import { Component } from './base/component'
import { ICard, IEvents } from '../types'

export class Card extends Component<ICard> {
  protected _categoryElement: HTMLSpanElement | null
  protected _titleElement: HTMLHeadingElement | null
  protected _imageElement: HTMLImageElement | null
  protected _priceElement: HTMLSpanElement | null
  protected _buttonElement: HTMLButtonElement | null
  protected _textElement: HTMLParagraphElement | null
  protected _events: IEvents | null = null
  protected _id = ''

  constructor(container: HTMLElement, events?: IEvents) {
    super(container)
    this._events = events

    this._categoryElement = container.querySelector('.card__category')
    this._titleElement = container.querySelector('.card__title')
    this._imageElement = container.querySelector('.card__image')
    this._priceElement = container.querySelector('.card__price')
    this._buttonElement = container.querySelector('.button')
    this._textElement = container.querySelector('.card__text')

    // Добавляем обработчик клика на всю карточку
    if (events) {
      this.container.addEventListener('click', event => {
        // Предотвращаем всплытие события, если кликнули на кнопку
        if (!(event.target as Element).closest('.button')) {
          events.emit('card:select', { id: this._id })
        }
      })
    }
  }

  setData(data: ICard) {
    this._id = data.id
    this.container.dataset.id = data.id

    if (data.category) this.category = data.category
    if (data.title) this.title = data.title
    if (data.image) this.image = data.image
    if (data.price !== undefined) this.price = data.price
    if (data.description && this._textElement) this.text = data.description
  }

  set category(value: string) {
    this.setText(this._categoryElement, value)
  }

  set title(value: string) {
    this.setText(this._titleElement, value)
  }

  set image(value: string) {
    if (this._imageElement) {
      this._imageElement.src = value
      this._imageElement.alt = this._titleElement?.textContent || ''
    }
  }

  set price(value: number) {
    this.setText(this._priceElement, value ? `${value} синапсов` : 'Бесценно')
  }

  set buttonText(value: string) {
    this.setText(this._buttonElement, value)
  }

  set buttonDisabled(state: boolean) {
    this.setDisabled(this._buttonElement, state)
  }

  set text(value: string) {
    if (this._textElement) {
      this.setText(this._textElement, value)
    }
  }

  // Метод для настройки кнопки
  setupButton(inBasket: boolean, onAdd: () => void, onRemove: () => void) {
    if (!this._buttonElement) return

    if (inBasket) {
      this._buttonElement.textContent = 'Убрать из корзины'
      this._buttonElement.onclick = onRemove
    } else {
      this._buttonElement.textContent = 'В корзину'
      this._buttonElement.onclick = onAdd
    }
  }
}
