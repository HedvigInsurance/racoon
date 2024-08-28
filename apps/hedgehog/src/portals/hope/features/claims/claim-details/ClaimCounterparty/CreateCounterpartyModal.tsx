import styled from '@emotion/styled'
import {
  convertEnumToTitle,
  Dropdown,
  DropdownOption,
  extractErrorMessage,
  Input,
  isPressing,
  Keys,
  Modal,
  Paragraph,
  Shadowed,
  ThirdLevelHeadline,
  usePlatform,
} from '@hedvig-ui'
import gql from 'graphql-tag'
import { useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import { useAddClaimCounterpartyMutation } from 'types/generated/graphql'

gql`
  mutation AddClaimCounterparty($claimId: ID!, $reference: String!) {
    claim_addCounterparty(claimId: $claimId, reference: $reference) {
      id
      counterparties {
        ...ClaimCounterparty
      }
    }
  }
`

const CounterpartyModal = styled(Modal)`
  width: 23rem;
  padding: 15px;
  background-color: ${({ theme }) => theme.backgroundLight};
`

enum CounterpartyType {
  Car = 'CAR',
  Other = 'OTHER',
}

const SubmitTip = styled(Paragraph)`
  text-align: right;
  font-size: 0.8em;
  margin-top: 1.25rem;
  color: ${({ theme }) => theme.semiStrongForeground};
  transition: opacity 0.5s;
`

export const CreateCounterpartyModal: React.FC<{
  visible: boolean
  onClose: () => void
  claimId: string
}> = ({ visible, onClose, claimId }) => {
  const { isMetaKey, metaKey } = usePlatform()

  const [addClaimCounterparty] = useAddClaimCounterpartyMutation()

  const [reference, setReference] = useState('')

  const [counterpartyType, setCounterpartyType] = useState(CounterpartyType.Car)

  const handleClose = () => {
    setReference('')
    setCounterpartyType(CounterpartyType.Car)
    onClose()
  }

  const addCounterpartyHandler = async () => {
    await toast.promise(
      addClaimCounterparty({
        variables: {
          claimId,
          reference,
        },
      }),
      {
        loading: 'Creating counterparty...',
        success: 'Counterparty created',
        error: ({ message }) => extractErrorMessage(message),
      },
    )

    handleClose()
  }

  return (
    <CounterpartyModal visible={visible} onClose={handleClose}>
      <ThirdLevelHeadline>Add new counterparty</ThirdLevelHeadline>
      <Dropdown placeholder="Type" style={{ marginBottom: '1rem' }}>
        {Object.values(CounterpartyType).map((type) => (
          <DropdownOption
            key={type}
            selected={counterpartyType === type}
            onClick={() => setCounterpartyType(type)}
          >
            {convertEnumToTitle(type)}
          </DropdownOption>
        ))}
      </Dropdown>
      <Input
        label="External reference"
        placeholder={
          counterpartyType === CounterpartyType.Car
            ? 'Registration number'
            : 'Company name, etc...'
        }
        value={reference}
        onChange={({ currentTarget: { value } }) => {
          const newReference =
            counterpartyType === CounterpartyType.Car
              ? value.replace(' ', '').toUpperCase()
              : value
          setReference(newReference)
        }}
        onKeyDown={async (e) => {
          if (!(isMetaKey(e) && isPressing(e, Keys.Enter))) {
            return
          }
          if (reference.length < 6) {
            return
          }
          await addCounterpartyHandler()
        }}
      />
      <SubmitTip style={reference.length > 5 ? {} : { opacity: '0.5' }}>
        Press <Shadowed>{metaKey.hint}</Shadowed> + <Shadowed>Enter</Shadowed>{' '}
        to submit
      </SubmitTip>
    </CounterpartyModal>
  )
}
