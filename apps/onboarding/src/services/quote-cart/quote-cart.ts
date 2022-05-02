import { createApolloClient } from '@/services/apollo'
import { addCampaignCode, AddCampaignCodeParams } from './add-campaign-code'
import { CreateQuoteCartParams, createQuoteCart } from './create-quote-cart'
import { ValidateQuoteCartParams, validateQuoteCart } from './validate-quote-cart'

const client = createApolloClient()

export const COOKIE_KEY = '_hv_onboarding_quote_cart'
export const CAMPAIGN_CODE_COOKIE_KEY = '_hvcode'
export const CAMPAIGN_CODE_QUERY_PARAM = 'code'

type AddCampaignParams = Omit<AddCampaignCodeParams, 'client'>
export const addCampaign = (params: AddCampaignParams) => addCampaignCode({ client, ...params })

type ValidateParams = Omit<ValidateQuoteCartParams, 'client'>
export const validate = (params: ValidateParams) => validateQuoteCart({ client, ...params })

type CreateParams = Omit<CreateQuoteCartParams, 'client'>
export const create = (params: CreateParams) => createQuoteCart({ client, ...params })
