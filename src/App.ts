import { ApiModel } from './models/ApiModel'
import { BasketModel } from './models/BasketModel'
import { DataModel } from './models/DataModel'
import { EventEmitter } from './components/base/events'
import { Modal } from './components/base/Modal'
import { Catalog } from './components/catalog'
import { Basket } from './components/basket'
import { OrderForm } from './components/orderForm'
import { ContactsForm } from './components/contactsForm'
import { Success } from './components/success'
import { ICard, IOrder, IOrderResult, IBasketModel, IEvents } from './types'
import { API_URL, CDN_URL } from './utils/constants'
import { Card } from './components/card'

export class App {
  private events: IEvents
  private api: ApiModel
  private basketModel: IBasketModel
  private dataModel: DataModel
  private modal: Modal
  private basket: Basket
  private orderForm: OrderForm
  private contactsForm: ContactsForm
  private success: Success
  private currentOrder: IOrder
  private catalogComponent: Catalog

  constructor() {
    this.events = new EventEmitter()
    this.api = new ApiModel(API_URL, CDN_URL)
    this.basketModel = new BasketModel(this.events)
    this.dataModel = new DataModel()
    this.currentOrder = this.createEmptyOrder()

    this.initComponents()
    this.setupEventHandlers()
    this.loadData()
  }

  private initComponents(): void {
    // Инициализация модального окна
    const modalContainer = document.getElementById('modal-container') as HTMLElement
    this.modal = new Modal(modalContainer, this.events)

    // Инициализация корзины
    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement
    const basketClone = basketTemplate.content.cloneNode(true) as HTMLElement
    this.basket = new Basket(basketClone as HTMLElement, this.events, this.basketModel)

    // Инициализация каталога
    const catalogContainer = document.querySelector('.gallery') as HTMLElement
    this.catalogComponent = new Catalog(catalogContainer, this.events)

    // Инициализация форм
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement
    const orderClone = orderTemplate.content.cloneNode(true) as DocumentFragment
    const orderFormElement = orderClone.querySelector('form[name="order"]') as HTMLFormElement
    this.orderForm = new OrderForm(orderFormElement, this.events)

    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement
    const contactsClone = contactsTemplate.content.cloneNode(true) as DocumentFragment
    const contactsFormElement = contactsClone.querySelector(
      'form[name="contacts"]'
    ) as HTMLFormElement
    this.contactsForm = new ContactsForm(contactsFormElement, this.events)

    const successTemplate = document.getElementById('success') as HTMLTemplateElement
    const successClone = successTemplate.content.cloneNode(true) as HTMLElement
    this.success = new Success(successClone as HTMLElement, this.events)

    // Скрываем статические модальные окна
    this.hideStaticModals()
  }

  private setupEventHandlers(): void {
    // Обработчики корзины
    this.events.on('basket:changed', this.handleBasketChanged.bind(this))
    this.events.on('basket:remove', this.handleBasketRemove.bind(this))
    this.events.on('basket:add', this.handleBasketAdd.bind(this))

    // Обработчики заказа
    this.events.on('order:open', this.handleOrderOpen.bind(this))
    this.events.on('order:submit', this.handleOrderSubmit.bind(this))
    this.events.on('contacts:submit', this.handleContactsSubmit.bind(this))

    // Обработчики форм
    this.events.on('order.payment:change', this.handlePaymentChange.bind(this))
    this.events.on('order.address:change', this.handleAddressChange.bind(this))
    this.events.on('order.email:change', this.handleEmailChange.bind(this))
    this.events.on('order.phone:change', this.handlePhoneChange.bind(this))

    // Обработчики каталога
    this.events.on('catalog:updated', (data: { items: ICard[] }) => {
      this.catalogComponent.update(data.items)
    })

    // Обработчики модального окна
    this.events.on('modal:open', () => {
      document.body.classList.add('modal-open')
    })

    this.events.on('modal:close', () => {
      document.body.classList.remove('modal-open')
    })

    // Прочие обработчики
    this.events.on('success:close', this.handleSuccessClose.bind(this))
    this.events.on('card:select', this.handleCardSelect.bind(this))

    // Обработчик открытия корзины
    document.querySelector('.header__basket')?.addEventListener('click', () => {
      this.basket.updateBasket()
      this.modal.content = this.basket.getContainer()
      this.modal.open()
    })
  }

  private handleBasketChanged(): void {
    const counterElement = document.querySelector('.header__basket-counter')
    if (counterElement) {
      counterElement.textContent = this.basketModel.getCounter().toString()
    }
    this.basket.updateBasket()

    if (this.modal.isOpen() && this.modal.content === this.basket.getContainer()) {
      this.modal.content = this.basket.getContainer()
    }
  }

  private handleBasketRemove(data: { id: string }): void {
    this.basketModel.deleteCardToBasket(data.id)
  }

  private handleBasketAdd(data: ICard): void {
    this.basketModel.setSelectedCard(data)
  }

  private handleOrderOpen(): void {
    this.currentOrder = {
      ...this.createEmptyOrder(),
      items: Array.from(this.basketModel.items.keys()),
      total: this.basketModel.getSumAllProducts(),
    }

    this.orderForm.payment = this.currentOrder.payment
    this.orderForm.address = this.currentOrder.address || ''
    this.updateOrderFormValidity()

    this.modal.content = this.orderForm.getContainer()
    this.modal.open()
  }

