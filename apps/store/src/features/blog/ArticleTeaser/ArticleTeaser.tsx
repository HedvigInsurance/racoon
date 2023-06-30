import styled from '@emotion/styled'
import NextImage, { type ImageProps } from 'next/image'
import Link from 'next/link'
import { type ReactNode } from 'react'
import { Heading, Space, Text, theme } from 'ui'

type Props = {
  children: ReactNode
  title: string
  ingress: string
  href: string
  date: string
}

const Root = (props: Props) => {
  return (
    <Wrapper y={1}>
      <Space y={1}>
        {props.children}
        <ContentWrapper>
          <Text size="sm" color="textSecondary" uppercase={true}>
            {props.date}
          </Text>
        </ContentWrapper>
      </Space>
      <ContentWrapper>
        <ClampedText>
          <Space y={0.25}>
            <ExtendedLink href={props.href} style={{ display: 'block' }}>
              <Heading as="h3" variant="standard.20">
                {props.title}
              </Heading>
            </ExtendedLink>
            <Text as="p" size="lg" color="textSecondary">
              {props.ingress}
            </Text>
          </Space>
        </ClampedText>
      </ContentWrapper>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  position: 'relative',
})

const RoundedImage = styled(NextImage)({
  borderRadius: theme.radius.xl,
  aspectRatio: '3 / 2',
  objectFit: 'cover',
})
const Image = (props: ImageProps) => <RoundedImage {...props} />

const ContentWrapper = styled.div({ paddingInline: theme.space.xs })

const ExtendedLink = styled(Link)({
  // Make the whole teaser clickable
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },
})

const ClampedText = styled.div({
  display: '-webkit-box',
  WebkitLineClamp: 5,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

export const ArticleTeaser = {
  Root,
  Image,
} as const
