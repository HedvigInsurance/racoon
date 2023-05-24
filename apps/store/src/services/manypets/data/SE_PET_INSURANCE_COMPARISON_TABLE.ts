import { ComparisonTableTemplateByTierLevelMap, DataGetter } from '../manypets.types'

const getDeductibleData: DataGetter = (offerData) => {
  return offerData.deductible?.displayName ?? null
}

const getLifeInsuranceData: DataGetter = (offerData) => {
  const { deathOption } = offerData.priceIntentData
  if (deathOption) {
    return true
  }

  return null
}

const getPreviousComplaintsData: DataGetter = (offerData) => {
  const { preExistingConditionOption } = offerData.priceIntentData
  if (preExistingConditionOption) {
    return true
  }

  return null
}

export const TableDataTemplate: ComparisonTableTemplateByTierLevelMap = {
  BASIC: {
    Veterinärvård: '30 000',
    Självrisk: getDeductibleData,
    'Dolda fel': true,
    Livförsäkring: getLifeInsuranceData,
    'Tidigare besvär': getPreviousComplaintsData,
    'Fria vårdsamtal': true,
    'Ingen bindningstid': true,
  },
  STANDARD: {
    Veterinärvård: '60 000',
    Självrisk: getDeductibleData,
    'Dolda fel': true,
    Medicin: true,
    Tandvård: true,
    'Avancerad diagnostik': true,
    'Strålning och kemoterapi': true,
    Rehabilitering: true,
    Specialkost: true,
    'Förlossning/Kejsarsnitt': true,
    Livförsäkring: getLifeInsuranceData,
    'Tidigare besvär': getPreviousComplaintsData,
    'Fria vårdsamtal': true,
    'Ingen bindningstid': true,
  },
  PREMIUM: {
    Veterinärvård: '140 000',
    Självrisk: getDeductibleData,
    'Dolda fel': true,
    Medicin: true,
    Tandvård: true,
    'Avancerad diagnostik': true,
    'Strålning och kemoterapi': true,
    Rehabilitering: true,
    Specialkost: true,
    'Förlossning/Kejsarsnitt': true,
    Livförsäkring: getLifeInsuranceData,
    'Tidigare besvär': getPreviousComplaintsData,
    'Fria vårdsamtal': true,
    'Ingen bindningstid': true,
  },
}
