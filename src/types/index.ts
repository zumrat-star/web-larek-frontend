export type EventName = string | RegExp
export type Subscriber = Function

export interface ICard {
  id: string
  title: string
  description: string
  image: string
  category: string
  price: number | null
}

export interface IFormState {
  valid: boolean
  errors: string
}

export interface IOrderForm extends IFormState {
  payment: 'online' | 'offline' | null
  address: string
}

export interface IContactsForm extends IFormState {
  email: string
  phone: string
}

export interface IOrder {
  payment: 'online' | 'offline' | null
  email: string
  phone: string
  address: string
  total: number
  items: string[]
}

export interface IOrderResult {
  id: string
  total: number
}

export interface ISuccess {
  total: number
}

export interface IBasketModel extends IEvents {
  items: ReadonlyMap<string, ICard>
  getCounter(): number
  getSumAllProducts(): number
  setSelectedCard(card: ICard): void
  deleteCardToBasket(id: string): void
  clearBasketProducts(): void
  checkProductInBasket(id: string): boolean
}

export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void
  emit<T extends object>(event: string, data?: T): void
  off(eventName: EventName, callback: Subscriber): void
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void
}

export interface IApi {
  getListProductCard: () => Promise<ICard[]>
  getProductCard: (id: string) => Promise<ICard>
  orderLots: (order: IOrder) => Promise<IOrderResult>
}

export interface IModal {
  content: HTMLElement
  open: () => void
  close: () => void
}

export interface IBasketRemoveEvent {
  id: string
}

export interface ICardSelectEvent {
  id: string
}
