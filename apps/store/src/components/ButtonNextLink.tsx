import Link, { type LinkProps } from 'next/link'
import { type ComponentProps } from 'react'
import { Button } from 'ui'

type ButtonProps = ComponentProps<typeof Button>

type Props = LinkProps &
  Partial<Pick<HTMLAnchorElement, 'target' | 'title' | 'download' | 'rel'>> &
  Pick<ButtonProps, 'variant' | 'size' | 'loading' | 'onClick' | 'children' | 'className'>

export const ButtonNextLink = (props: Props) => {
  const { onClick, variant, size, loading, children, className, title, target, rel, ...linkProps } =
    props
  return (
    <Link {...linkProps} passHref={true} legacyBehavior={true}>
      <Button
        onClick={onClick}
        variant={variant}
        size={size}
        loading={loading}
        title={title}
        className={className}
        rel={rel}
        target={target}
      >
        {children}
      </Button>
    </Link>
  )
}
