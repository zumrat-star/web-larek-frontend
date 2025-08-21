

export interface ICard {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface ICardView extends ICard {
    inBasket: boolean;
}

export interface IContacts {
    email: string;
    phone: string;
}

export interface IEvents {
    [event: string]: (data?: any) => void;
}

export interface IApi {
    getLotList: () => Promise<ICard[]>;
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export interface IOrderForm {
    payment: 'online' | 'offline' | null;
    address: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export interface IUIState {
    disabled: boolean;
}

export interface IModalData {
    content: HTMLElement;
}

export interface IBasketData {
    items: ICard[];
    total: number;
}

export interface IFormFieldEvent {
    field: string;
    value: string;
}

export interface ICardSelectEvent {
    card: ICard;
}

export interface IBasketEvent {
    card: ICard;
}

export interface IBasketRemoveEvent {
    id: string;
}