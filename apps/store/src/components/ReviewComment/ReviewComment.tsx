import styled from '@emotion/styled'
import { Text, Badge, theme } from 'ui'
import { Stars } from '@/components/Stars/Stars'

type Props = {
  score: number
  date: string
  author: string
  content: string
}

export const ReviewComment = ({ content, date, author, score }: Props) => {
  return (
    <Wrapper>
      <Stars score={score} />
      <Content>
        <Text balance={true}>{content}</Text>
      </Content>
      <Footer>
        <Text
          size={{
            _: 'sm',
          }}
          color="textSecondaryOnGray"
        >
          {author}
        </Text>
        <Badge color="blueFill2">{date}</Badge>
      </Footer>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  flex: '0 0 auto',

  display: 'inline-flex',
  flexDirection: 'column',
  gap: theme.space.md,
  padding: theme.space.md,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.gray200,
  width: '16.25rem',
  aspectRatio: '1 / 1',
})

const Content = styled.div({
  flex: '1 0',
})

const Footer = styled.footer({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})
