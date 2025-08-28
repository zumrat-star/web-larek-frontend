import { Api, ApiListResponse } from '../components/base/api'
import { ICard, IOrder, IOrderResult } from '../types'

export class ApiModel extends Api {
  readonly cdn: string

  constructor(baseUrl: string, cdn: string, options: RequestInit = {}) {
    super(baseUrl, options)
    this.cdn = cdn
  }

  // Получение списка товаров
  async getListProductCard(): Promise<ICard[]> {
    const response = (await this.get('/product')) as ApiListResponse<ICard>
    return response.items.map(item => ({
      ...item,
      image: this.cdn + item.image,
    }))
  }

  // Отправка заказа
  async postOrder(order: IOrder): Promise<IOrderResult> {
    const response = await fetch(`${this.baseUrl}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`)
    }

    return this.post('/order', order) as Promise<IOrderResult>
  }

  // Получение информации о конкретном товаре
  async getProductItem(id: string): Promise<ICard> {
    const item = (await this.get(`/product/${id}`)) as ICard
    return {
      ...item,
      image: this.cdn + item.image,
    }
  }

  // Обновление товара
  async updateProductItem(id: string, data: Partial<ICard>): Promise<ICard> {
    const item = (await this.post(`/product/${id}`, data, 'PUT')) as ICard
    return {
      ...item,
      image: this.cdn + item.image,
    }
  }

  // Удаление товара
  async deleteProductItem(id: string): Promise<void> {
    await this.post(`/product/${id}`, {}, 'DELETE')
  }
}
