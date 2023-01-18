import styled from '@emotion/styled'
import { CrossIcon, CheckIcon } from 'ui'

export type CoverageListProps = {
  heading: string
  items: Array<string>
  variant: 'covered' | 'not-covered'
}

export const CoverageList = ({ heading, items, variant }: CoverageListProps) => {
  if (items.length === 0) return null

  return (
    <Wrapper>
      <Heading>{heading}</Heading>
      <List>
        {items.map((item, index) => (
          <Item key={index}>
            <NoShrink>
              {variant === 'covered' ? (
                <CheckIcon color="currentColor" size="0.75rem" />
              ) : (
                <CrossIcon color="currentColor" size="0.75rem" />
              )}
            </NoShrink>
            {item}
          </Item>
        ))}
      </List>
    </Wrapper>
  )
}

const Wrapper = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[1],
}))

const Heading = styled.h3({
  fontWeight: 'bold',
})

const List = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[1],
}))

const Item = styled.li(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space[2],
}))

const NoShrink = styled.div({ flexShrink: 0 })
