import { Component } from './base/component'
import { EventEmitter } from './base/events'
import { ensureElement } from '../utils/utils'

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export abstract class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected _form: HTMLFormElement;

    constructor(container: HTMLFormElement, protected events: EventEmitter) {
        super(container);
        this._form = container;
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        // Настраиваем обработчики для полей ввода
        this.setInputHandlers();
    }

    protected setInputHandlers() {
        const inputs = this._form.querySelectorAll('input[name]');
        inputs.forEach(input => {
            const inputElement = input as HTMLInputElement;
            inputElement.addEventListener('input', () => {
                this.onInputChange(inputElement.name as keyof T, inputElement.value);
            });
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        // Используем ID формы или создаем универсальный идентификатор
        const formId = this._form.id || 'form';
        this.events.emit(`${formId}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.setDisabled(this._submit, !value);
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(): HTMLElement {
        return this.container;
    }
}
