import { convertEnumToTitle } from '@hedvig-ui'
import { addYears } from 'date-fns'
import { Contract, GenericAgreement } from 'types/generated/graphql'

export const getCarrierText = (carrier: string) => {
  switch (carrier) {
    case 'EIR':
      return 'Ⓔ EIR'
    case 'HEDVIG':
      return 'Ⓗ Hedvig'
    case 'HDI':
      return '🗄 HDI'
  }
  return carrier
}

export const getSignSource = (signSource: string): string => {
  switch (signSource) {
    case 'APP':
      return 'App'
    case 'ANDROID':
      return 'Android'
    case 'IOS':
      return 'iOS'
    case 'HOPE':
      return 'Hope'
    case 'RAPIO':
      return 'Partner'
    case 'WEB':
      return 'Web'
    case 'WEBONBOARDING':
      return 'Web On-boarding'
    case 'SELF_CHANGE':
      return 'Self-service'
    case 'CROSS_SELL':
      return 'Cross-Sell'
    default:
      return convertEnumToTitle(signSource)
  }
}

export const getContractByAgreementId = (
  contracts: ReadonlyArray<Contract>,
  agreementId: string,
): Contract | undefined => {
  return contracts.find((contract) =>
    contract.genericAgreements.some(
      (agreement) => agreement.id === agreementId,
    ),
  )
}

export const getOriginatingAgreement = (
  contract: Contract,
  agreementId: string,
): GenericAgreement | undefined => {
  if (agreementId == null) {
    return undefined
  }

  return contract.genericAgreements.find(
    (agreement) => agreement.id === agreementId,
  )
}

export const getOriginatingAgreementPeriod = (
  agreement: GenericAgreement,
  contract: Contract,
): [Date | undefined, Date | undefined] => {
  if (agreement == null) {
    return [undefined, undefined]
  }

  const startDate = agreement.fromDate
    ? new Date(agreement.fromDate)
    : undefined

  if (agreement.toDate) {
    return [startDate, new Date(agreement.toDate)]
  }

  const renewalDate = new Date(contract.renewal!.renewalDate)

  // Special case if renewal == startDate, then it's the upcoming renewal agreement, so plus 1 year
  if (contract.renewal!.renewalDate == agreement.fromDate) {
    renewalDate.setDate(renewalDate.getDate() + 365)
  }
  const renewalEndDate: Date = new Date(
    renewalDate.setDate(renewalDate.getDate() - 1),
  )

  let threeMonthsBeforeRenewalDate = new Date(renewalEndDate!)
  threeMonthsBeforeRenewalDate = new Date(
    threeMonthsBeforeRenewalDate.setMonth(
      threeMonthsBeforeRenewalDate!.getMonth() - 3,
    ),
  )

  const today = new Date()
  let todayPlusOneYear = new Date()
  todayPlusOneYear = new Date(
    todayPlusOneYear.setDate(todayPlusOneYear.getDate() + 365),
  )
  const endDateForActiveAgreement =
    today < threeMonthsBeforeRenewalDate ? renewalEndDate : todayPlusOneYear

  const endDate = endDateForActiveAgreement
    ? endDateForActiveAgreement
    : undefined
  return [startDate, endDate]
}

export const getFirstMasterInception = (
  contracts: ReadonlyArray<Pick<Contract, 'masterInception'>>,
): string | null => {
  const masterInceptions = contracts
    .filter((contract) => !!contract.masterInception)
    .map((contract) => contract.masterInception)
  if (masterInceptions.length === 0) {
    return null
  }
  return masterInceptions.reduce((a, b) => (a < b ? a : b))
}

export const getLastTerminationDate = (
  contracts: ReadonlyArray<Pick<Contract, 'terminationDate'>>,
): string | null => {
  if (contracts.length === 0) {
    return null
  }
  const hasNonTerminatedContract = contracts.some(
    (contract) => !contract.terminationDate,
  )
  if (hasNonTerminatedContract) {
    return null
  }
  const terminationDates = contracts.map((contract) => contract.terminationDate)
  return terminationDates.reduce((a, b) => (a > b ? a : b))
}

export const getOneYearMasterInceptionBuckets = (
  masterInception: Date,
): {
  from: Date
  to: Date
}[] => {
  const contractDateSpans: { from: Date; to: Date }[] = []
  let tmpDate = new Date(masterInception)
  while (tmpDate < new Date()) {
    const from = tmpDate
    const to = addYears(from, 1)
    contractDateSpans.push({ from, to })
    tmpDate = to
  }
  return contractDateSpans
}
