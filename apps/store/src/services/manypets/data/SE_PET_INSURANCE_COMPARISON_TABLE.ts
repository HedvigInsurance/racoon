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

// Unicode for &nbsp; HTML entity: non-breaking space
// We use it to make sure number values get spaced but don't get broken down
// into multiple lines when no space is available.
const nbsp = '\u00A0'

export const TableDataTemplate: ComparisonTableTemplateByTierLevelMap = {
  BASIC: {
    Veterinärvård: `30${nbsp}000`,
    Självrisk: getDeductibleData,
    'Dolda fel': true,
    Livförsäkring: getLifeInsuranceData,
    'Tidigare besvär': getPreviousComplaintsData,
    'Fria vårdsamtal': true,
    'Ingen bindningstid': true,
  },
  STANDARD: {
    Veterinärvård: `60${nbsp}000`,
    Självrisk: getDeductibleData,
    'Dolda fel': true,
    Medicin: true,
    Tandvård: true,
    'Avancerad diagnostik': true,
    'Strålning och kemoterapi': true,
    Rehabilitering: true,
    Specialkost: true,
    'Förlossning / Kejsarsnitt': true,
    Livförsäkring: getLifeInsuranceData,
    'Tidigare besvär': getPreviousComplaintsData,
    'Fria vårdsamtal': true,
    'Ingen bindningstid': true,
  },
  PREMIUM: {
    Veterinärvård: `140${nbsp}000`,
    Självrisk: getDeductibleData,
    'Dolda fel': true,
    Medicin: true,
    Tandvård: true,
    'Avancerad diagnostik': true,
    'Strålning och kemoterapi': true,
    Rehabilitering: true,
    Specialkost: true,
    'Förlossning / Kejsarsnitt': true,
    Livförsäkring: getLifeInsuranceData,
    'Tidigare besvär': getPreviousComplaintsData,
    'Fria vårdsamtal': true,
    'Ingen bindningstid': true,
  },
}
