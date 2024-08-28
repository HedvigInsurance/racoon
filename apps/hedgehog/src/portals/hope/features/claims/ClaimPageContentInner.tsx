import {
  addSToName,
  Button,
  Card,
  CardsWrapper,
  CardTitle,
  FadeIn,
  Footer,
  Keys,
  Paragraph,
  useTitle,
} from '@hedvig-ui'
import { ClaimInformation } from '@hope/features/claims/claim-details/ClaimInformation/ClaimInformation'
import { ClaimRestrictionInformation } from '@hope/features/claims/claim-details/ClaimRestrictionInformation'
import { ClaimFileTable } from '@hope/features/claims/claim-details/ClaimFiles'
import { ClaimEvents } from '@hope/features/claims/claim-details/ClaimEvents'
import styled from '@emotion/styled'
import { usePushMemberHistory } from '@hope/common/hooks/use-push-member-history'
import { ClaimSubclaims } from '@hope/features/claims/claim-details/ClaimSubclaims/ClaimSubclaims'
import { MemberInformation } from '@hope/features/claims/claim-details/MemberInformation/MemberInformation'
import { useEffect, useState } from 'react'
import { ClaimCounterparty } from './claim-details/ClaimCounterparty'
import { ClaimTranscriptions } from './claim-details/ClaimTranscriptions'
import { ClaimMemberStatement } from '@hope/features/claims/claim-details/ClaimMemberStatement'
import { CommandHotkey } from '../commands/components/CommandHotkey'
import { ClaimNotesModal } from './claim-details/ClaimNotes/ClaimNotesModal'
import { ClaimNotes } from './claim-details/ClaimNotes'
import { useSidebarLayout } from '@hope/common/components/layouts/SidebarLayout/SidebarLayout'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { ClaimItems } from '@hope/features/claims/claim-details/ClaimItems'
import { useTaskTabs } from '@hope/features/tasks/hooks/use-task-tabs'
import { formatDate } from 'date-fns/format'
import { parseISO } from 'date-fns'
import { ClaimInformationTags } from './claim-details/ClaimInformationTags'
import { ClaimUiVersionSwitcher } from '@hope/features/claims/ClaimUiVersionSwitcher'
import { ToggleMemberChatButton } from '@hope/features/chat/ToggleMemberChatButton'
import { theme } from '@hedvig-ui/redesign/theme'

const Container = styled.div`
  padding: 1rem;
  margin-bottom: ${theme.footerHeight};
`

const ShowEventButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1em;
`

const ClaimCard = styled(Card)`
  margin: 0 0 1rem;
`

const InfoTagsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.tiny};
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  padding: 1rem;
  z-index: 10;
  background: ${({ theme }) => theme.backgroundLight};
`

export const ClaimPageContentInner = ({ standalone = false }) => {
  const [showEvents, setShowEvents] = useState(false)
  const { renameTab } = useTaskTabs()
  const [showMemberStatement, setShowMemberStatement] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const { collapsed, temporaryView } = useSidebarLayout()
  const {
    claimId,
    claimOpenedAt,
    claimTranscriptions,
    claimNumber,
    memberFreeText,
    restriction,
    member,
  } = useClaim()
  useTitle(
    member?.firstName
      ? `${addSToName(member.firstName)} claim`
      : `Claim Details`,
  )

  useEffect(() => {
    if (claimOpenedAt) {
      renameTab(
        claimId,
        `Claim ${claimNumber} (${formatDate(parseISO(claimOpenedAt), 'dd MMMM, yyyy')})`,
      )
    }
  }, [claimOpenedAt, claimId, claimNumber, renameTab])

  usePushMemberHistory(member?.memberId)

  return (
    <>
      <FadeIn>
        <InfoTagsContainer>
          <ClaimInformationTags />
        </InfoTagsContainer>

        <Container>
          {!!restriction && (
            <CardsWrapper>
              <ClaimCard>
                <ClaimRestrictionInformation />
              </ClaimCard>
            </CardsWrapper>
          )}
          <CardsWrapper
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <ClaimCard>
              <MemberInformation standalone={standalone} />
            </ClaimCard>

            <ClaimCard>
              <ClaimInformation />
            </ClaimCard>
          </CardsWrapper>

          {!!memberFreeText && (
            <CardsWrapper contentWrap="noWrap">
              <ClaimCard>
                <CardTitle title="Member Answer" />
                <Paragraph style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
                  {memberFreeText}
                </Paragraph>
              </ClaimCard>
            </CardsWrapper>
          )}

          {!!claimTranscriptions.length && (
            <CardsWrapper contentWrap="noWrap">
              <ClaimCard>
                <ClaimTranscriptions />
              </ClaimCard>
            </CardsWrapper>
          )}
          <CardsWrapper contentWrap="noWrap">
            <ClaimCard>
              <ClaimNotes />
            </ClaimCard>
          </CardsWrapper>

          <CardsWrapper contentWrap="noWrap">
            <ClaimCard>
              <ClaimItems claimId={claimId} />
            </ClaimCard>
          </CardsWrapper>

          <CardsWrapper>
            <ClaimCard span={3}>
              <ClaimSubclaims />
            </ClaimCard>
          </CardsWrapper>

          <CardsWrapper contentWrap="noWrap">
            <ClaimCard>
              <ClaimCounterparty />
            </ClaimCard>
          </CardsWrapper>

          <CardsWrapper>
            <ClaimCard>
              <ClaimMemberStatement
                claimId={claimId}
                isEditing={showMemberStatement}
                setIsEditing={setShowMemberStatement}
              />
            </ClaimCard>
          </CardsWrapper>

          <CardsWrapper contentWrap="noWrap">
            <ClaimCard>
              <ClaimFileTable claimId={claimId} />
            </ClaimCard>
          </CardsWrapper>

          {showEvents ? (
            <CardsWrapper contentWrap="noWrap">
              <ClaimCard>
                <Button
                  style={{ marginInline: 'auto' }}
                  variant="tertiary"
                  onClick={() => setShowEvents(false)}
                >
                  Hide events
                </Button>
                <ClaimEvents claimId={claimId} />
              </ClaimCard>
            </CardsWrapper>
          ) : (
            <ShowEventButtonWrapper>
              <Button variant="tertiary" onClick={() => setShowEvents(true)}>
                Show events
              </Button>
            </ShowEventButtonWrapper>
          )}
        </Container>
      </FadeIn>
      <Footer
        sidebarCollapsed={collapsed && !temporaryView}
        isInboxView={!standalone}
      >
        <CommandHotkey
          text="Toggle Note"
          keys={[Keys.Option, Keys.Q]}
          onResolve={() =>
            setTimeout(() => {
              if (showNotes) {
                setShowNotes(false)
              } else {
                setShowNotes(true)
              }
            })
          }
          side="left"
        >
          <Button
            variant="secondary"
            onClick={() => setShowNotes((current) => !current)}
          >
            Notes
          </Button>
        </CommandHotkey>
        <ClaimUiVersionSwitcher />
        {standalone && (
          <div style={{ marginLeft: 'auto' }}>
            <ToggleMemberChatButton />
          </div>
        )}
      </Footer>
      {showNotes && <ClaimNotesModal onClose={() => setShowNotes(false)} />}
    </>
  )
}
