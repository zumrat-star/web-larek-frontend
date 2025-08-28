# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Мы проектируем приложение с использованием паттерна MVP (Model-View-Presenter). 
 Паттерн MVP разделяет приложение на три основных слоя:
 1. Model (Модель) - отвечает за данные и бизнес-логику. 
    В нашем случае это классы, которые представляют товары, корзину, заказы, а также классы для работы с API.
 2. View (Представление) - отвечает за отображение данных и взаимодействие с пользователем. 
    Это классы, которые управляют отображением товаров, корзины, модальных окон и т.д.
 3. Presenter (Презентер) - посредник между Model и View. 
    Он обрабатывает пользовательские события, обновляет модель и обновляет представление.
 За что отвечает каждый слой:
 - Model: 
   * Хранение данных (товары, корзина, заказы)
   * Валидация данных
   * Логика работы с данными (добавление в корзину, оформление заказа)
 - View:
   * Отображение данных (рендеринг товаров, корзины, модальных окон)
   * Передача пользовательских событий презентеру (клик на товар, добавление в корзину, оформление заказа)
 - Presenter:
   * Обработка событий от View
   * Запрос данных из Model
   * Обновление View в ответ на изменения данных
   * Оркестрация бизнес-логики


## Архитектура и описание

1. Model (Модель)
Отвечает за данные и бизнес-логику. Включает классы:

ApiModel - работа с API сервера
BasketModel - управление корзиной покупок
DataModel - хранение данных о товарах

2. View (Представление)
Отвечает за отображение данных и взаимодействие с пользователем.

Отвечает за отображение данных и взаимодействие с пользователем. Включает компоненты:

Catalog - каталог товаров
Card - карточка товара
Basket - корзина покупок
OrderForm - форма оформления заказа
ContactsForm - форма контактов
Modal - модальное окно
Success - уведомление об успешном заказе

3. Presenter (Презентер)
Связующий слой между Model и View, реализованный в основном классе приложения App. Отвечает за:

Обработку пользовательских событий
Обновление моделей
Обновление представлений
Координацию бизнес-логики

### Базовые классы

#### Component 
**Назначение:** Базовый класс для всех компонентов приложения, предоставляющий общую функциональность для работы с DOM-элементами.
**Поля**  container: HTMLElement - DOM-элемент, являющийся контейнером компонента
**Методы**:
constructor(container: HTMLElement) - инициализация компонента
setText(element: HTMLElement, value: string) - установка текстового содержимого элемента
setDisabled(element: HTMLButtonElement, state: boolean) - установка состояния disabled для кнопки
render(): HTMLElement - основной метод рендеринга компонента

#### Form
**Назначение**: Базовый класс для всех форм в приложении, обеспечивающий базовую функциональность валидации и управления состоянием.
**Поля**
_submit: HTMLButtonElement - кнопка отправки формы
_errors: HTMLElement - контейнер для отображения ошибок
_form: HTMLFormElement - элемент формы
**Методы:**
constructor(container: HTMLFormElement, events: IEvents) - инициализация формы
setInputHandlers() - установка обработчиков изменения полей ввода
set valid(value: boolean) - установка валидности формы
set errors(value: string) - установка текста ошибок

#### EventEmitter
**Назначение:** Реализация паттерна "Наблюдатель" для организации взаимодействия между компонентами через систему событий.
**Поля:** _events: Map<EventName, Set<Subscriber>> - карта событий и подписчиков
**Методы:**
on<T extends object>(eventName: EventName, callback: (data: T) => void) - подписка на событие
off(eventName: EventName, callback: Subscriber) - отмена подписки на событие
emit<T extends object>(eventName: string, data?: T) - генерация события
onAll(callback: (event: EmitterEvent) => void) - подписка на все события
offAll() - отмена всех подписок
trigger<T extends object>(eventName: string, context?: Partial<T>) - создание триггера события

### Модели (Models)

