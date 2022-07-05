import { uuid } from '@/components/PriceCalculator/uuid'
import { Persister, PriceForm } from './priceForm.types'

type CreateParams = {
  // can be a bundle/product id
  product: string
}

type FetchParams = {
  id: string
}

type AddDataParams = {
  id: string
  data: Record<string, string>
}

export class PriceFormService {
  constructor(private readonly persister: Persister<PriceForm>) {}

  public async create({ product }: CreateParams): Promise<PriceForm> {
    const newPriceForm: PriceForm = {
      id: uuid(),
      data: {},
      product: { id: product },
      priceQuote: null,
    }

    this.persister.save({ id: newPriceForm.id, data: newPriceForm })

    return newPriceForm
  }

  public async fetch({ id }: FetchParams): Promise<PriceForm | null> {
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

    const priceQuote =
      'subType' in data ? { id: uuid(), price: Math.round(100 + Math.random() * 100) } : null

    this.persister.save({
      id,
      data: {
        ...priceForm,
        data: { ...priceForm.data, ...data },
        priceQuote,
      },
    })
  }

  public async reset() {
    this.persister.reset()
  }
}
