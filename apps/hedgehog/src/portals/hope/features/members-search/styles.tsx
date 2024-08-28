import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Button, fadeIn, Paragraph } from '@hedvig-ui'
import { Search as SearchBootstrapIcon } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import { Instructions } from '@hope/features/search/components/Instructions'

export const MemberSuggestionsWrapper = styled(Instructions)({
  paddingTop: '25vh',
  width: '100%',
  maxWidth: '50rem',
  animation: `${fadeIn(1)} 1000ms forwards`,
  animationDelay: '750ms',
})

export const NewSearchWrapper = styled(Instructions)({
  width: '100%',
  maxWidth: '50rem',
  animation: `${fadeIn(1)} 1000ms forwards`,
  animationDelay: '750ms',
})

export const NoMembers = styled(Instructions)({
  width: '100%',
  flex: 1,
  alignItems: 'center',
  fontSize: '1.5rem',
  paddingTop: '25vh',
})

export const ExtraInstruction = styled('div')({
  opacity: 0,
  animation: `${fadeIn(1)} 1000ms forwards`,
  animationDelay: '1000ms',
})

export const Group = styled('div')<{ pushLeft?: boolean }>(({ pushLeft }) => ({
  paddingBottom: '1rem',
  paddingLeft: pushLeft ? '1rem' : 0,
}))

export const SearchInputGroup = styled('div')({
  display: 'flex',
  position: 'relative',
  fontSize: '1rem',
  maxWidth: '50rem',
})

export const SearchIcon = styled(SearchBootstrapIcon)<{ muted?: boolean }>(
  ({ muted, theme }) => ({
    transform: 'translateY(-1.5px)',
    zIndex: 1,
    fill: muted ? theme.mutedText : theme.foreground,
    transition: 'fill 300ms',
  }),
)

export const EscapeButton = styled(Button)<{ visible: number }>(
  ({ visible }) => ({
    opacity: visible,
    transition: 'opacity 300ms',
    marginLeft: '4rem',
  }),
)

export const MemberHistoryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -1rem;
  width: calc(100% + 1rem);
`

export const EmptyState = styled.div`
  font-style: italic;
  margin-left: 1rem;
  color: ${({ theme }) => theme.mutedText};
`

export const MemberHistoryCardWrapper = styled(Link)<{ muted: boolean }>`
  display: flex;
  flex-direction: column;
  width: calc((100% / 3) - 1rem);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-left: 1rem;
  min-height: 5rem;
  margin-bottom: 1rem;
  & {
    ${({ theme, muted }) => css`
      background: ${theme.foreground};
      color: ${theme.backgroundLight} !important;

      ${muted && 'opacity: 0.5;'};
    `};
  }
`

export const MemberName = styled.span`
  display: block;
`

export const MemberId = styled.span`
  display: block;
  color: ${({ theme }) => theme.mutedText};
`

export const SearchTip = styled(Paragraph)`
  width: fit-content;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
  margin-left: 13rem;
`
