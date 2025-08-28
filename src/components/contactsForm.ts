import { Form } from './form'
import { IEvents } from '../types'
import { ensureElement, formatPhoneNumber } from '../utils/utils'
import { IContactsForm } from '../types'

export class ContactsForm extends Form<IContactsForm> {
  protected _emailInput: HTMLInputElement
  protected _phoneInput: HTMLInputElement
  protected _emailError: HTMLElement
  protected _phoneError: HTMLElement

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events)

    this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container)
    this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container)

    this._emailError = ensureElement<HTMLElement>('.email-error', container)
    this._phoneError = ensureElement<HTMLElement>('.phone-error', container)

    this.setupEventHandlers()
  }

  private setupEventHandlers(): void {
    // Обработчик для email
    this._emailInput.addEventListener('input', () => {
      this.events.emit('order.email:change', { email: this._emailInput.value })
    })

    // Обработчик для телефона
    this._phoneInput.addEventListener('input', () => {
      const formatted = formatPhoneNumber(this._phoneInput.value)
      this._phoneInput.value = formatted
      this.events.emit('order.phone:change', { phone: formatted })
    })

    this.container.addEventListener('submit', e => {
      e.preventDefault()
      this.events.emit('contacts:submit')
    })
  }

  // Методы для установки ошибок
  setEmailError(message: string): void {
    this._emailError.textContent = message
    this._emailInput.classList.toggle('form__input_error', message.length > 0)
  }

  setPhoneError(message: string): void {
    this._phoneError.textContent = message
    this._phoneInput.classList.toggle('form__input_error', message.length > 0)
  }

  set email(value: string) {
    this._emailInput.value = value
  }

  get email(): string {
    return this._emailInput.value
  }

  set phone(value: string) {
    this._phoneInput.value = value
  }

  get phone(): string {
    return this._phoneInput.value
  }
}
