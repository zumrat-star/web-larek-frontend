import { Component } from './base/component'
import { IEvents } from '../types'
import { ensureElement } from '../utils/utils'

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
  protected _list: HTMLElement
  protected _total: HTMLElement
  protected _button: HTMLButtonElement

  constructor(container: HTMLElement, events: IEvents) {
    super(container)
    this._list = ensureElement<HTMLElement>('.basket__list', container)
    this._total = ensureElement<HTMLElement>('.basket__price', container)
    this._button = ensureElement<HTMLButtonElement>('.basket__button', container)

    this._button.addEventListener('click', () => {
      events.emit('order:open')
    })
  }

  updateBasket(items: HTMLElement[], total: number): void {
    this.renderItems(items)
    this.total = total
    this.buttonState = items.length === 0
  }

  private renderItems(items: HTMLElement[]): void {
    this._list.innerHTML = ''

    if (items.length === 0) {
      this._list.innerHTML = '<div class="basket__empty">Корзина пуста</div>'
      return
    }

    items.forEach(itemElement => {
      this._list.appendChild(itemElement)
    })
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`)
  }

  set buttonState(disabled: boolean) {
    this.setDisabled(this._button, disabled)
  }

  getContainer(): HTMLElement {
    return this.container
  }

  protected setText(element: HTMLElement | null, value: string): void {
    if (element) {
      element.textContent = value
    }
  }

  protected setDisabled(element: HTMLButtonElement | null, state: boolean): void {
    if (element) {
      element.disabled = state
    }
  }
}