  private handleOrderSubmit(): void {
    // Переходим к форме контактов
    this.currentOrder.email = ''
    this.currentOrder.phone = ''
    this.contactsForm.email = ''
    this.contactsForm.phone = ''

    // Сбрасываем ошибки
    this.contactsForm.setEmailError('')
    this.contactsForm.setPhoneError('')

    // Обновляем валидность формы
    this.updateContactsFormValidity()

    this.modal.content = this.contactsForm.getContainer()
  }

  private handleContactsSubmit(): void {
    // Проверяем валидность формы перед отправкой
    if (!this.validateContactsForm()) {
      this.contactsForm.errors = 'Пожалуйста, заполните все поля корректно'
      return
    }

    // Отправляем заказ на сервер
    this.api
      .postOrder(this.currentOrder)
      .then((result: unknown) => {
        const orderResult = result as IOrderResult
        // Показываем успешное оформление
        this.success.total = orderResult.total
        this.modal.content = this.success.getContainer()

        // Очищаем корзину
        this.basketModel.clearBasketProducts()
        this.currentOrder = this.createEmptyOrder()
      })
      .catch(error => {
        console.error('Ошибка оформления заказа:', error)
        this.contactsForm.errors = 'Ошибка оформления заказа. Попробуйте еще раз.'
      })
  }

  private handlePaymentChange(data: { payment: 'online' | 'offline' | null }): void {
    this.currentOrder.payment = data.payment
    this.updateOrderFormValidity()
  }

  private handleAddressChange(data: { address: string }): void {
    this.currentOrder.address = data.address
    this.updateOrderFormValidity()
  }

  private handleEmailChange(data: { email: string }): void {
    this.currentOrder.email = data.email

    // Валидация email
    const emailError = this.validateEmail(data.email)
    this.contactsForm.setEmailError(emailError)

    this.updateContactsFormValidity()
  }

  private handlePhoneChange(data: { phone: string }): void {
    this.currentOrder.phone = data.phone

    // Валидация телефона
    const phoneError = this.validatePhone(data.phone)
    this.contactsForm.setPhoneError(phoneError)

    this.updateContactsFormValidity()
  }

  private updateContactsFormValidity(): void {
    const isEmailValid = !this.validateEmail(this.currentOrder.email)
    const isPhoneValid = !this.validatePhone(this.currentOrder.phone)
    this.contactsForm.valid = isEmailValid && isPhoneValid
  }

  private handleSuccessClose(): void {
    this.modal.close()
  }

  private handleCardSelect(data: { card: ICard }): void {
    // Создаем модальное окно с предпросмотром карточки
    const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement
    if (!previewTemplate) return

    const previewElement = previewTemplate.content.cloneNode(true) as DocumentFragment
    const previewContainer = previewElement.firstElementChild as HTMLElement

    // Создаем экземпляр карточки для предпросмотра
    const card = new Card(previewContainer, this.events)
    card.setData(data.card)

    const button = previewContainer.querySelector('.button')
    if (button) {
      const newButton = button.cloneNode(true) as HTMLButtonElement
      button.parentNode?.replaceChild(newButton, button)

      // Проверяем, есть ли товар в корзине
      const inBasket = this.basketModel.checkProductInBasket(data.card.id)

      if (inBasket) {
        newButton.textContent = 'Убрать из корзины'
        newButton.addEventListener('click', () => {
          this.events.emit('basket:remove', { id: data.card.id })
          this.modal.close()
        })
      } else {
        newButton.textContent = 'В корзину'
        newButton.addEventListener('click', () => {
          this.events.emit('basket:add', data.card)
          this.modal.close()
        })
      }
    }
    this.modal.content = previewContainer
    this.modal.open()
  }

  private loadData(): void {
    this.api
      .getListProductCard()
      .then((cards: ICard[]) => {
        this.dataModel.catalog = cards
        this.events.emit('catalog:updated', { items: cards })
      })
      .catch(error => {
        console.error('Ошибка загрузки товаров:', error)
      })
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

  private hideStaticModals(): void {
    document.querySelectorAll('.modal').forEach(modalElement => {
      if (modalElement.id !== 'modal-container') {
        ;(modalElement as HTMLElement).style.display = 'none'
      }
    })
  }

  private updateOrderFormValidity(): void {
    const isValid = this.validateOrderForm()
    this.orderForm.valid = isValid
  }

  private validateOrderForm(): boolean {
    return Boolean(this.currentOrder.payment && this.currentOrder.address?.trim().length > 0)
  }

  private validateContactsForm(): boolean {
    const emailError = this.validateEmail(this.currentOrder.email)
    const phoneError = this.validatePhone(this.currentOrder.phone)

    return !emailError && !phoneError
  }

  private validateEmail(email: string): string {
    if (email.length === 0) {
      return 'Поле email обязательно для заполнения'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) && email.length > 0) {
      return 'Введите корректный email (например: example@mail.com)'
    }
    return ''
  }

  private validatePhone(phone: string): string {
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

  private isEmailValid(email: string): boolean {
    return this.validateEmail(email) === ''
  }

  private isPhoneValid(phone: string): boolean {
    return this.validatePhone(phone) === ''
  }
}
