import styled from '@emotion/styled'
import { mq, theme } from 'ui'

const Card = styled.div({
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.md,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  padding: `${theme.space.xl} ${theme.space.lg}`,
  backdropFilter: 'blur(20px)',
  display: 'grid',
  justifyContent: 'center',
  alignItems: 'center',
  justifyItems: 'center',
  gap: theme.space.lg,
  textAlign: 'center',
  height: '100%',

  '@media (hover: hover)': {
    ':hover': { backgroundColor: theme.colors.gray200 },
  },

  [mq.sm]: {
    paddingBlock: theme.space.xxxl,
  },
})

const Icon = styled.div({
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
  color: theme.colors.gray900,
  backgroundColor: '#D8EFB6', // Swap with token when available
  borderRadius: theme.radius.md,
})

type Props = {
  icon: string
  children?: React.ReactNode
}
export const ContactCard = ({ icon, children }: Props) => {
  return (
    <Card>
      <Icon>{icon}</Icon>
      <div>{children}</div>
    </Card>
  )
}
