import { Form } from './form'
import { IEvents } from '../types'
import { ensureElement } from '../utils/utils'
import { IOrderForm } from '../types'

export class OrderForm extends Form<IOrderForm> {
  protected _paymentButtons: HTMLButtonElement[]
  protected _addressInput: HTMLInputElement

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events)

    this._paymentButtons = Array.from(container.querySelectorAll('.button_alt'))
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container)

    this.setupEventHandlers()
  }

  private setupEventHandlers(): void {
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const paymentType = button.textContent?.includes('Онлайн') ? 'online' : 'offline'
        this.payment = paymentType
        this.events.emit('order.payment:change', { payment: paymentType })
      })
    })

    this._addressInput.addEventListener('input', () => {
      this.events.emit('order.address:change', {
        address: this._addressInput.value,
      })
    })

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault()
      this.events.emit('order:submit')
    })
  }

  set payment(value: 'online' | 'offline' | null) {
    this._paymentButtons.forEach(button => {
      const isOnlineButton = button.textContent?.includes('Онлайн')
      const isActive =
        (value === 'online' && isOnlineButton) || (value === 'offline' && !isOnlineButton)
      button.classList.toggle('button_alt-active', isActive)
    })
  }

  set address(value: string) {
    this._addressInput.value = value
  }

  get address(): string {
    return this._addressInput.value
  }
}
