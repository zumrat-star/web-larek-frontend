import { Component } from './component';
import { ensureElement } from '../../utils/utils';

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.handleEscape.bind(this));
    }

    close() {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keydown', this.handleEscape.bind(this));
    }

    private handleEscape(evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.close();
        }
    }

    private handleOutsideClick(evt: MouseEvent) {
        if (evt.target === this.container) {
            this.close();
        }
    }
}