import { Slot } from '@radix-ui/react-slot'
import { type RecipeVariants } from '@vanilla-extract/recipes'
import clsx from 'clsx'
import { type ComponentProps, type PropsWithChildren } from 'react'
import { Heading, Text } from 'ui'
import { cardHeader, cardRoot } from './Card.css'

type RootStyleProps = RecipeVariants<typeof cardRoot>
type RootProps = ComponentProps<'div'> & RootStyleProps

function CardRoot({ variant, size, className, children }: PropsWithChildren<RootProps>) {
  return <article className={clsx(cardRoot({ variant, size }), className)}>{children}</article>
}

type HeaderProps = ComponentProps<'header'>

function CardHeader({ className, children }: PropsWithChildren<HeaderProps>) {
  return <header className={clsx(cardHeader, className)}>{children}</header>
}

type MediaProps = ComponentProps<typeof Slot>

function CardMedia({ children }: PropsWithChildren<MediaProps>) {
  return <Slot>{children}</Slot>
}

type HeadingProps = ComponentProps<'div'>

function CardHeading({ className, children }: PropsWithChildren<HeadingProps>) {
  return <div className={className}>{children}</div>
}

type TitleProps = ComponentProps<typeof Heading>

function CardTitle({ className, children }: PropsWithChildren<TitleProps>) {
  return (
    <Heading variant="standard.18" className={className}>
      {children}
    </Heading>
  )
}

type SubtitleProps = ComponentProps<typeof Text>

function CartSubtitle({ className, children }: PropsWithChildren<SubtitleProps>) {
  return (
    <Text color="textSecondary" className={className}>
      {children}
    </Text>
  )
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Media: CardMedia,
  Heading: CardHeading,
  Title: CardTitle,
  Subtitle: CartSubtitle,
}
