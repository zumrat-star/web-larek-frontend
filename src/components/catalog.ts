import { Component } from './base/component'
import { IEvents } from '../types'
import { ICard } from '../types'
import { Card } from './card'

export class Catalog extends Component<ICard[]> {
  protected _cards: ICard[] = []
  protected _cardInstances: Card[] = []

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
  }

  update(cards: ICard[]): void {
    this._cards = cards
    this.renderItems()
  }

  private renderItems(): void {
    const template = document.getElementById('card-catalog') as HTMLTemplateElement
    if (!template) return

    this.container.innerHTML = ''

    this._cards.forEach(card => {
      const element = template.content.cloneNode(true) as DocumentFragment
      const container = element.firstElementChild as HTMLElement

      const cardComponent = new Card(container, this.events)
      cardComponent.setData(card)

      this.container.appendChild(container)
      this._cardInstances.push(cardComponent)
    })
  }
}
