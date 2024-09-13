import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { Text, xStack } from 'ui'
import type { CurrencyCode } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'

type Props = ComponentProps<'div'> & {
  currencyCode: CurrencyCode
  amount: number
  reducedAmount?: number

  color?: ComponentProps<typeof Text>['color']
  secondaryColor?: ComponentProps<typeof Text>['color']
}

export const Price = ({
  color = 'textPrimary',
  secondaryColor = 'textSecondary',
  reducedAmount,
  amount,
  currencyCode,
  className,
  ...props
}: Props) => {
  const formatter = useFormatter()

  return (
    <div className={clsx(xStack({ gap: 'xs' }), className)} {...props}>
      {reducedAmount !== undefined && (
        <Text as="p" size="md" strikethrough={true} color={secondaryColor}>
          {formatter.monthlyPrice({
            amount,
            currencyCode,
          })}
        </Text>
      )}
      <Text as="p" size="md" color={color}>
        {formatter.monthlyPrice({
          currencyCode,
          amount: reducedAmount ?? amount,
        })}
      </Text>
    </div>
  )
}
