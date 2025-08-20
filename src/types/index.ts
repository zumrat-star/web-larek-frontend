/**
 * Интерфейс данных карточки товара
 */
export interface ICard {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

/**
 * Интерфейс контактных данных пользователя
 */
export interface IContacts {
  email: string;
  phone: string;
}

/**
 * Интерфейс данных заказа
 */
export interface IOrder extends IContacts {
  items: string[]; // массив ID товаров
  total: number;
  address: string;
  payment: 'online' | 'offline';
}

/**
 * Интерфейс ответа сервера на успешный заказ
 */
export interface IOrderResult {
  id: string;
  total: number;
}

/**
 * Интерфейс для событий приложения
 * Ключ - название события, значение - callback функция
 */
export interface IEvents {
  [event: string]: (data?: any) => void;
}

/**
 * Интерфейс для API методов
 */
export interface IApi {
  getLotList: () => Promise<ICard[]>;
  orderLots: (order: IOrder) => Promise<IOrderResult>;
}

/**
 * Интерфейс для данных формы заказа
 */
export interface IOrderForm {
  payment: 'online' | 'offline' | null;
  address: string;
}

/**
 * Интерфейс для данных формы контактов
 */
export interface IContactsForm {
  email: string;
  phone: string;
}

/**
 * Интерфейс для результатов валидации
 */
export interface IValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Интерфейс для состояния UI элементов
 */
export interface IUIState {
  disabled: boolean;
}