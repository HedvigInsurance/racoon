import styled from '@emotion/styled'
import { Copyable, formatSsn, HotkeyStyled, Keys, Popover } from '@hedvig-ui'
import copy from 'copy-to-clipboard'
import { PickedLocale, PickedLocaleFlag } from '@hope/features/config/constants'
import * as React from 'react'
import { Clipboard } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { Member } from 'types/generated/graphql'
import { useCommandLine } from '@hope/features/commands/hooks/use-command-line'
import { CustomerIOActions } from './CustomerIOActions'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.mutedText};
  padding-bottom: 4rem;
`

const MemberDetail = styled.span`
  position: relative;
  padding-right: 1rem;
`

const MemberDetailLink = MemberDetail.withComponent('a')

const CopyIcon = styled(Clipboard)`
  height: 15px;
  width: 15px;
  cursor: pointer;
`

const Hotkey = styled(HotkeyStyled)`
  font-size: 0.7rem;
  color: black;
  right: 50%;
  top: 25px;
`

interface MemberDetailsProps {
  memberId: string
  member: Member
}

export const MemberDetails: React.FC<MemberDetailsProps> = ({
  memberId,
  member,
}) => {
  const location = useLocation()

  const { registerActions, isHintingOption } = useCommandLine()

  registerActions([
    {
      label: 'Copy email',
      keys: [Keys.Option, Keys.E],
      onResolve: () => {
        copy(member.email || '', {
          format: 'text/plain',
        })
        toast.success('Email copied')
      },
    },
    {
      label: 'Copy phone number',
      keys: [Keys.Option, Keys.N],
      onResolve: () => {
        copy(member.phoneNumber || '', {
          format: 'text/plain',
        })
        toast.success('Phone number copied')
      },
    },
    {
      label: 'Copy ID',
      keys: [Keys.Option, Keys.M],
      onResolve: () => {
        copy(memberId, {
          format: 'text/plain',
        })
        toast.success('ID copied')
      },
    },
  ])

  return (
    <Wrapper>
      {member?.signedOn && member?.personalNumber && (
        <MemberDetail>
          <Copyable
            textValue={formatSsn(member?.personalNumber)}
            copyValue={member?.personalNumber}
            textLabel="personal number"
          />
        </MemberDetail>
      )}

      {member?.email && (
        <MemberDetail>
          <Copyable textLabel="email" textValue={member?.email} />
          {isHintingOption && <Hotkey dark>E</Hotkey>}
        </MemberDetail>
      )}
      {member?.phoneNumber && (
        <MemberDetail>
          <Copyable textLabel="phone number" textValue={member?.phoneNumber} />
          {isHintingOption && <Hotkey dark>N</Hotkey>}
        </MemberDetail>
      )}

      <Popover contents="Click to copy member link">
        <MemberDetailLink
          href={`${window.location.protocol}//${window.location.host}/members/${member.memberId}`}
          onClick={(e) => {
            e.preventDefault()
            const tabMaybe = location.pathname.includes(member.memberId)
              ? location.pathname.split(member.memberId)[1]
              : ''

            copy(
              `${window.location.protocol}//${window.location.host}/members/${member.memberId}${tabMaybe}`,
              {
                format: 'text/plain',
              },
            )
            toast.success('Member link copied')
          }}
        >
          {memberId}
          {isHintingOption && <Hotkey dark>M</Hotkey>}
        </MemberDetailLink>
      </Popover>
      <Popover contents="Click to copy Member ID">
        <CopyIcon
          onClick={() => {
            copy(memberId, {
              format: 'text/plain',
            })
            toast.success('Member ID copied')
          }}
        />
      </Popover>

      {member?.pickedLocale && (
        <MemberDetail style={{ paddingLeft: '1rem' }}>
          Language: {PickedLocaleFlag[member.pickedLocale as PickedLocale]}
        </MemberDetail>
      )}
      <MemberDetail style={{ paddingLeft: '1rem' }}>
        <CustomerIOActions member={member} />
      </MemberDetail>
    </Wrapper>
  )
}
