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
          <Space y={0.75}>
            <Text size="sm" color="textSecondary" uppercase={true}>
              {props.date}
            </Text>
            <ExtendedLink href={props.href} style={{ display: 'block' }}>
              <Heading as="h3" variant="standard.20">
                {props.title}
              </Heading>
            </ExtendedLink>
          </Space>
        </ContentWrapper>
      </Space>
      <ContentWrapper>
        <ClampedText size="lg" color="textSecondary">
          {props.ingress}
        </ClampedText>
      </ContentWrapper>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
})

const RoundedImage = styled(NextImage)({
  borderRadius: theme.radius.xl,
  aspectRatio: '3 / 2',
  objectFit: 'cover',
})
const Image = (props: ImageProps) => <RoundedImage {...props} />

type ContentProps = {
  children: ReactNode
  title: string
  href: string
  date: string
}

const Content = (props: ContentProps) => {
  return (
    <ContentWrapper>
      <Space y={0.75}>
        <div>
          <ExtendedLink href={props.href}>
            <Heading as="h3" variant="standard.20">
              {props.title}
            </Heading>
          </ExtendedLink>
          <ClampedText size="lg" color="textSecondary">
            {props.children}
          </ClampedText>
        </div>
      </Space>
    </ContentWrapper>
  )
}

const ContentWrapper = styled.div({ paddingInline: theme.space.xs })

const ExtendedLink = styled(Link)({
  // Make the whole teaser clickable
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },
})

const ClampedText = styled(Text)({
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

export const ArticleTeaser = {
  Root,
  Image,
  Content,
} as const
