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
    return await this.post('/order', order) as Promise<IOrderResult>
  }

  // Получение информации о конкретном товаре
  async getProductItem(id: string): Promise<ICard> {
    const item = (await this.get(`/product/${id}`)) as ICard
    return {
      ...item,
      image: this.cdn + item.image,
    }
  }
}