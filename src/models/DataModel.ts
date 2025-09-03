import { EventEmitter } from '../components/base/events'
import { ICard } from '../types/index'

export class DataModel extends EventEmitter {
  private _catalog: ICard[] = []
  private _preview: string | null = null

  get catalog(): ICard[] {
    return this._catalog
  }

  set catalog(items: ICard[]) {
    this._catalog = items
    this.emit('catalog:changed', { items: this._catalog })
  }

  get preview(): string | null {
    return this._preview
  }

  set preview(id: string | null) {
    this._preview = id
    this.emit('preview:changed', { id: this._preview })
  }

  getProductById(id: string): ICard | undefined {
    return this._catalog.find(item => item.id === id)
  }

  getPreviewProduct(): ICard | undefined {
    return this._preview ? this.getProductById(this._preview) : undefined
  }

  clearPreview(): void {
    this.preview = null
  }
}