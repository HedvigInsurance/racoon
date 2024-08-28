import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  convertEnumToTitle,
  DropdownOption,
  extractErrorMessage,
  Label,
  Spacing,
  useClickOutside,
} from '@hedvig-ui'
import { ContractItem } from '@hope/features/contracts/ContractItem'
import { useRef, useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import { useAddSubclaimMutation } from 'types/generated/graphql'
import { useClaim } from '../../../hooks/use-claim'

const AddSubclaimWrapper = styled.div`
  position: relative;
`

const AddSubclaimPopup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  border-radius: 0.4rem;
  overflow: hidden;
  background-color: #fafafa;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
  width: 400px;
  z-index: 10;
`
const AddSubclaimStep = styled.div`
  max-height: 400px;
  overflow: auto;
`

const ConfirmAddSubclaim = styled.div`
  padding: 1rem;
`

const AddSubclaim: React.FC<{
  onSuccess: (id: string) => void
}> = ({ onSuccess }) => {
  const {
    claimId,
    contract,
    member: { contractMarketInfo },
  } = useClaim()
  const preferredCurrency = contractMarketInfo?.preferredCurrency
  const [addSubclaim] = useAddSubclaimMutation()
  const [dropDownActive, setDropDownActive] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [newSubclaimStep, setNewSubclaimStep] = useState(1)

  const availableClaimTypes = contract?.availableClaimTypes ?? []

  const popupRef = useRef<HTMLDivElement>(null)
  useClickOutside(popupRef, () => setDropDownActive(false))

  const handleSubmit = async () => {
    if (!(contract?.id && selectedType)) {
      return
    }
    await toast.promise(
      addSubclaim({
        variables: {
          claimId,
          request: { contractId: contract.id, type: selectedType },
        },
      }),
      {
        loading: 'Loading',
        success: (result) => {
          const subclaims = result?.data?.addClaimSubclaim.subclaims
          if (subclaims) {
            onSuccess(subclaims[subclaims.length - 1].id)
          }
          setDropDownActive(false)
          return 'Subclaim added'
        },
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const renderNewSubclaimStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <AddSubclaimStep>
            {availableClaimTypes
              .toSorted((a, b) => a.displayName.localeCompare(b.displayName))
              .map((type, index) => {
                return (
                  <DropdownOption
                    key={`${type.id} ${index}`}
                    selected={type.id === selectedType}
                    onClick={() => {
                      setSelectedType(type.id)
                      setNewSubclaimStep(2)
                    }}
                  >
                    {type.displayName}
                  </DropdownOption>
                )
              })}
          </AddSubclaimStep>
        )
      case 2:
        if (!contract) {
          return null
        }
        return (
          <ConfirmAddSubclaim>
            <Label>Contract</Label>
            <ContractItem
              contract={contract}
              preferredCurrency={preferredCurrency}
            />
            <Spacing top="small" />
            <Label>Type</Label>
            {convertEnumToTitle(selectedType)}
            <Spacing top="small" />

            <ButtonsGroup>
              <Button onClick={handleSubmit}>Confirm and Add</Button>
              <Button variant="secondary" onClick={() => setNewSubclaimStep(1)}>
                Edit
              </Button>
              <Button
                style={{ marginLeft: 'auto' }}
                variant="tertiary"
                onClick={() => setDropDownActive(false)}
              >
                Cancel
              </Button>
            </ButtonsGroup>
          </ConfirmAddSubclaim>
        )
      default:
        return null
    }
  }

  if (!contract) {
    return null
  }

  return (
    <AddSubclaimWrapper>
      {dropDownActive ? (
        <AddSubclaimPopup ref={popupRef}>
          {renderNewSubclaimStep(newSubclaimStep)}
        </AddSubclaimPopup>
      ) : (
        <Button
          style={{ position: 'absolute', top: 0, right: 0 }}
          onClick={() => {
            setDropDownActive(true)
          }}
        >
          {'+ New subclaim'}
        </Button>
      )}
    </AddSubclaimWrapper>
  )
}

export default AddSubclaim
