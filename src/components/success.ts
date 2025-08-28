import { Component } from './base/component';
import { IEvents } from '../types';
import { ISuccess } from '../types';
import { ensureElement } from '../utils/utils';

export class Success extends Component<ISuccess> {
  protected _closeButton: HTMLButtonElement
  protected _totalElement: HTMLElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container)
    this._totalElement = ensureElement<HTMLElement>('.order-success__description', container)

    this._closeButton.addEventListener('click', () => {
      events.emit('success:close')
    })
  }

  set total(value: number) {
    this.setText(this._totalElement, `Списано ${value} синапсов`)
  }
}