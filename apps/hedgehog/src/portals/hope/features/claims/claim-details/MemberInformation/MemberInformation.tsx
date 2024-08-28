import styled from '@emotion/styled'
import { CardContent, Keys, Loadable, Spacing, Tabs } from '@hedvig-ui'
import chroma from 'chroma-js'
import copy from 'copy-to-clipboard'
import { MemberClaimsView } from '@hope/features/claims/claim-details/MemberInformation/components/MemberClaimsView'
import { MemberGeneralView } from '@hope/features/claims/claim-details/MemberInformation/components/MemberGeneralView'
import { MemberGsrView } from '@hope/features/claims/claim-details/MemberInformation/components/MemberGsrView'
import { getMemberFlag } from '@hope/features/member/utils'
import { useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { PickedLocale } from '@hope/features/config/constants'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import { useCommandLine } from '@hope/features/commands/hooks/use-command-line'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { MemberFossView } from '@hope/features/claims/claim-details/MemberInformation/components/MemberFossView'
import { MemberAppointmentsView } from './components/MemberAppointmentsView'
import { Tags } from '@hope/features/tags/Tags'

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${({ theme }) =>
    chroma(theme.accent).brighten(0.5).alpha(0.25).hex()};
  border-radius: 0.5rem;
  padding: 1rem;
  height: 10rem;

  div {
    h3 {
      font-size: 1.3rem;
      margin: 0;
      padding: 0 0 0.25rem;
    }

    a {
      font-size: 1rem;

      :hover {
        color: ${({ theme }) => chroma(theme.accent).brighten(1).hex()};
      }
    }
  }
`

export const MemberInformation: React.FC<{
  standalone?: boolean
}> = ({ standalone = false }) => {
  const [tab, setTab] = useState<
    'general' | 'claims' | 'gsr' | 'foss' | 'appointments'
  >('general')
  const { member, loading } = useClaim()
  const { registerActions } = useCommandLine()
  const navigate = useNavigate()
  const memberId = member?.memberId

  if (!memberId) {
    return null
  }

  registerActions([
    {
      label: `Go to member`,
      keys: [Keys.Option, Keys.M],
      onResolve: () => {
        if (standalone) return
        navigate(`/members/${memberId}`)
      },
    },
    {
      label: 'Copy member ID',
      keys: [Keys.Option, Keys.I],
      onResolve: () => {
        copy(memberId)
        toast.success('Member ID copied to clipboard')
      },
    },
    {
      label: 'Copy member link',
      keys: [Keys.Option, Keys.L],
      onResolve: () => {
        copy(`${window.location.origin}/members/${memberId}`)
        toast.success('Member link copied to clipboard')
      },
    },
  ])

  const totalClaimsWithoutDuplicates =
    member?.claims.reduce(
      (count, claim) =>
        claim.subclaims[0]?.outcome !== 'DUPLICATE' ? count + 1 : count,
      0,
    ) ?? []

  const totalGsrClaims = member?.gsrClaims.length

  const flag = member
    ? getMemberFlag(
        member.contractMarketInfo,
        member.pickedLocale as PickedLocale,
      )
    : ''

  const tabs = [
    {
      active: tab === 'general',
      title: 'General',
      action: () => {
        PushUserAction('claim', 'view', 'member_overview_tab', null)
        setTab('general')
      },
    },
    {
      active: tab === 'claims',
      title: `Claims (${totalClaimsWithoutDuplicates})`,
      action: () => {
        PushUserAction('claim', 'view', 'member_claims_tab', null)
        setTab('claims')
      },
    },
  ]
  if (member?.contractMarketInfo?.market === 'SWEDEN') {
    tabs.push({
      active: tab === 'gsr',
      title: `GSR (${totalGsrClaims})`,
      action: () => {
        PushUserAction('claim', 'view', 'member_gsr_tab', null)
        setTab('gsr')
      },
    })
    if (member.firstVetAppointments.length) {
      tabs.push({
        active: tab === 'appointments',
        title: `Journals (${member.firstVetAppointments.length})`,
        action: () => {
          PushUserAction('claim', 'view', 'member_appointments_tab', null)
          setTab('appointments')
        },
      })
    }
  }
  if (member?.contractMarketInfo?.market === 'NORWAY') {
    tabs.push({
      active: tab === 'foss',
      title: `FOSS`,
      action: () => {
        PushUserAction('claim', 'view', 'member_foss_tab', null)
        setTab('foss')
      },
    })
  }

  return (
    <CardContent>
      <Loadable loading={loading}>
        <MemberCard>
          <div>
            <h3>
              {(member?.firstName ?? '') + ' ' + (member?.lastName ?? '')}
            </h3>
            <Tags resourceId={member.memberId} tags={member.tags ?? []} />
            {standalone ? (
              <Link to={`/members/${memberId}`}>{memberId}</Link>
            ) : (
              <a
                href="#"
                onClick={() => {
                  copy(memberId || '', {
                    format: 'text/plain',
                  })
                  toast.success('Member ID copied to clipboard')
                }}
              >
                {memberId}
              </a>
            )}
          </div>
          <div>{flag}</div>
        </MemberCard>
        <Spacing top="small" />
        <Tabs list={tabs} />
        {tab === 'general' && <MemberGeneralView />}
        {tab === 'claims' && (
          <>
            <Spacing top="small" />
            <MemberClaimsView slim={!standalone} />
          </>
        )}
        {tab === 'gsr' && (
          <>
            <Spacing top="small" />
            <MemberGsrView slim={!standalone} />
          </>
        )}
        {tab === 'appointments' && (
          <>
            <Spacing top="small" />
            <MemberAppointmentsView />
          </>
        )}
        {tab === 'foss' && (
          <>
            <Spacing top="small" />
            <MemberFossView />
          </>
        )}
      </Loadable>
    </CardContent>
  )
}
