export class Component<T> {
  protected container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  protected setText(element: HTMLElement, value: string) {
    element.textContent = value
  }

  protected setDisabled(element: HTMLButtonElement, state: boolean) {
    element.disabled = state
  }

  render(): HTMLElement {
    return this.container
  }

  getContainer(): HTMLElement {
    return this.container
  }
}
