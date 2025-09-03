import { ApiModel } from './models/ApiModel'
import { BasketModel } from './models/BasketModel'
import { DataModel } from './models/DataModel'
import { FormModel } from './models/FormModel'
import { EventEmitter } from './components/base/events'
import { Modal } from './components/base/Modal'
import { Catalog } from './components/catalog'
import { Basket } from './components/basket'
import { OrderForm } from './components/orderForm'
import { ContactsForm } from './components/contactsForm'
import { Success } from './components/success'
import { Card } from './components/card'
import { CardPreview } from './components/cardPreview'
import { BasketItem } from './components/basketItem'
import { ICard, IOrderResult, IEvents } from './types'
import { API_URL, CDN_URL } from './utils/constants'

export class App {
  private events: IEvents
  private api: ApiModel
  private basketModel: BasketModel
  private dataModel: DataModel
  private formModel: FormModel
  private modal: Modal
  private basket: Basket
  private orderForm: OrderForm
  private contactsForm: ContactsForm
  private success: Success
  private catalogComponent: Catalog

  constructor() {
    this.events = new EventEmitter()
    this.api = new ApiModel(API_URL, CDN_URL)
    this.basketModel = new BasketModel(this.events)
    this.dataModel = new DataModel()
    this.formModel = new FormModel()

    this.initComponents()
    this.setupEventHandlers()
    this.loadData()
  }

  private initComponents(): void {
    // Инициализация модального окна (View)
    const modalContainer = document.getElementById('modal-container') as HTMLElement
    this.modal = new Modal(modalContainer, this.events)

    // Инициализация корзины (View)
    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement
    const basketClone = basketTemplate.content.cloneNode(true) as HTMLElement
    this.basket = new Basket(basketClone as HTMLElement, this.events)

    // Инициализация каталога (View)
    const catalogContainer = document.querySelector('.gallery') as HTMLElement
    this.catalogComponent = new Catalog(catalogContainer, this.events)

    // Инициализация форм (View)
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

    this.hideStaticModals()
  }

  private setupEventHandlers(): void {
    // Обработчики событий от Model
    this.events.on('basket:changed', this.handleBasketChanged.bind(this))
    this.formModel.on('form:changed', this.handleFormChanged.bind(this))

    // Обработчики событий от View
    this.events.on('basket:remove', this.handleBasketRemove.bind(this))
    this.events.on('basket:add', this.handleBasketAdd.bind(this))
    this.events.on('order:open', this.handleOrderOpen.bind(this))
    this.events.on('order:submit', this.handleOrderSubmit.bind(this))
    this.events.on('contacts:submit', this.handleContactsSubmit.bind(this))
    this.events.on('order.payment:change', this.handlePaymentChange.bind(this))
    this.events.on('order.address:change', this.handleAddressChange.bind(this))
    this.events.on('order.email:change', this.handleEmailChange.bind(this))
    this.events.on('order.phone:change', this.handlePhoneChange.bind(this))
    this.events.on('card:select', this.handleCardSelect.bind(this))
    this.events.on('success:close', this.handleSuccessClose.bind(this))

    // Обработчик изменения каталога в модели
    this.dataModel.on('catalog:changed', (data: { items: ICard[] }) => {
      const cardElements = data.items.map(card => this.createCardElement(card))
      this.catalogComponent.update(cardElements)
    })

    // Обработчики модального окна
    this.events.on('modal:open', () => {
      document.body.classList.add('modal-open')
    })

    this.events.on('modal:close', () => {
      document.body.classList.remove('modal-open')
    })

    // Обработчик открытия корзины
    document.querySelector('.header__basket')?.addEventListener('click', () => {
      this.updateBasketView()
      this.modal.content = this.basket.getContainer()
      this.modal.open()
    })
  }

  // Обработчики событий от Model
  private handleBasketChanged(): void {
    this.updateBasketView()
  }

  private handleFormChanged(): void {
    this.updateOrderFormValidity()
    this.updateContactsFormValidity()
  }

  // Обработчики событий от View
  private handleBasketRemove(data: { id: string }): void {
    this.basketModel.deleteCardToBasket(data.id)
  }

  private handleBasketAdd(data: ICard): void {
    this.basketModel.setSelectedCard(data)
  }

  private handleCardSelect(data: { id: string }): void {
    const card = this.dataModel.getProductById(data.id)
    if (!card) {
      console.error('Карточка не найдена:', data.id)
      return
    }

    const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement
    if (!previewTemplate) return

    const previewElement = previewTemplate.content.cloneNode(true) as DocumentFragment
    const previewContainer = previewElement.firstElementChild as HTMLElement

    // Создаем экземпляр CardPreview
    const cardPreview = new CardPreview(previewContainer, this.events)
    cardPreview.setData(card)

    // Настраиваем кнопку в зависимости от состояния корзины
    const inBasket = this.basketModel.checkProductInBasket(card.id)
    cardPreview.setupButton(
      inBasket,
      () => {
        this.events.emit('basket:add', card)
        this.modal.close()
      },
      () => {
        this.events.emit('basket:remove', { id: card.id })
        this.modal.close()
      }
    )

    this.modal.content = previewContainer
    this.modal.open()
  }

