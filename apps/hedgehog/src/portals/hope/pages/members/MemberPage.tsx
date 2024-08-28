import { MemberPageContent } from '@hope/features/member'
import { useNavigate, useParams } from 'react-router-dom'
import { Flex, Footer } from '@hedvig-ui'
import styled from '@emotion/styled'
import { ToggleMemberChatButton } from '@hope/features/chat/ToggleMemberChatButton'
import { useAtomValue } from 'jotai'
import { memberChatVisibleAtom } from '@hope/features/chat/memberChatVisibleAtom'
import { theme } from '@hedvig-ui/redesign/theme'
import { Chat } from '@hope/features/chat/Chat'
import { useSidebarLayout } from '@hope/common/components/layouts/SidebarLayout'

const MemberContentWrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  width: 100%;
  flex-grow: 1;
  /* box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2); */
  border-right: 1px solid ${theme.colors.borderTranslucent1};
  background-color: white;

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const MemberChatWrapper = styled.div`
  height: 100%;
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

const MemberPage: React.FC = () => {
  const { memberId, tab } = useParams<{ memberId: string; tab?: string }>()
  const navigate = useNavigate()
  const { collapsed, temporaryView } = useSidebarLayout()
  const memberChatVisible = useAtomValue(memberChatVisibleAtom)

  if (!memberId) {
    return
  }
  return (
    <Flex style={{ overflow: 'hidden', paddingBottom: theme.footerHeight }}>
      <MemberContentWrapper>
        <MemberPageContent
          memberId={memberId}
          tab={tab ?? 'contracts'}
          onChangeTab={(newTab) =>
            navigate(`/members/${memberId}/${newTab}`, { replace: true })
          }
          onClickClaim={(claimId) => navigate(`/claims/${claimId}`)}
        />
      </MemberContentWrapper>
      <Footer
        sidebarCollapsed={collapsed && !temporaryView}
        isInboxView={false}
      >
        <Flex justify="right">
          <ToggleMemberChatButton />
        </Flex>
      </Footer>
      <MemberChatWrapper className={memberChatVisible ? 'visible' : undefined}>
        <Chat.Root>
          <Chat.Content memberId={memberId} />
        </Chat.Root>
      </MemberChatWrapper>
    </Flex>
  )
}

export default MemberPage
