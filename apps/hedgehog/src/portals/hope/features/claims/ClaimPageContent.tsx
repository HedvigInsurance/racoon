import * as React from 'react'
import { Flex } from '@hedvig-ui'
import styled from '@emotion/styled'
import { ClaimProvider, useClaim } from '@hope/features/claims/hooks/use-claim'
import { ClaimPageContentInner } from './ClaimPageContentInner'
import { ClaimsUiVersion, useClaimsUiVersion } from './hooks/useClaimsUiVersion'
import { ClaimPageContentInnerNew } from './new/ClaimPageContentInnerNew'
import { memberChatVisibleAtom } from '../chat/memberChatVisibleAtom'
import { useAtomValue } from 'jotai'
import { colors } from '@hedvig-ui/redesign'
import { theme } from '@hedvig-ui/redesign/theme'
import { Chat } from '../chat/Chat'

const ClaimContentWrapper = styled.div<{ background?: string }>`
  overflow-y: scroll;
  height: calc(100% - ${theme.footerHeight});
  width: 100%;
  flex-grow: 1;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
  background-color: ${({ background }) => background ?? 'initial'};

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const ClaimChatWrapper = styled.div`
  height: 100%;
  padding-bottom: ${theme.footerHeight};
  width: 0;
  min-width: 0;
  opacity: 0;
  transition:
    min-width 200ms 100ms ease-in-out,
    opacity 100ms ease-in-out;

  &.visible {
    transition:
      min-width 200ms ease-in-out,
      opacity 100ms 200ms ease-in-out;
    min-width: var(--chat-width);
    opacity: 1;
  }
`

export const ClaimPageContent: React.FC<{
  claimId: string
  isInboxView?: boolean
}> = ({ claimId, isInboxView = false }) => {
  const [claimsUiVersion] = useClaimsUiVersion()

  const memberChatVisible = useAtomValue(memberChatVisibleAtom)

  if (isInboxView) {
    return (
      <ClaimProvider claimId={claimId}>
        {claimsUiVersion === ClaimsUiVersion.NEW ? (
          <ClaimContentWrapper background={colors.opaque1}>
            <ClaimPageContentInnerNew isInboxView={true} />
          </ClaimContentWrapper>
        ) : (
          <ClaimPageContentInner standalone={false} />
        )}
      </ClaimProvider>
    )
  }

  return (
    <ClaimProvider claimId={claimId}>
      <Flex style={{ overflow: 'hidden' }}>
        {claimsUiVersion === ClaimsUiVersion.NEW ? (
          <ClaimContentWrapper background={colors.opaque1}>
            <ClaimPageContentInnerNew isInboxView={false} />
          </ClaimContentWrapper>
        ) : (
          <ClaimContentWrapper>
            <ClaimPageContentInner standalone={true} />
          </ClaimContentWrapper>
        )}
        <ClaimChatWrapper className={memberChatVisible ? 'visible' : undefined}>
          <ClaimChat />
        </ClaimChatWrapper>
      </Flex>
    </ClaimProvider>
  )
}

const ClaimChat = () => {
  const { memberId, conversation, claimId } = useClaim()
  return (
    <Chat.Root>
      <Chat.Content
        memberId={memberId}
        defaultConversation={conversation?.id}
        claimId={claimId}
      />
    </Chat.Root>
  )
}
