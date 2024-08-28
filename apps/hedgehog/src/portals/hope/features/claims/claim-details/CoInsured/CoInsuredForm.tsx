import styled from '@emotion/styled'
import {
  Button,
  Dropdown,
  DropdownOption,
  Flex,
  formatSsn,
  Spacing,
  useClickOutside,
} from '@hedvig-ui'
import chroma from 'chroma-js'
import { EditableField } from '@hope/features/claims/claim-details/CoInsured/EditableField'
import { PlaceholderCard } from '@hope/features/claims/claim-details/CoInsured/PlaceholderCard'
import { useRef, useState } from 'react'
import * as React from 'react'
import {
  EnvelopeFill,
  PersonFill,
  PersonPlusFill,
  PhoneFill,
} from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { useClaimCoInsured } from '@hope/features/claims/hooks/useClaimCoInsured'
import { ClaimCoInsuredFragment } from 'types/generated/graphql'
import { useClaim } from '../../hooks/use-claim'
import { Market } from '../../../config/constants'
import { useTheme } from '@emotion/react'

const CoInsuredCard = styled.div`
  background-color: ${({ theme }) => theme.accent};

  padding: ${({ theme }) => theme.spacing.small};
  border-radius: 8px;
  transition: all 200ms;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.accent).brighten(0.4).hex()};
  }
`

const ExplanatoryText = styled.span`
  color: ${({ theme }) => theme.accent};
  font-size: 0.8em;
`

export const CoInsuredForm: React.FC<{
  coInsured?: ClaimCoInsuredFragment
}> = ({ coInsured }) => {
  const { claimId, member, agreement } = useClaim()
  const { removeCoInsured, upsertCoInsured } = useClaimCoInsured(claimId)

  const memberMarket = member.contractMarketInfo?.market
  const agreementCoInsured = agreement?.coInsured ?? []

  const cardRef = useRef<HTMLDivElement>(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(coInsured?.fullName ?? '')
  const [personalNumber, setPersonalNumber] = useState(
    coInsured?.personalNumber ?? '',
  )
  const [email, setEmail] = useState(coInsured?.email ?? '')
  const [phoneNumber, setPhoneNumber] = useState(coInsured?.phoneNumber ?? '')

  useClickOutside(cardRef, () => {
    setCreating(false)
    setEditing(false)
  })

  const submit = () => {
    if (!name) {
      toast.error("Name can't be empty")
      reset()
      return
    }

    if (!personalNumber) {
      toast.error("Personal number can't be empty")
      reset()
      return
    }

    const ssn = personalNumber.replace('-', '')

    if ((memberMarket as Market) === Market.Sweden) {
      const ssnMatchGsrPattern = /^(16|18|19|20)?[0-9]{10}$/.test(ssn)
      if (!ssnMatchGsrPattern) {
        toast.error('Personal number must match the format YYYYMMDD-XXXX')
        reset()
        return
      }
    }

    const ssnIsNumber = /^\d+$/.test(ssn)

    if (!ssnIsNumber) {
      toast.error('Personal number can only contain numbers')
      reset()
      return
    }

    upsertCoInsured({
      fullName: name,
      personalNumber: ssn,
      email,
      phoneNumber,
    })

    setEditing(false)
    setCreating(false)
  }

  const reset = () => {
    setName(coInsured?.fullName ?? '')
    setPersonalNumber(coInsured?.personalNumber ?? '')
    setEmail(coInsured?.email ?? '')
    setPhoneNumber(coInsured?.phoneNumber ?? '')
    setEditing(false)
    setCreating(false)
  }

  const theme = useTheme()

  if (!creating && !coInsured) {
    return (
      <PlaceholderCard direction="column">
        <ExplanatoryText>Does the claim cover a co-insured?</ExplanatoryText>
        <Spacing top="small" />
        <Button
          variant="primary"
          onClick={() => {
            setEditing(true)
            setCreating(true)
          }}
          icon={
            <div style={{ marginTop: '0.05em', marginRight: '0.5em' }}>
              <PersonPlusFill />
            </div>
          }
        >
          Add information
        </Button>
      </PlaceholderCard>
    )
  }

  return (
    <CoInsuredCard ref={cardRef} onClick={() => setEditing(true)}>
      {editing && agreementCoInsured.length > 0 && (
        <Dropdown
          style={{ marginBottom: theme.spacing.small }}
          placeholder="Select from agreement"
        >
          {agreementCoInsured.map((option, idx) => (
            <DropdownOption
              key={idx}
              selected={`${option.firstName} ${option.lastName}` === name}
              onClick={() => {
                setName(`${option.firstName} ${option.lastName}`)
                setPersonalNumber(option.ssn ?? '')
              }}
            >
              {option.firstName} {option.lastName}{' '}
              {!!option.ssn && `(${formatSsn(option.ssn)})`}
            </DropdownOption>
          ))}
        </Dropdown>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <EditableField
          primary={true}
          editing={editing}
          placeholder="Full name of co-insured"
          value={name}
          required={true}
          onChange={(newValue) => {
            setName(newValue)
          }}
        />
        <div style={{ marginTop: '0.5em' }} />
        <EditableField
          icon={
            <div style={{ marginTop: '0.15em', marginRight: '0.3em' }}>
              <PersonFill fill={theme.accentContrast} />
            </div>
          }
          editing={editing}
          placeholder="Personal number"
          value={editing ? personalNumber : formatSsn(personalNumber)}
          required={true}
          onChange={(newValue) => {
            setPersonalNumber(newValue)
          }}
        />
        {(email || editing) && <div style={{ marginTop: '0.3em' }} />}
        <EditableField
          icon={
            <div style={{ marginTop: '0.15em', marginRight: '0.3em' }}>
              <EnvelopeFill fill={theme.accentContrast} />
            </div>
          }
          editing={editing}
          placeholder="E-mail (optional)"
          value={email}
          onChange={(newValue) => {
            setEmail(newValue)
          }}
        />
        {(phoneNumber || editing) && <div style={{ marginTop: '0.3em' }} />}
        <EditableField
          icon={
            <div style={{ marginTop: '0.15em', marginRight: '0.3em' }}>
              <PhoneFill fill={theme.accentContrast} />
            </div>
          }
          editing={editing}
          placeholder="Phone number (optional)"
          value={phoneNumber}
          onChange={(newValue) => {
            setPhoneNumber(newValue)
          }}
        />

        {editing && (
          <>
            <Spacing top="small" />
            <Flex direction="row" justify="space-between">
              <div>
                <Button variant="secondary" type="submit">
                  Save
                </Button>
                <Button
                  variant="primary"
                  style={{ marginLeft: '1em' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    reset()
                  }}
                >
                  Cancel
                </Button>
              </div>
              <Button
                status="danger"
                style={{ marginLeft: '1em' }}
                onClick={(e) => {
                  e.stopPropagation()
                  removeCoInsured()
                  reset()
                }}
              >
                Remove
              </Button>
            </Flex>
          </>
        )}
      </form>
    </CoInsuredCard>
  )
}
