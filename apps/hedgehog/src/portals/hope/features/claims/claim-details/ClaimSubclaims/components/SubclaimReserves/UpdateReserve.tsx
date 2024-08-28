import { useState } from 'react'
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
import { useSetSubclaimReserve } from '@hope/common/hooks/use-set-subclaim-reserve'
import { CostCategory } from '@hope/features/config/constants'
import { SubclaimReserveFragment } from 'types/generated/graphql'

type UpdateReserveProps = {
  reserve: SubclaimReserveFragment
  onSubmit: () => void
}

export const UpdateReserve = (props: UpdateReserveProps) => {
  const reserve = props.reserve
  const currency = reserve.amount.currency
  const { updateReserve, isUpdatingReserve } = useSetSubclaimReserve()
  const [newReserveCategory, setNewReserveCategory] = useState<CostCategory>(
    reserve.costCategory as CostCategory,
  )
  const [newReserveAmount, setNewReserveAmount] = useState(
    reserve.amount.amount,
  )
  const [newReserveNote, setNewReserveNote] = useState('')

  const resetForm = () => {
    setNewReserveCategory(reserve.costCategory as CostCategory)
    setNewReserveAmount(reserve.amount.amount)
    setNewReserveNote('')
  }
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await updateReserve(reserve.id, {
          costCategory: newReserveCategory,
          amount: {
            amount: newReserveAmount,
            currency,
          },
          note: newReserveNote,
        })
        resetForm()
        props.onSubmit()
      }}
      style={{ width: '100%' }}
    >
      <Flex direction="column" gap="tiny">
        <div style={{ width: '100%' }}>
          <Label>Cost category</Label>
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
          label="Amount"
          value={newReserveAmount}
          placeholder="Enter amount..."
          type={'number'}
          onChange={({ currentTarget: { value } }) =>
            setNewReserveAmount(parseInt(value))
          }
          affix={{ content: currency }}
        />
        <TextArea
          label="Note"
          placeholder="Note goes here..."
          value={newReserveNote}
          onChange={({ currentTarget: { value } }) => setNewReserveNote(value)}
        />
        <ButtonsGroup>
          <Button
            disabled={
              isUpdatingReserve ||
              !newReserveCategory ||
              !newReserveAmount ||
              newReserveNote.length < 5
            }
            type="submit"
            variant="primary"
          >
            Submit
          </Button>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => {
              resetForm()
              props.onSubmit()
            }}
          >
            Cancel
          </Button>
        </ButtonsGroup>
      </Flex>
    </form>
  )
}
