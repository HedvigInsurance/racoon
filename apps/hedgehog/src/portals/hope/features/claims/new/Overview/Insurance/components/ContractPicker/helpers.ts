import { convertEnumToTitle } from '@hedvig-ui'
import {
  ContractFragment,
  GenericAgreementFragment,
} from 'types/generated/graphql'
import { InfoTagVariant } from '@hedvig-ui/redesign/InfoTag/InfoTag'
import { ContractStatus } from '@hope/features/config/constants'
import { ContractOption } from './types'

export function getContractOptionsOnDate(
  contracts: ContractFragment[],
  date: string | undefined,
) {
  const nonDeletedContracts = contracts.filter((c) => !c.deletedAt)
  return nonDeletedContracts.map((contract) =>
    getOptionForContractOnDate(contract, date),
  )
}

function getOptionForContractOnDate(
  contract: ContractFragment,
  date: string | undefined,
): ContractOption {
  if (!date) {
    return getContractInfo(contract)
  }

  const agreement = getContractAgreementActiveOndate(contract, date)

  if (!agreement) {
    const contractInfo = getContractInfo(contract)
    return {
      ...contractInfo,
      tags: [
        ...contractInfo.tags,
        { text: 'Not active on date', variant: 'danger' },
      ],
    }
  }

  return getContractAgreementInfo(contract, agreement)
}

function getContractInfo(contract: ContractFragment): ContractOption {
  return {
    name: convertEnumToTitle(contract.insuranceType),
    contractId: contract.id,
    fromDate: contract.masterInception,
    toDate: contract.terminationDate,
    tags: getContractTags(contract),
  }
}

function getContractAgreementInfo(
  contract: ContractFragment,
  agreement: GenericAgreementFragment,
): ContractOption {
  return {
    name: convertEnumToTitle(agreement.typeOfContract),
    contractId: contract.id,
    petName: agreement.name ?? undefined,
    registrationNumber: agreement.registrationNumber ?? undefined,
    street: agreement.address?.street ?? undefined,
    birthDate: agreement.birthDate ?? undefined,
    fromDate: agreement.fromDate,
    toDate: agreement.toDate,
    tags: [...getContractTags(contract), ...getAgreementTags(agreement)],
  }
}

function getContractAgreementActiveOndate(
  contract: ContractFragment,
  date: string,
): GenericAgreementFragment | undefined {
  return contract.genericAgreements.find((a) => {
    if (!a.fromDate || new Date(a.fromDate) > new Date(date)) {
      return false
    }
    if (!a.toDate) {
      return true
    }
    return new Date(a.toDate) >= new Date(date)
  })
}

const CONTRACT_STATUS_VARIANT: Record<ContractStatus, InfoTagVariant> = {
  [ContractStatus.Active]: 'success',
  [ContractStatus.ActiveInFuture]: 'danger',
  [ContractStatus.ActiveInFutureAndTerminatedInFuture]: 'danger',
  [ContractStatus.Pending]: 'danger',
  [ContractStatus.TerminatedToday]: 'warning',
  [ContractStatus.TerminatedInFuture]: 'success',
  [ContractStatus.Terminated]: 'warning',
  [ContractStatus.Deleted]: 'danger',
} as const

type ContractInfoTag = { text: string; variant: InfoTagVariant }

function getContractTags(contract: ContractFragment) {
  const tags: ContractInfoTag[] = []
  tags.push({
    text: 'Contract ' + convertEnumToTitle(contract.status),
    variant: CONTRACT_STATUS_VARIANT[contract.status as ContractStatus],
  })
  return tags
}

function getAgreementTags(agreement: GenericAgreementFragment) {
  const tags: ContractInfoTag[] = []
  if (agreement.partner) {
    tags.push({ text: convertEnumToTitle(agreement.partner), variant: 'info' })
  }
  return tags
}
