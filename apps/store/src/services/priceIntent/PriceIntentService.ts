import { Persister, PriceIntent } from './priceIntent.types'
import { uuid } from './uuid'

type CreateParams = {
  // can be a bundle/product id
  productId: string
}

type FetchParams = {
  id: string
}

type AddDataParams = {
  id: string
  data: Record<string, string>
}

export class PriceIntentService {
  constructor(private readonly persister: Persister<PriceIntent>) {}

  public async create(_: CreateParams): Promise<PriceIntent> {
    const newPriceForm: PriceIntent = {
      id: uuid(),
      data: {},
      product: null,
    }

    this.persister.save({ id: newPriceForm.id, data: newPriceForm })

    return newPriceForm
  }

  public async fetch({ id }: FetchParams): Promise<PriceIntent | null> {
    return this.persister.fetch(id)
  }

  public async fetchLatest() {
    const formId = await this.persister.fetchLatest()
    return formId ? this.fetch({ id: formId }) : null
  }

  public async addData({ id, data }: AddDataParams) {
    const priceForm = await this.fetch({ id })

    if (!priceForm) {
      throw new Error(`Price form with id ${id} not found`)
    }

    const product =
      'numberCoInsured' in data
        ? { id: uuid(), price: Math.round(100 + Math.random() * 100) }
        : null

    this.persister.save({
      id,
      data: {
        ...priceForm,
        data: { ...priceForm.data, ...data },
        product,
      },
    })
  }

  public async reset() {
    this.persister.reset()
  }
}
