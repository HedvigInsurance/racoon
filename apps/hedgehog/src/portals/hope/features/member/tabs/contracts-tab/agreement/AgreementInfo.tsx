import styled from '@emotion/styled'
import {
  Button,
  Collapsible,
  convertEnumToTitle,
  Flex,
  formatMoney,
  formatPostalCode,
  InfoContainer,
  InfoRow,
  InfoText,
  Spacing,
} from '@hedvig-ui'
import { EditStreetInput } from '@hope/features/member/tabs/contracts-tab/agreement/EditStreetInput'
import { getCarrierText } from '@hope/features/contracts/utils'
import * as React from 'react'
import { useState } from 'react'
import { ChevronDown, ChevronUp, PencilFill } from 'react-bootstrap-icons'
import {
  AgreementCoInsuredFragment,
  GenericAgreement,
} from 'types/generated/graphql'
import { RegistrationNumberModal } from './RegistrationNumberModal'
import { Tooltip } from '@hedvig-ui/redesign'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

const AddressInfoRow = styled.div`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  display: inline-block;
`

const EditIconWrapper = styled('span')`
  font-size: 1rem;
`

export const AgreementInfo: React.FC<{
  agreement: GenericAgreement
  preferredCurrency?: string
}> = ({ agreement, preferredCurrency }) => {
  const [editStreet, setEditStreet] = useState(false)
  const [vtrModalOpen, setVtrModalOpen] = useState(false)

  return (
    <InfoContainer>
      {agreement.address && (
        <AddressInfoRow>
          {!editStreet && (
            <>
              {agreement.address.street}{' '}
              <Button variant="tertiary" onClick={() => setEditStreet(true)}>
                <EditIconWrapper>
                  <PencilFill />
                </EditIconWrapper>
              </Button>
            </>
          )}
          {editStreet && (
            <EditStreetInput
              agreementId={agreement.id}
              street={agreement.address.street}
              closeEdit={() => setEditStreet(false)}
            />
          )}
          <br />
          {formatPostalCode(agreement.address.postalCode)}{' '}
          {agreement.address.city}
        </AddressInfoRow>
      )}
      <br />
      {agreement.registrationNumber && (
        <InfoRow>
          Registration Number{' '}
          <InfoText>
            {agreement.registrationNumber}{' '}
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span
                  className={cssUtil.pointer}
                  onClick={() => setVtrModalOpen((current) => !current)}
                >
                  ℹ️
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content>Show info from VTR</Tooltip.Content>
            </Tooltip.Root>
          </InfoText>
          {vtrModalOpen && (
            <RegistrationNumberModal
              visible={vtrModalOpen}
              registrationNumber={agreement.registrationNumber}
              onClose={() => setVtrModalOpen((current) => !current)}
            />
          )}
        </InfoRow>
      )}
      {agreement.mileage && (
        <InfoRow>
          Mileage <InfoText>{agreement.mileage}</InfoText>
        </InfoRow>
      )}
      {agreement.squareMeters && (
        <InfoRow>
          Living Space{' '}
          <InfoText>
            {agreement.squareMeters} m<sup>2</sup>
          </InfoText>
        </InfoRow>
      )}
      {agreement.ancillaryArea && (
        <InfoRow>
          Ancillary Area <InfoText>{agreement.ancillaryArea}</InfoText>
        </InfoRow>
      )}
      {agreement.yearOfConstruction && (
        <InfoRow>
          Year Of Construction{' '}
          <InfoText>{agreement.yearOfConstruction}</InfoText>
        </InfoRow>
      )}
      {agreement.yearOfOwnership && (
        <InfoRow>
          Year Of Ownership <InfoText>{agreement.yearOfOwnership}</InfoText>
        </InfoRow>
      )}
      {agreement.numberOfBathrooms && (
        <InfoRow>
          Number of bathrooms <InfoText>{agreement.numberOfBathrooms}</InfoText>
        </InfoRow>
      )}
      {agreement.isSubleted && (
        <InfoRow>
          Is subleted <InfoText>{agreement.isSubleted ? 'Yes' : 'No'}</InfoText>
        </InfoRow>
      )}
      {agreement.objectTitle && (
        <InfoRow>
          Object title <InfoText>{agreement.objectTitle}</InfoText>
        </InfoRow>
      )}
      {agreement.objectValue && (
        <InfoRow>
          Object value <InfoText>{agreement.objectValue}</InfoText>
        </InfoRow>
      )}
      {agreement.objectDescription && (
        <InfoRow>
          Object description <InfoText>{agreement.objectDescription}</InfoText>
        </InfoRow>
      )}
      {agreement.extraBuildings &&
        agreement.extraBuildings.map((extraBuilding, index) => {
          return (
            <InfoRow key={extraBuilding.id}>
              Extra building {index + 1}{' '}
              <InfoText>
                {convertEnumToTitle(extraBuilding.type)}, {extraBuilding.area} m
                <sup>2</sup>{' '}
                {extraBuilding.hasWaterConnected ? '(Water connected)' : ''}
              </InfoText>
            </InfoRow>
          )
        })}
      {agreement.numberCoInsured !== null && (
        <AgreementCoInsured
          numberCoInsured={agreement.numberCoInsured ?? 0}
          coInsured={agreement.coInsured}
        />
      )}
      {!!agreement?.name && (
        <InfoRow>
          Name <InfoText>{agreement.name}</InfoText>
        </InfoRow>
      )}
      {!!agreement?.gender && (
        <InfoRow>
          Gender <InfoText>{convertEnumToTitle(agreement.gender)}</InfoText>
        </InfoRow>
      )}
      {!!agreement?.breeds?.length && (
        <InfoRow>
          Breeds{' '}
          <InfoText>
            {agreement?.breeds.map(
              (breed, index, breeds) =>
                `${convertEnumToTitle(breed)}${
                  index === breeds.length - 1
                    ? ''
                    : index === breeds.length - 2
                      ? ' and '
                      : ', '
                }`,
            )}
          </InfoText>
        </InfoRow>
      )}
      {!!agreement?.birthDate && (
        <InfoRow>
          Date of Birth <InfoText>{agreement.birthDate}</InfoText>
        </InfoRow>
      )}
      {agreement?.isNeutered !== null && (
        <InfoRow>
          Neutured{' '}
          <InfoText>{convertEnumToTitle(`${agreement.isNeutered}`)}</InfoText>
        </InfoRow>
      )}
      {agreement?.isPreviousDogOwner !== null && (
        <InfoRow>
          Previous Dog Owner{' '}
          <InfoText>
            {convertEnumToTitle(`${agreement.isPreviousDogOwner}`)}
          </InfoText>
        </InfoRow>
      )}
      {agreement?.hasOutsideAccess !== null && (
        <InfoRow>
          Has outside access{' '}
          <InfoText>
            {convertEnumToTitle(`${agreement.hasOutsideAccess}`)}
          </InfoText>
        </InfoRow>
      )}
      <InfoRow>
        Line of Business{' '}
        <InfoText>{agreement.typeOfContractDisplayName}</InfoText>
      </InfoRow>
      <InfoRow>
        Carrier <InfoText>{getCarrierText(agreement.carrier)}</InfoText>
      </InfoRow>
      {agreement.partner ? (
        <InfoRow>
          Partner <InfoText>{convertEnumToTitle(agreement.partner)}</InfoText>
        </InfoRow>
      ) : null}
      <InfoRow>
        Premium{' '}
        <InfoText>
          {formatMoney(agreement.premium, { minimumFractionDigits: 0 })}
        </InfoText>
      </InfoRow>
      {agreement?.fixedDeductible !== null && (
        <InfoRow>
          Fixed deductible{' '}
          <InfoText>
            {preferredCurrency
              ? formatMoney({
                  amount: Number(agreement.fixedDeductible),
                  currency: preferredCurrency,
                })
              : `${agreement.fixedDeductible} ???`}
          </InfoText>
        </InfoRow>
      )}
      {agreement?.percentageDeductible !== null && (
        <InfoRow>
          Percentage deductible{' '}
          <InfoText>{`${agreement.percentageDeductible} %`}</InfoText>
        </InfoRow>
      )}
      {(agreement?.deathOption !== null ||
        agreement?.preExistingConditionOption !== null) && (
        <InfoRow>
          ManyPets add-ons{' '}
          <InfoText>
            {[
              agreement?.deathOption ? `Death` : ``,
              agreement?.preExistingConditionOption
                ? `PreExistingCondition`
                : ``,
            ]
              .filter((item) => item)
              .join(', ')}
          </InfoText>
        </InfoRow>
      )}
      <InfoRow>
        Status <InfoText>{convertEnumToTitle(agreement.status)}</InfoText>
      </InfoRow>
    </InfoContainer>
  )
}

