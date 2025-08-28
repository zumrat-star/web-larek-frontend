import { Component } from './component'
import { ensureElement } from '../../utils/utils'
import { IModal } from '../../types'
import { IEvents } from '../../types'

export class Modal extends Component<IModal> {
  protected _closeButton: HTMLButtonElement
  protected _content: HTMLElement
  protected _container: HTMLElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    // Находим элементы модального окна
    this._container = ensureElement<HTMLElement>('.modal__container', container)
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container)
    this._content = ensureElement<HTMLElement>('.modal__content', container)

    // Обработчики событий
    this._closeButton.addEventListener('click', this.close.bind(this))
    this.container.addEventListener('click', this.handleOverlayClick.bind(this))
    this.container.addEventListener('submit', event => {
      event.preventDefault()
      event.stopPropagation()
    })

    // Предотвращаем закрытие при клике на контент
    this._content.addEventListener('click', event => event.stopPropagation())

    // Закрытие по клавише Esc
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  // Установка контента модального окна
  set content(value: HTMLElement | null) {
    this._content.innerHTML = ''
    if (value) {
      this._content.appendChild(value)
    }
  }

  // Открытие модального окна
  open(): void {
    this.container.classList.add('modal_active')
    this.events.emit('modal:open')
  }

  // Закрытие модального окна
  close(): void {
    this.container.classList.remove('modal_active')
    this.content = null
    this.events.emit('modal:close')
  }

  isOpen(): boolean {
    return this.container.classList.contains('modal_active')
  }

  // Обработка клика по оверлею
  protected handleOverlayClick(event: MouseEvent): void {
    if (event.target === this.container) {
      this.close()
    }
  }

  // Обработка нажатия клавиш
  protected handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.container.classList.contains('modal_active')) {
      this.close()
    }
  }

  // Рендер модального окна
  render(data?: IModal): HTMLElement {
    if (data?.content) {
      this.content = data.content
    }
    return this.container
  }
}