  private handleOrderOpen(): void {
    this.formModel.updateState({
      payment: null,
      email: '',
      phone: '',
      address: '',
      items: Array.from(this.basketModel.items.keys()),
      total: this.basketModel.getSumAllProducts(),
    })

    this.orderForm.payment = this.formModel.state.payment
    this.orderForm.address = this.formModel.state.address || ''
    this.updateOrderFormValidity()

    this.modal.content = this.orderForm.getContainer()
    this.modal.open()
  }

  private handleOrderSubmit(): void {
    const orderValidation = this.formModel.validateOrderForm()
    if (!orderValidation.isValid) {
      this.orderForm.errors = orderValidation.errors.join(', ')
      return
    }

    // Переходим к форме контактов
    this.formModel.updateState({
      email: '',
      phone: '',
    })

    this.contactsForm.email = ''
    this.contactsForm.phone = ''
    this.contactsForm.setEmailError('')
    this.contactsForm.setPhoneError('')
    this.updateContactsFormValidity()

    this.modal.content = this.contactsForm.getContainer()
  }

  private handleContactsSubmit(): void {
    const contactsValidation = this.formModel.validateContactsForm()
    if (!contactsValidation.isValid) {
      this.contactsForm.errors = 'Пожалуйста, заполните все поля корректно'
      return
    }

    // Отправляем заказ на сервер
    this.api
      .postOrder(this.formModel.state)
      .then((result: unknown) => {
        const orderResult = result as IOrderResult
        this.success.total = orderResult.total
        this.modal.content = this.success.getContainer()
        this.basketModel.clearBasketProducts()
        this.formModel.resetState()
      })
      .catch(error => {
        console.error('Ошибка оформления заказа:', error)
        this.contactsForm.errors = 'Ошибка оформления заказа. Попробуйте еще раз.'
      })
  }

  private handlePaymentChange(data: { payment: 'online' | 'offline' | null }): void {
    this.formModel.updateState({ payment: data.payment })
  }

  private handleAddressChange(data: { address: string }): void {
    this.formModel.updateState({ address: data.address })
  }

  private handleEmailChange(data: { email: string }): void {
    this.formModel.updateState({ email: data.email })
    const emailError = this.formModel.validateEmail(data.email)
    this.contactsForm.setEmailError(emailError)
  }

  private handlePhoneChange(data: { phone: string }): void {
    this.formModel.updateState({ phone: data.phone })
    const phoneError = this.formModel.validatePhone(data.phone)
    this.contactsForm.setPhoneError(phoneError)
  }

  private handleSuccessClose(): void {
    this.modal.close()
  }

  // Вспомогательные методы
  private createCardElement(card: ICard): HTMLElement {
    const template = document.getElementById('card-catalog') as HTMLTemplateElement
    const element = template.content.cloneNode(true) as DocumentFragment
    const container = element.firstElementChild as HTMLElement

    const cardComponent = new Card(container, this.events)
    cardComponent.setData(card)

    return container
  }

  private createBasketItemElement(item: ICard, index: number): HTMLElement {
    const template = document.getElementById('card-basket') as HTMLTemplateElement
    const element = template.content.cloneNode(true) as DocumentFragment
    const container = element.firstElementChild as HTMLElement
    container.setAttribute('data-id', item.id)

    new BasketItem(container, this.events, item, index)

    return container
  }

  private updateBasketView(): void {
    const items = Array.from(this.basketModel.items.values())
    const total = this.basketModel.getSumAllProducts()

    // Обновляем счетчик
    const counterElement = document.querySelector('.header__basket-counter')
    if (counterElement) {
      counterElement.textContent = this.basketModel.getCounter().toString()
    }

    // Создаем элементы корзины
    const basketItemElements = items.map((item, index) => this.createBasketItemElement(item, index))

    // Обновляем корзину
    this.basket.updateBasket(basketItemElements, total)
  }

  private updateContactsFormValidity(): void {
    const validation = this.formModel.validateContactsForm()
    this.contactsForm.valid = validation.isValid

    // Устанавливаем ошибки для отдельных полей
    this.contactsForm.setEmailError(validation.errors.email)
    this.contactsForm.setPhoneError(validation.errors.phone)
  }

  private updateOrderFormValidity(): void {
    const validation = this.formModel.validateOrderForm()
    this.orderForm.valid = validation.isValid

    if (!validation.isValid) {
      this.orderForm.errors = validation.errors.join(', ')
    } else {
      this.orderForm.errors = ''
    }
  }

  private loadData(): void {
    this.api
      .getListProductCard()
      .then((cards: ICard[]) => {
        this.dataModel.catalog = cards
      })
      .catch(error => {
        console.error('Ошибка загрузки товаров:', error)
      })
  }

  private hideStaticModals(): void {
    document.querySelectorAll('.modal').forEach(modalElement => {
      if (modalElement.id !== 'modal-container') {
        ;(modalElement as HTMLElement).style.display = 'none'
      }
    })
  }
}
