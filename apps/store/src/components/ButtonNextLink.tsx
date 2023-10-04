import Link, { type LinkProps } from 'next/link'
import { type ComponentProps } from 'react'
import { Button } from 'ui'

type ButtonProps = ComponentProps<typeof Button>

type Props = LinkProps &
  Partial<Pick<HTMLAnchorElement, 'target' | 'title' | 'download'>> &
  Pick<ButtonProps, 'variant' | 'size' | 'loading' | 'onClick' | 'children' | 'className'>

export const ButtonNextLink = (props: Props) => {
  const { onClick, variant, size, loading, children, className, title, target, ...linkProps } =
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
        {...(target === '_blank' ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </Button>
    </Link>
  )
}
