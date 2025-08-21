import { ApiModel } from './models/ApiModel';
import { BasketModel } from './models/BasketModel';
import { EventEmitter } from './components/base/events';
import { ICard } from './types';
import { Modal } from './components/base/Modal';
import { DataModel } from './models/DataModel';
import { API_URL, CDN_URL } from './utils/constants';
import { Catalog } from './components/catalog';
import { Basket } from './components/basket';

const events = new EventEmitter();
const api = new ApiModel(API_URL, CDN_URL);
const basketModel = new BasketModel();
const dataModel = new DataModel();

// Инициализация компонентов
const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const catalogComponent = new Catalog(catalogContainer, events);

// Инициализация модального окна
const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(modalContainer);

// Инициализация корзины
const basketContainer = document.querySelector('.basket') as HTMLElement;
const basketComponent = new Basket(basketContainer, events);

// Скрываем все статические модальные окна
document.querySelectorAll('.modal').forEach(modalElement => {
    if (modalElement.id !== 'modal-container') {
        (modalElement as HTMLElement).style.display = 'none';
    }
});

// Загрузка данных
api.getListProductCard()
    .then((cards: ICard[]) => {
        dataModel.catalog = cards;
        catalogComponent.update(cards);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });

// Обработка событий
events.on('card:select', (data: { card: ICard }) => {
    basketModel.setSelectedCard(data.card);
});

events.on('basket:changed', () => {
    const counterElement = document.querySelector('.header__basket-counter');
    if (counterElement) {
        counterElement.textContent = basketModel.getCounter().toString();
    }
    
    // Обновляем корзину
    basketComponent.items = Array.from(basketModel.items.values());
    basketComponent.total = basketModel.getSumAllProducts();
    basketComponent.buttonState = basketModel.getCounter() === 0;
});

events.on('basket:remove', (data: { id: string }) => {
    basketModel.deleteCardToBasket(data.id);
});

// Обработка открытия корзины
document.querySelector('.header__basket')?.addEventListener('click', () => {
    modal.content = basketContainer;
    modal.open();
});