#### ApiModel
**Назначение:** Работа с API сервера для получения данных о товарах и оформления заказов.
**Поля:** cdn: string - базовый URL CDN для загрузки изображений
**Методы:**
getListProductCard(): Promise<ICard[]> - получение списка товаров
postOrder(order: IOrder): Promise<IOrderResult> - отправка заказа на сервер
getProductItem(id: string): Promise<ICard> - получение информации о конкретном товаре
updateProductItem(id: string, data: Partial<ICard>): Promise<ICard> - обновление информации о товаре
deleteProductItem(id: string): Promise<void> - удаление товара

#### BasketModel
**Назначение:** Управление состоянием корзины покупок.
**Поля:**_items: Map<string, ICard> - хранилище товаров в корзине
**Методы:**
get items(): ReadonlyMap<string, ICard> - получение всех товаров в корзине
getCounter(): number - получение количества товаров в корзине
getSumAllProducts(): number - расчет общей стоимости товаров в корзине
setSelectedCard(card: ICard): void - добавление товара в корзину
deleteCardToBasket(id: string): boolean - удаление товара из корзины
clearBasketProducts(): void - очистка корзины
checkProductInBasket(id: string): boolean - проверка наличия товара в корзине

#### DataModel
**Назначение:** Хранение данных приложения и управление состоянием.
**Поля:**
_catalog: ICard[] - массив товаров в каталоге
_preview: string | null - ID товара для предпросмотра
**Методы:**
get catalog(): ICard[] - получение каталога товаров
set catalog(items: ICard[]) - установка каталога товаров
get preview(): string | null - получение ID товара для предпросмотра
set preview(id: string | null) - установка ID товара для предпросмотра
getProductById(id: string): ICard | undefined - получение товара по ID
getPreviewProduct(): ICard | undefined - получение товара для предпросмотра
clearPreview(): void - очистка предпросмотра

### Компоненты представления (View Components)

#### Modal
**Назначение:** Универсальное модальное окно для отображения различного контента.
**Поля:**
_closeButton: HTMLButtonElement - кнопка закрытия модального окна
_content: HTMLElement - контейнер для контента
_container: HTMLElement - основной контейнер модального окна
**Методы:**
set content(value: HTMLElement) - установка содержимого модального окна
open(): void - открытие модального окна
close(): void - закрытие модального окна
isOpen(): boolean - проверка, открыто ли модальное окно
handleOverlayClick(event: MouseEvent): void - обработчик клика по оверлею
handleKeyDown(event: KeyboardEvent): void - обработчик нажатия клавиш

#### Catalog
**Назначение:** Отображение каталога товаров на главной странице.
**Поля:**
_cards: ICard[] - массив товаров для отображения
_cardInstances: Card[] - экземпляры карточек товаров
**Методы:**
update(cards: ICard[]): void - обновление каталога товаров
renderItems(): void - отрисовка товаров в каталоге

#### Card
**Назначение:** Отображение карточки товара в каталоге и в режиме предпросмотра.
**Поля:**
_categoryElement: HTMLSpanElement | null - элемент категории товара
_titleElement: HTMLHeadingElement | null - элемент названия товара
_imageElement: HTMLImageElement | null - элемент изображения товара
_priceElement: HTMLSpanElement | null - элемент цены товара
_buttonElement: HTMLButtonElement | null - кнопка действия
_textElement: HTMLParagraphElement | null - элемент описания товара
_events: IEvents | null - ссылка на систему событий
**Методы:**
setData(data: ICard): void - установка данных товара
set category(value: string) - установка категории товара
set title(value: string) - установка названия товара
set image(value: string) - установка изображения товара
set price(value: number) - установка цены товара
set buttonText(value: string) - установка текста кнопки
set buttonDisabled(state: boolean) - установка состояния кнопки
set text(value: string) - установка описания товара

#### Basket
**Назначение:** Отображение и управление корзиной покупок.
**Поля:**
_list: HTMLElement - список товаров в корзине
_total: HTMLElement - элемент общей стоимости
_button: HTMLButtonElement - кнопка оформления заказа
**Методы:**
updateBasket(): void - обновление отображения корзины
renderItems(items: ICard[]): void - отрисовка товаров в корзине
set total(value: number) - установка общей стоимости
set buttonState(disabled: boolean) - установка состояния кнопки оформления заказа