const AgreementCoInsured = ({
  numberCoInsured,
  coInsured,
}: {
  numberCoInsured: number
  coInsured: AgreementCoInsuredFragment[]
}) => {
  const [showCoInsured, setShowCoInsured] = useState(false)

  return (
    <Flex direction="column">
      <InfoRow
        style={coInsured.length > 0 ? { cursor: 'pointer' } : {}}
        onClick={() => setShowCoInsured((prev) => !prev)}
      >
        <Flex align="center" gap="fraction">
          Number Co-insured{' '}
          {coInsured.length > 0 &&
            (showCoInsured ? <ChevronUp /> : <ChevronDown />)}
        </Flex>
        <InfoText>{numberCoInsured}</InfoText>
      </InfoRow>
      <Collapsible collapsed={!showCoInsured}>
        <Spacing left="small" right="small">
          {coInsured.map(({ id, firstName, lastName, ssn, birthdate }) => (
            <InfoRow key={id}>
              - {firstName} {lastName}, {ssn ? formatSSN(ssn) : birthdate}
            </InfoRow>
          ))}
        </Spacing>
      </Collapsible>
    </Flex>
  )
}

function formatSSN(inputSSN: string) {
  const ssn = inputSSN.replace('-', '').trim()
  const firstPart = ssn.slice(0, ssn.length - 4)
  const lastPart = ssn.slice(ssn.length - 4)
  return `${firstPart}-${lastPart}`
}
