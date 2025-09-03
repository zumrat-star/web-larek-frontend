import { Component } from './base/component'
import { IEvents } from '../types'

export class Catalog extends Component<HTMLElement[]> {
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
  }

  update(cards: HTMLElement[]): void {
    this.renderItems(cards)
  }

  private renderItems(cards: HTMLElement[]): void {
    this.container.innerHTML = ''
    cards.forEach(cardElement => {
      this.container.appendChild(cardElement)
    })
  }
}