#### OrderForm
**Назначение:** Форма выбора способа оплаты и ввода адреса доставки.
**Поля:**
_paymentButtons: HTMLButtonElement[] - кнопки выбора способа оплаты
_addressInput: HTMLInputElement - поле ввода адреса
**Методы:**
set payment(value: 'online' | 'offline' | null) - установка способа оплаты
set address(value: string) - установка адреса доставки
get address(): string - получение адреса доставки

#### ContactsForm
**Назначение:** Форма ввода контактных данных (email и телефон).
**Поля:**
_emailInput: HTMLInputElement - поле ввода email
_phoneInput: HTMLInputElement - поле ввода телефона
_emailError: HTMLElement - элемент ошибки для email
_phoneError: HTMLElement - элемент ошибки для телефона
**Методы:**
set email(value: string) - установка email
get email(): string - получение email
set phone(value: string) - установка телефона
get phone(): string - получение телефона
setEmailError(message: string): void - установка ошибки для email
setPhoneError(message: string): void - установка ошибки для телефона

#### Success
**Назначение:** Отображение уведомления об успешном оформлении заказа.
**Поля:**
_closeButton: HTMLButtonElement - кнопка закрытия уведомления
_totalElement: HTMLElement - элемент отображения общей стоимости
**Методы:**
set total(value: number) - установка общей стоимости заказа

### Презентер (Presenter)

#### App
**Назначение:** Главный класс приложения, реализующий логику презентера и координирующий взаимодействие между моделями и представлениями.
**Поля:**
events: IEvents - система событий
api: ApiModel - модель для работы с API
basketModel: IBasketModel - модель корзины
dataModel: DataModel - модель данных
modal: Modal - модальное окно
basket: Basket - компонент корзины
orderForm: OrderForm - форма заказа
contactsForm: ContactsForm - форма контактов
success: Success - компонент успешного заказа
currentOrder: IOrder - текущий заказ
catalogComponent: Catalog - компонент каталога
**Методы:**
constructor() - инициализация приложения
initComponents(): void - инициализация компонентов
setupEventHandlers(): void - настройка обработчиков событий
handleBasketChanged(): void - обработчик изменения корзины
handleBasketRemove(data: { id: string }): void - обработчик удаления из корзины
handleBasketAdd(data: ICard): void - обработчик добавления в корзину
handleOrderOpen(): void - обработчик открытия заказа
handleOrderSubmit(): void - обработчик отправки заказа
handleContactsSubmit(): void - обработчик отправки контактов
handlePaymentChange(data: { payment: 'online' | 'offline' | null }): void - обработчик изменения способа оплаты
handleAddressChange(data: { address: string }): void - обработчик изменения адреса
handleEmailChange(data: { email: string }): void - обработчик изменения email
handlePhoneChange(data: { phone: string }): void - обработчик изменения телефона
handleSuccessClose(): void - обработчик закрытия уведомления
handleCardSelect(data: { card: ICard }): void - обработчик выбора карточки товара
loadData(): void - загрузка данных
createEmptyOrder(): IOrder - создание пустого заказа
hideStaticModals(): void - скрытие статических модальных окон
updateOrderFormValidity(): void - обновление валидности формы заказа
updateContactsFormValidity(): void - обновление валидности формы контактов
validateOrderForm(): boolean - валидация формы заказа
validateContactsForm(): boolean - валидация формы контактов
validateEmail(email: string): string - валидация email
validatePhone(phone: string): string - валидация телефона

### Утилиты

#### ensureElement
**Назначение:** Безопасное получение DOM-элемента с проверкой его существования.

#### formatPhoneNumber
**Назначение:** Форматирование номера телефона в единый формат.

#### ensureAllElements
**Назначение:** Безопасное получение всех DOM-элементов по селектору.

#### cloneTemplate
**Назначение:** Клонирование HTML-шаблона.

