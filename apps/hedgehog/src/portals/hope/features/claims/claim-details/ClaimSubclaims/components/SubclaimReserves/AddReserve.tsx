import {
  Button,
  ButtonsGroup,
  Dropdown,
  DropdownOption,
  Flex,
  Input,
  Label,
  TextArea,
} from '@hedvig-ui'
import { useState } from 'react'
import { CostCategory } from '@hope/features/config/constants'
import { useClaim } from '../../../../hooks/use-claim'
import { useSetSubclaimReserve } from '@hope/common/hooks/use-set-subclaim-reserve'
import styled from '@emotion/styled'

const StyledForm = styled.form`
  width: 100%;
  margin-top: 1rem;
`

export const AddReserve = () => {
  const { preferredCurrency, currentSubclaimId } = useClaim()
  const { addReserve, isAddingReserve } = useSetSubclaimReserve()

  const [newReserveAmount, setNewReserveAmount] = useState('')
  const [newReserveCategory, setNewReserveCategory] = useState<CostCategory>(
    CostCategory['Not specified'],
  )
  const [newReserveNote, setNewReserveNote] = useState('')

  const resetForm = () => {
    setNewReserveCategory(CostCategory['Not specified'])
    setNewReserveAmount('')
    setNewReserveNote('')
  }

  if (!preferredCurrency || !currentSubclaimId) {
    return null
  }

  return (
    <StyledForm
      onSubmit={async (e) => {
        e.preventDefault()
        await addReserve(currentSubclaimId, {
          amount: {
            amount: Number(newReserveAmount),
            currency: preferredCurrency,
          },
          costCategory: newReserveCategory,
          note: newReserveNote,
        })
        resetForm()
      }}
    >
      <Flex direction="column" gap="tiny">
        <div style={{ width: '100%' }}>
          <Label>Cost Category</Label>
          <Dropdown>
            {Object.entries(CostCategory).map(([displayName, category]) => (
              <DropdownOption
                key={category}
                value={category}
                onClick={() => setNewReserveCategory(category)}
                selected={newReserveCategory === category}
              >
                {displayName}
              </DropdownOption>
            ))}
          </Dropdown>
        </div>
        <Input
          required
          label="Amount"
          placeholder="Enter amount..."
          affix={{ content: preferredCurrency }}
          value={newReserveAmount}
          onChange={({ currentTarget: { value } }) =>
            setNewReserveAmount(value)
          }
        />
        <TextArea
          required
          label="Note"
          placeholder="Note goes here..."
          value={newReserveNote}
          onChange={({ currentTarget: { value } }) => setNewReserveNote(value)}
        />
        <ButtonsGroup>
          <Button
            type="submit"
            disabled={
              isAddingReserve ||
              !newReserveCategory ||
              !newReserveAmount ||
              newReserveNote.length < 5
            }
          >
            Add reserve
          </Button>
          <Button type="button" variant="tertiary" onClick={resetForm}>
            Reset form
          </Button>
        </ButtonsGroup>
      </Flex>
    </StyledForm>
  )
}
