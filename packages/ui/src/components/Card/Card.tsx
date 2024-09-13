import { Slot } from '@radix-ui/react-slot'
import { type RecipeVariants } from '@vanilla-extract/recipes'
import clsx from 'clsx'
import { type ComponentProps, type PropsWithChildren } from 'react'
import { Heading, Text } from 'ui'
import { cardAside, cardHeader, cardRoot } from './Card.css'

type RootStyleProps = RecipeVariants<typeof cardRoot>
type RootProps = ComponentProps<'article'> & RootStyleProps
function CardRoot({ variant, size, className, children, ...props }: RootProps) {
  return (
    <article className={clsx(cardRoot({ variant, size }), className)} {...props}>
      {children}
    </article>
  )
}

type HeaderProps = ComponentProps<'header'>
function CardHeader({ className, children, ...props }: HeaderProps) {
  return (
    <header className={clsx(cardHeader, className)} {...props}>
      {children}
    </header>
  )
}

function CardMedia({ children }: PropsWithChildren) {
  // Slot ensures only one element is passed as children
  return <Slot>{children}</Slot>
}

type HeadingProps = ComponentProps<'div'>
function CardHeading({ className, children, ...props }: HeadingProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

type TitleProps = ComponentProps<typeof Heading>
function CardTitle({ className, children, ...props }: TitleProps) {
  return (
    <Heading variant="standard.18" className={className} {...props}>
      {children}
    </Heading>
  )
}

type SubtitleProps = ComponentProps<typeof Text>
function CardSubtitle({ className, children, ...props }: SubtitleProps) {
  return (
    <Text color="textSecondary" className={className} {...props}>
      {children}
    </Text>
  )
}

type AsideProps = ComponentProps<typeof Slot>
function CardAside({ className, children, ...props }: PropsWithChildren<AsideProps>) {
  return (
    <Slot className={clsx(cardAside, className)} {...props}>
      {children}
    </Slot>
  )
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Media: CardMedia,
  Heading: CardHeading,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Aside: CardAside,
}
