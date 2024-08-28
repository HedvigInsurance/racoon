import {
  Button,
  Dropdown,
  DropdownOption,
  Flex,
  Input,
  OrbIndicator,
  TableColumn,
  TableRow,
  convertEnumToTitle,
} from '@hedvig-ui'
import { Tooltip } from '@hedvig-ui/redesign'
import * as React from 'react'
import { Member } from 'types/generated/graphql'

const fraudulentStatuses: Record<string, string> = {
  REGULAR_INVESTIGATION: '#21ba45',
  EXTENDED_INVESTIGATION: '#f2711c',
  CONFIRMED_FRAUD: '#db2828',
}

type FraudulentStatusProps = {
  statusInfo: {
    status: Member['fraudulentStatus']
    description?: Member['fraudulentStatusDescription']
  }
}

const FraudulentStatus = (props: FraudulentStatusProps) => {
  if (props.statusInfo.description) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <FraudStatusOrb {...props} />
        </Tooltip.Trigger>
        <Tooltip.Content>{props.statusInfo.description}</Tooltip.Content>
      </Tooltip.Root>
    )
  }
  return <FraudStatusOrb {...props} />
}

const FraudStatusOrb = (props: FraudulentStatusProps) => (
  <OrbIndicator
    size="10px"
    color={
      props.statusInfo.status && fraudulentStatuses[props.statusInfo.status]
        ? fraudulentStatuses[props.statusInfo.status || 0]
        : 'green'
    }
  />
)

const FraudulentStatusEdit: React.FC<{
  onEdit: (status: string, description: string) => void
  getFraudStatusInfo: () => { status: string; description: string }
  getState: () => boolean
  setState: (editing: boolean, status?: string, description?: string) => void
}> = ({ onEdit, getFraudStatusInfo, getState, setState }) => {
  const [descriptionValue, setDescriptionValue] = React.useState<string>(
    getFraudStatusInfo().description,
  )
  const [fraudulentStatusValue, setFraudulentStatusValue] =
    React.useState<string>(getFraudStatusInfo().status)

  return (
    <TableRow>
      <TableColumn>Investigation need</TableColumn>
      <TableColumn>
        {!getState() ? (
          <Flex gap="small" justify="space-between" align="center">
            <div>
              Status: {convertEnumToTitle(getFraudStatusInfo().status)} <br />
              {getFraudStatusInfo().description}
            </div>
            <Button
              onClick={() =>
                setState(true, fraudulentStatusValue, descriptionValue)
              }
            >
              Edit
            </Button>
          </Flex>
        ) : (
          <Flex direction="column" gap="tiny">
            <Dropdown placeholder={fraudulentStatusValue}>
              {Object.keys(fraudulentStatuses)
                .map((item) => ({
                  key: item,
                  text: convertEnumToTitle(item),
                  value: item,
                  selected: item === fraudulentStatusValue,
                  active: item === fraudulentStatusValue,
                }))
                .map((opt) => (
                  <DropdownOption
                    key={opt.key}
                    onClick={() => setFraudulentStatusValue(opt.value)}
                    selected={opt.value === fraudulentStatusValue}
                  >
                    {opt.text}
                  </DropdownOption>
                ))}
            </Dropdown>
            <Input
              onChange={({ currentTarget: { value } }) =>
                setDescriptionValue(value)
              }
              defaultValue={descriptionValue}
            />
            <Flex gap="small">
              <Button
                onClick={() => {
                  onEdit(fraudulentStatusValue, descriptionValue)
                  setState(false, fraudulentStatusValue, descriptionValue)
                }}
                variant="primary"
              >
                Save
              </Button>
              <Button variant="secondary" onClick={() => setState(false)}>
                Cancel
              </Button>
            </Flex>
          </Flex>
        )}
      </TableColumn>
    </TableRow>
  )
}

export { FraudulentStatus, FraudulentStatusEdit }
