import { Component } from './base/component'
import { ICard, IBasketModel, IEvents } from '../types'
import { ensureElement } from '../utils/utils'

export class Basket extends Component<{ items: ICard[]; total: number }> {
  protected _list: HTMLElement
  protected _total: HTMLElement
  protected _button: HTMLButtonElement

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected basketModel: IBasketModel
  ) {
    super(container)
    this._list = ensureElement<HTMLElement>('.basket__list', container)
    this._total = ensureElement<HTMLElement>('.basket__price', container)
    this._button = ensureElement<HTMLButtonElement>('.basket__button', container)

    this._button.addEventListener('click', () => {
      events.emit('order:open')
    })

    this._list.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const deleteButton = target.closest('.basket__item-delete')

      if (deleteButton) {
        const itemElement = deleteButton.closest('.basket__item')
        const id = itemElement?.getAttribute('data-id')

        if (id) {
          events.emit('basket:remove', { id })
        }
      }
    })
  }

  updateBasket(): void {
    const items = Array.from(this.basketModel.items.values())
    const total = this.basketModel.getSumAllProducts()

    this.renderItems(items)
    this.total = total
    this.buttonState = items.length === 0
  }

  private renderItems(items: ICard[]): void {
    this._list.innerHTML = ''

    if (items.length === 0) {
      this._list.innerHTML = '<div class="basket__empty">Корзина пуста</div>'
      return
    }

    items.forEach((item: ICard, index: number) => {
      const template = document.getElementById('card-basket') as HTMLTemplateElement
      if (!template) return

      const element = template.content.cloneNode(true) as DocumentFragment
      const container = element.firstElementChild as HTMLElement
      container.setAttribute('data-id', item.id)

      const indexElement = container.querySelector('.basket__item-index')
      const titleElement = container.querySelector('.card__title')
      const priceElement = container.querySelector('.card__price')

      if (indexElement) indexElement.textContent = (index + 1).toString()
      if (titleElement) titleElement.textContent = item.title
      if (priceElement) priceElement.textContent = `${item.price} синапсов`

      this._list.appendChild(container)
    })
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`)
  }

  set buttonState(disabled: boolean) {
    this.setDisabled(this._button, disabled)
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