## Детальное описание взаимодействий

1. Инициализация приложения

typescript
// App.ts
constructor() {
  this.events = new EventEmitter();
  this.api = new ApiModel(API_URL, CDN_URL);
  this.basketModel = new BasketModel(this.events);
  this.dataModel = new DataModel();
  
  this.initComponents();
  this.setupEventHandlers();
  this.loadData();
}
Создается экземпляр EventEmitter для управления событиями
Инициализируются модели: ApiModel, BasketModel, DataModel
Инициализируются компоненты представления
Настраиваются обработчики событий
Загружаются данные о товарах
2. Загрузка данных о товарах

typescript
// App.ts
private loadData(): void {
  this.api.getListProductCard()
    .then((cards: ICard[]) => {
      this.dataModel.catalog = cards;
      this.events.emit('catalog:updated', { items: cards });
    });
}
App запрашивает данные через ApiModel
ApiModel выполняет HTTP-запрос к серверу
Полученные данные сохраняются в DataModel
Генерируется событие catalog:updated
Catalog компонент подписан на это событие и обновляет отображение
3. Добавление товара в корзину

text
Пользователь → Card → EventEmitter → App → BasketModel → EventEmitter → Header/Basket
Пользователь нажимает на кнопку в карточке товара
Card генерирует событие card:select с данными товара
App обрабатывает событие и создает модальное окно предпросмотра
В модальном окне пользователь нажимает "В корзину"
Генерируется событие basket:add с данными товара
App обрабатывает событие и вызывает basketModel.setSelectedCard()
BasketModel обновляет свое состояние и генерирует событие basket:changed
App обрабатывает событие и обновляет счетчик в Header и содержимое Basket
4. Открытие и управление корзиной

text
Пользователь → Header → EventEmitter → App → Basket → Modal
Пользователь нажимает на иконку корзины в Header
Header генерирует событие (обрабатывается через прямую подписку в App)
App обновляет данные в Basket компоненте
App открывает Modal с содержимым Basket
В корзине пользователь может удалять товары, что генерирует события basket:remove
App обрабатывает эти события и обновляет BasketModel и представление
5. Оформление заказа

text
Пользователь → Basket → EventEmitter → App → OrderForm → ContactsForm → ApiModel → Success
Пользователь нажимает "Оформить" в корзине
Basket генерирует событие order:open
App обрабатывает событие, подготавливает данные и открывает OrderForm
Пользователь заполняет данные о способе оплаты и адресе
При изменении полей генерируются события order.payment:change и order.address:change
App валидирует данные и обновляет состояние кнопки "Далее"
При нажатии "Далее" генерируется событие order:submit
App обрабатывает событие и открывает ContactsForm
Пользователь заполняет контактные данные
При изменении полей генерируются события order.email:change и order.phone:change
App валидирует данные и обновляет состояние кнопки "Оплатить"
При нажатии "Оплатить" генерируется событие contacts:submit
App обрабатывает событие, формирует заказ и отправляет через ApiModel.postOrder()
При успешном ответе открывается Success компонент
6. Валидация данных

text
View → EventEmitter → App → View
Поля ввода в формах генерируют события при изменении
App получает эти события и выполняет валидацию
App вызывает методы setEmailError() и setPhoneError() у ContactsForm для отображения ошибок
App устанавливает свойство valid форм для управления состоянием кнопок
7. Управление модальными окнами

text
Пользователь → Modal/View → EventEmitter → App → Modal
Пользователь взаимодействует с элементами, требующими открытия модальных окон
Генерируются соответствующие события
App обрабатывает события и устанавливает содержимое для Modal
App вызывает методы open() или close() у Modal
Modal самостоятельно обрабатывает клики по оверлею и клавишу Escape
8. Система событий

Центральным элементом взаимодействия является EventEmitter, который обеспечивает слабую связанность компонентов:

typescript
// Подписка на события
this.events.on('basket:changed', this.handleBasketChanged.bind(this));

// Генерация событий
this.events.emit('catalog:updated', { items: cards });