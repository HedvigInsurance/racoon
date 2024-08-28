import * as React from 'react'
import styled from '@emotion/styled'
import { convertEnumToTitle, Flex, formatMoney, Tag } from '@hedvig-ui'
import {
  AgreementPetInfoFragment,
  ContractFragment,
} from 'types/generated/graphql'
import { InsuranceType } from '../config/constants'
import { useClaim } from '../claims/hooks/use-claim'

const ContractItemTypeName = styled.div`
  font-size: 1.2em;
  padding-bottom: 0.4em;
`

const ContractItemData = styled.div`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const ContractItemTopTitle = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  margin-bottom: 0.3em;
  border-bottom: 1px solid ${({ theme }) => theme.backgroundTransparent};
`

const ContractItemStyled = styled.div`
  width: 100%;
`

const getPetInfoText = ({ name, gender, breeds }: AgreementPetInfoFragment) => {
  let text = ''
  if (name) {
    text += name
  }
  if (gender) {
    text += text
      ? `, ${convertEnumToTitle(gender)}`
      : convertEnumToTitle(gender)
  }
  if (breeds?.length) {
    const breedList = breeds.map(
      (breed, index) =>
        `${convertEnumToTitle(breed)}${
          index === breeds.length - 1
            ? ''
            : index === breeds.length - 2
              ? ' and '
              : ', '
        }`,
    )
    text += `${text ? ' ' : ''}  ${breedList}`
  }
  return text
}

export const ContractItem: React.FC<{
  contract: ContractFragment
  preferredCurrency?: string
}> = ({ contract, preferredCurrency }) => {
  const { dateOfOccurrence } = useClaim()

  const title = convertEnumToTitle(contract.insuranceType)

  const relevantAgreement = dateOfOccurrence
    ? (contract.genericAgreements.find(
        ({ fromDate, toDate }) =>
          fromDate <= dateOfOccurrence &&
          (toDate >= dateOfOccurrence || !toDate),
      ) ?? contract.currentAgreement)
    : contract.currentAgreement

  const registrationNumber = relevantAgreement.registrationNumber
  const street = [InsuranceType.SwedishCat, InsuranceType.SwedishDog].includes(
    contract.insuranceType as InsuranceType,
  )
    ? undefined
    : relevantAgreement.address?.street

  const activeFrom = relevantAgreement.fromDate ?? contract.masterInception
  const activeTo = relevantAgreement.toDate ?? contract.terminationDate
  const numberCoInsured = relevantAgreement.numberCoInsured
  const partner = relevantAgreement.partner
  const petInfo = {
    name: relevantAgreement.name ?? undefined,
    breeds: relevantAgreement.breeds ?? undefined,
    gender: relevantAgreement.gender ?? undefined,
    birthDate: relevantAgreement.birthDate ?? undefined,
    isPreviousDogOwner: relevantAgreement.isPreviousDogOwner ?? undefined,
    hasOutsideAccess: relevantAgreement.hasOutsideAccess ?? undefined,
    isNeutered: relevantAgreement.isNeutered ?? undefined,
    fixedDeductible: relevantAgreement.fixedDeductible ?? undefined,
    percentageDeductible: relevantAgreement.percentageDeductible ?? undefined,
  }
  const tags = (
    <>
      <Tag>{convertEnumToTitle(relevantAgreement.carrier)}</Tag>
      {!!partner && partner !== relevantAgreement.carrier && (
        <Tag>{convertEnumToTitle(partner)}</Tag>
      )}
      <Tag>{relevantAgreement.typeOfContractDisplayName}</Tag>
      <Tag>{convertEnumToTitle(contract.market)}</Tag>
      <Tag>{convertEnumToTitle(contract.status)}</Tag>
    </>
  )

  return (
    <ContractItemStyled>
      {tags && <ContractItemTopTitle>{tags}</ContractItemTopTitle>}
      <ContractItemTypeName>{title}</ContractItemTypeName>
      <Flex gap="fraction" direction="column">
        {petInfo !== undefined && Object.values(petInfo).some(Boolean) && (
          <>
            <ContractItemData>{getPetInfoText(petInfo)}</ContractItemData>
            {petInfo.birthDate !== undefined && (
              <ContractItemData>
                Birth date: {petInfo.birthDate}
              </ContractItemData>
            )}
            {petInfo.fixedDeductible !== undefined && (
              <ContractItemData>
                Fixed deductible:{' '}
                {preferredCurrency
                  ? formatMoney({
                      amount: Number(petInfo.fixedDeductible),
                      currency: preferredCurrency,
                    })
                  : `${petInfo.fixedDeductible} ???`}
              </ContractItemData>
            )}
            {petInfo.percentageDeductible !== undefined && (
              <ContractItemData>
                Percentage deductible: {`${petInfo.percentageDeductible}%`}
              </ContractItemData>
            )}
          </>
        )}
        {registrationNumber && (
          <ContractItemData>{registrationNumber}</ContractItemData>
        )}
        {street && <ContractItemData>{street}</ContractItemData>}

        <ContractItemData>
          {activeFrom}
          {' - '}
          {activeTo ?? 'Ongoing'}
        </ContractItemData>
        {numberCoInsured !== null && !!numberCoInsured && (
          <ContractItemData>
            {`Covers holder + ${numberCoInsured} co-insured`}
          </ContractItemData>
        )}
      </Flex>
    </ContractItemStyled>
  )
}
