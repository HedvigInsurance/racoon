import { ComparisonTableTemplateByTierLevelMap, DataGetter } from '../manypets.types'

const getDeductibleData: DataGetter = (offerData) => {
  return offerData.deductible?.displayName ?? null
}

const getLifeInsuranceData: DataGetter = (offerData) => {
  const { deathOption } = offerData.priceIntentData
  if (deathOption != null) {
    return Boolean(deathOption)
  }

  return null
}

const getPreviousComplaintsData: DataGetter = (offerData) => {
  const { preExistingOption } = offerData.priceIntentData
  if (preExistingOption != null) {
    return Boolean(preExistingOption)
  }

  return null
}

export const TableDataTemplate: ComparisonTableTemplateByTierLevelMap = {
  BASIC: {
    Veterinärvårdsbelopp: '30 000',
    Självrisk: getDeductibleData,
    'Ingen bindningstid': true,
    'Dolda fel': true,
    Kastrering: true,
    Livförsäkring: getLifeInsuranceData,
    'Tidigare besvär': getPreviousComplaintsData,
  },
  STANDARD: {
    Veterinärvårdsbelopp: '60 000',
    Självrisk: getDeductibleData,
    'Ingen bindningstid': true,
    'Dolda fel': true,
    Kastrering: true,
    Specialkost: true,
    Tandvård: true,
    Livförsäkring: getLifeInsuranceData,
    'Tidigare besvär': getPreviousComplaintsData,
  },
  PREMIUM: {
    Veterinärvårdsbelopp: '140 000',
    Självrisk: getDeductibleData,
    'Ingen bindningstid': true,
    'Dolda fel': true,
    Kastrering: true,
    Specialkost: true,
    Tandvård: true,
    'Vård av djur': true,
    Livförsäkring: getLifeInsuranceData,
    'Tidigare besvär': getPreviousComplaintsData,
  },
}
