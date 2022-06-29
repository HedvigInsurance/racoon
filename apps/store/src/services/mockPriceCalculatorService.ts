import { uuid } from '@/components/PriceCalculator/uuid'

export type PriceQuote = { id: string; price: number }

export type QuoteForm = {
  id: string
  data: Record<string, string>
  product: { id: string }
  priceQuote: null | PriceQuote
}

const PRICE_FORMS: Record<string, QuoteForm> = {}

type CreateParams = {
  // can be a bundle/product id
  product: string
}

export const create = async ({ product }: CreateParams): Promise<QuoteForm> => {
  const newPriceForm: QuoteForm = {
    id: uuid(),
    data: {},
    product: { id: product },
    priceQuote: null,
  }

  PRICE_FORMS[newPriceForm.id] = newPriceForm

  return newPriceForm
}

type FetchParams = {
  id: string
}

export const fetch = async ({ id }: FetchParams): Promise<QuoteForm | null> => {
  return PRICE_FORMS[id] ?? null
}

type AddDataParams = {
  id: string
  data: Record<string, string>
}

export const addData = async ({ id, data }: AddDataParams) => {
  const priceForm = PRICE_FORMS[id]

  if (!priceForm) {
    throw new Error(`Price form with id ${id} not found`)
  }

  PRICE_FORMS[id] = {
    ...priceForm,
    data: { ...priceForm.data, ...data },
    priceQuote: { id: uuid(), price: Math.round(100 + Math.random() * 100) },
  }
}
