import { Component } from './base/component'
import { IEvents } from '../types'
import { ensureElement } from '../utils/utils'
import { IFormState } from '../types'

export abstract class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement
    protected _errors: HTMLElement
    protected _form: HTMLFormElement

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container)
        this._form = container
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', container)
        this._errors = ensureElement<HTMLElement>('.form__errors', container)

        this.setInputHandlers()
    }

    protected setInputHandlers(): void {
        const inputs = this._form.querySelectorAll('input[name]')
        inputs.forEach(input => {
            const inputElement = input as HTMLInputElement
            inputElement.addEventListener('input', () => {
                this.onInputChange(inputElement.name as keyof T, inputElement.value)
            })
        })
    }

    protected onInputChange(field: keyof T, value: string): void {
        const formId = this._form.id || 'form'
        this.events.emit(`${formId}.${String(field)}:change`, {
            field,
            value
        })
    }

    set valid(value: boolean) {
        this.setDisabled(this._submit, !value)
    }

    set errors(value: string) {
        this.setText(this._errors, value)
    }

    render(): HTMLElement {
        return this.container
    }
}