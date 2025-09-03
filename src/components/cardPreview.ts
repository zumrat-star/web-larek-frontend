import { Card } from './card';
import { ICard, IEvents } from '../types';

export class CardPreview extends Card {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
  }

  // Устанавливает состояние кнопки в зависимости от наличия товара в корзине
  setupButton(inBasket: boolean, onAdd: () => void, onRemove: () => void): void {
    if (!this._buttonElement) return;
    
    if (inBasket) {
      this._buttonElement.textContent = 'Убрать из корзины';
      this._buttonElement.onclick = (e) => {
        e.preventDefault();
        onRemove();
      };
    } else {
      this._buttonElement.textContent = 'В корзину';
      this._buttonElement.onclick = (e) => {
        e.preventDefault();
        onAdd();
      };
    }
  }

  setDescription(description: string): void {
    if (this._textElement) {
      this.setText(this._textElement, description);
    }
  }

  // Метод для установки всех данных карточки, включая описание
  setPreviewData(data: ICard): void {
    this.setData(data);
    if (data.description) {
      this.setDescription(data.description);
    }
  }
}