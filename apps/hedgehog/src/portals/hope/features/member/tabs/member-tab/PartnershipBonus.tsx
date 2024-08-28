import { FormEvent, FormEventHandler, useMemo, useState } from 'react'
import {
  Flex,
  Button,
  Placeholder,
  Input,
  Dropdown,
  DropdownOption,
  extractErrorMessage,
  InfoTag,
  Checkbox,
} from '@hedvig-ui'
import {
  PartnershipBonusFragment,
  useUpsertPartnershipBonusMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import toast from 'react-hot-toast'
import styled from '@emotion/styled'

gql`
  mutation UpsertPartnershipBonus(
    $memberId: ID!
    $input: UpsertPartnershipBonusInput!
  ) {
    upsertPartnershipBonus(memberId: $memberId, input: $input) {
      ...EditMemberInformation
    }
  }
`

const ErrorTag = styled(InfoTag)`
  width: max-content;
  margin-top: 0.25rem;
  padding: 0.25rem;
  font-size: 0.8rem;
`

const BonusPartnerMap = {
  SAS: 'SAS',
} as const

type Props = {
  memberId: string
  partnershipBonus?: PartnershipBonusFragment
}

export const PartnershipBonus = (props: Props) => {
  const [upsert, { loading }] = useUpsertPartnershipBonusMutation()
  const defaultBonusPartner = props.partnershipBonus?.bonusPartner ?? ''
  const defaultBonusNumber = props.partnershipBonus?.bonusNumber ?? ''

  const [isEditing, setIsEditing] = useState(false)
  const [bonusPartner, setBonusPartner] = useState(defaultBonusPartner)
  const [bonusNumber, setBonusNumber] = useState(defaultBonusNumber)

  const [bypassEligibilityCheck, setBypassEligibilityCheck] = useState(false)

  const bonusNumberValidity = useMemo(() => {
    const isOnlyNumbers =
      RegExp('^[0-9]+$').test(bonusNumber) || !bonusNumber.length
    const hasLength = !!bonusNumber.length

    switch (bonusPartner) {
      case BonusPartnerMap.SAS:
        if (!isOnlyNumbers) {
          return {
            valid: false,
            reason: 'Can only be numbers',
          }
        }
        if (!hasLength) {
          return {
            valid: false,
            reason: 'Cannot be empty',
          }
        }
        break
      default:
        break
    }
    return {
      valid: true,
      reason: undefined,
    }
  }, [bonusNumber, bonusPartner])

  const cancelEdit = () => {
    setIsEditing(false)
    setBonusPartner(defaultBonusPartner)
    setBonusNumber(defaultBonusNumber)
  }

  const savePartnershipBonus: FormEventHandler = (event: FormEvent) => {
    event.preventDefault()
    toast.promise(
      upsert({
        variables: {
          memberId: props.memberId,
          input: { bonusPartner, bonusNumber, bypassEligibilityCheck },
        },
      }),
      {
        loading: 'Adding bonus',
        success: () => {
          setIsEditing(false)
          if (bypassEligibilityCheck)
            return 'Bonus added (This does not guarantee the member is eligible for the bonus)'
          return 'Bonus added'
        },
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  if (isEditing) {
    return (
      <form onSubmit={savePartnershipBonus}>
        <Flex direction="column" gap="tiny">
          <Dropdown placeholder="Bonus partner">
            {Object.entries(BonusPartnerMap).map(([value, displayName]) => (
              <DropdownOption
                key={value}
                selected={bonusPartner === value}
                onClick={() => setBonusPartner(value)}
                value={value}
              >
                {displayName}
              </DropdownOption>
            ))}
          </Dropdown>
          <div style={{ width: '100%' }}>
            <Input
              placeholder="Bonus number"
              value={bonusNumber}
              onChange={({ currentTarget: { value } }) => {
                setBonusNumber(value)
              }}
            />
            {!bonusNumberValidity.valid && (
              <ErrorTag status="danger">{bonusNumberValidity.reason}</ErrorTag>
            )}
          </div>
          <Flex gap="small" align="center">
            <Button
              type="submit"
              disabled={loading || !bonusPartner || !bonusNumberValidity.valid}
              variant="primary"
            >
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={cancelEdit}>
              Cancel
            </Button>
            <Checkbox
              checked={bypassEligibilityCheck}
              onChange={() => setBypassEligibilityCheck((current) => !current)}
              label="Bypass Eligibility Check"
            />
          </Flex>
        </Flex>
      </form>
    )
  }

  return (
    <Flex justify="space-between" align="center">
      {props.partnershipBonus ? (
        <div>
          <div>{props.partnershipBonus.bonusPartner}</div>
          <Placeholder>{props.partnershipBonus.bonusNumber}</Placeholder>
        </div>
      ) : (
        <Placeholder>No bonus connected</Placeholder>
      )}
      <Button onClick={() => setIsEditing(true)}>Edit</Button>
    </Flex>
  )
}
