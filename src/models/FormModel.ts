import { IOrder } from '../types'
import { EventEmitter } from '../components/base/events'

export class FormModel extends EventEmitter {
  private _state: IOrder

  constructor() {
    super()
    this._state = this.createEmptyOrder()
  }

  get state(): Readonly<IOrder> {
    return this._state
  }

  updateState(updates: Partial<IOrder>): void {
    this._state = { ...this._state, ...updates }
    this.emit('form:changed', this._state)
  }

  resetState(): void {
    this._state = this.createEmptyOrder()
    this.emit('form:changed', this._state)
  }

  validateOrderForm(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this._state.payment) {
      errors.push('Выберите способ оплаты')
    }

    if (!this._state.address || this._state.address.trim().length === 0) {
      errors.push('Введите адрес доставки')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  validateContactsForm(): { isValid: boolean; errors: { email: string; phone: string } } {
    const emailError = this.validateEmail(this._state.email)
    const phoneError = this.validatePhone(this._state.phone)

    return {
      isValid: !emailError && !phoneError,
      errors: {
        email: emailError,
        phone: phoneError,
      },
    }
  }

  validateEmail(email: string): string {
    if (email.length === 0) {
      return 'Поле email обязательно для заполнения'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) && email.length > 0) {
      return 'Введите корректный email (например: example@mail.com)'
    }

    return ''
  }

  validatePhone(phone: string): string {
    if (phone.length === 0) {
      return 'Поле телефона обязательно для заполнения'
    }

    const phoneRegex =
      /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
    const phoneDigits = phone.replace(/\D/g, '')

    if (!phoneRegex.test(phoneDigits) && phone.length > 0) {
      return 'Введите корректный номер телефона (например: +7 (999) 123-45-67)'
    }

    return ''
  }

  private createEmptyOrder(): IOrder {
    return {
      payment: null,
      email: '',
      phone: '',
      address: '',
      total: 0,
      items: [],
    }
  }
}
