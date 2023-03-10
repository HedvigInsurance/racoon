import Link, { LinkProps } from 'next/link'
import { ComponentProps } from 'react'
import { Button } from 'ui'

type ButtonProps = ComponentProps<typeof Button>

type Props = LinkProps &
  Partial<Pick<HTMLAnchorElement, 'target'>> &
  Pick<ButtonProps, 'variant' | 'size' | 'loading' | 'onClick' | 'children' | 'className'>

export const ButtonNextLink = (props: Props) => {
  const { onClick, variant, size, loading, children, className, target, ...linkProps } = props
  return (
    <Link {...linkProps} passHref legacyBehavior>
      <Button
        onClick={onClick}
        variant={variant}
        size={size}
        loading={loading}
        {...(target === '_blank' ? { target: '_blank', rel: 'noreferrer' } : {})}
        className={className}
      >
        {children}
      </Button>
    </Link>
  )
}
