import styled from '@emotion/styled'
import { mq, theme } from 'ui'
import { Message } from '../Animations/Message/Message'
import { NumberPad } from '../Animations/NumberPad/NumberPad'

export const IconOptions = {
  Message: 'message',
  NumberPad: 'numberPad',
} as const

type ContactCardProps = {
  icon: (typeof IconOptions)[keyof typeof IconOptions]
  children: React.ReactNode
}

export const ContactCard = ({ icon, children }: ContactCardProps) => {
  const IconComponent = {
    message: Message,
    numberPad: NumberPad,
  }[icon]

  return (
    <Card>
      <IconContainer>
        <IconComponent />
      </IconContainer>
      {children}
    </Card>
  )
}

const IconContainer = styled.div({
  display: 'grid',
  placeItems: 'center',
})

const Card = styled.div({
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.md,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  padding: `${theme.space.xl} ${theme.space.sm}`,
  backdropFilter: 'blur(20px)',
  display: 'grid',
  justifyContent: 'center',
  alignItems: 'center',
  justifyItems: 'center',
  gap: theme.space.lg,
  textAlign: 'center',
  height: '100%',

  [mq.sm]: {
    paddingBlock: theme.space.xxl,
  },

  '@media (hover: hover)': {
    ':hover': { backgroundColor: theme.colors.gray200 },
  },
})
