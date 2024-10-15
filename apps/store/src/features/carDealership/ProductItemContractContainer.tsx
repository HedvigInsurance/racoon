import { useTranslation } from 'next-i18next'
import { Text, Card, yStack, Divider } from 'ui'
import { DetailsList } from '@/components/DetailsList/DetailsList'
import { Pillow } from '@/components/Pillow/Pillow'
import { ProductDetails } from '@/components/ProductCard/components/ProductDetails'
import { ProductDocuments } from '@/components/ProductCard/components/ProductDocuments'
import { ProductCardDetails } from '@/components/ProductCard/ProductCardDetails'
import { TotalPrice } from '@/components/TotalPrice/TotalPrice'
import type { Money } from '@/services/graphql/generated'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'
import { type TrialContract } from './carDealership.types'

type Props = {
  contract: TrialContract
  crossedOutAmount?: Money
}

export const ProductItemContractContainerCar = ({ contract, crossedOutAmount }: Props) => {
  const formatter = useFormatter()
  const { t } = useTranslation(['carDealership', 'cart', 'common'])

  const productDetails = contract.displayItems.map((item) => ({
    title: item.displayTitle,
    value: item.displayValue,
  }))

  // Only show crossed over amount if default offer is more expensive than the trial
  const shouldShowCrossedOutAmount =
    crossedOutAmount !== undefined && crossedOutAmount.amount > contract.premium.amount

  const productPrice = {
    ...contract.premium,
    ...(shouldShowCrossedOutAmount ? { reducedAmount: crossedOutAmount.amount } : {}),
  }

  const endDate = convertToDate(contract.activeTo)
  if (endDate === null) throw new Error(`Invalid end date for contract ${contract.id}`)

  const expirationDate = formatter.dateFull(endDate, { abbreviateMonth: true })

  return (
    <Card.Root>
      <Card.Header>
        <Card.Media>
          <Pillow size="small" role="presentation" src={contract.pillowSrc} alt="" />
        </Card.Media>

        <Card.Heading>
          <Card.Title variant={{ _: 'standard.16', sm: 'standard.18' }}>
            {contract.productVariant.displayName}
          </Card.Title>
          <Card.Subtitle size={{ _: 'body', sm: 'md' }}>
            {contract.exposureDisplayName}
          </Card.Subtitle>
        </Card.Heading>
      </Card.Header>

      <ProductCardDetails.Root>
        <ProductCardDetails.Trigger>
          {(isOpen) =>
            isOpen
              ? t('HIDE_DETAILS_BUTTON_LABEL', { ns: 'cart' })
              : t('SHOW_DETAILS_BUTTON_LABEL', { ns: 'cart' })
          }
        </ProductCardDetails.Trigger>

        <ProductCardDetails.Content className={yStack({ paddingBlock: 'md', gap: 'md' })}>
          <ProductDetails details={productDetails} />
          <ProductDocuments documents={contract.productVariant.documents} />
        </ProductCardDetails.Content>
      </ProductCardDetails.Root>

      <DetailsList.Root>
        <DetailsList.Item>
          <DetailsList.Label>{contract.productVariant.displayName}</DetailsList.Label>
          <DetailsList.Value>
            <Text as="span" size="xs">
              {formatter.monthlyPrice({
                currencyCode: productPrice.currencyCode,
                amount: productPrice.amount,
              })}
            </Text>
          </DetailsList.Value>
        </DetailsList.Item>

        <DetailsList.Item>
          <DetailsList.Label>{t('TRIAL_TERMINATION_DATE_MESSAGE')}</DetailsList.Label>
          <DetailsList.Value>
            <Text as="span" size="xs">
              {expirationDate}
            </Text>
          </DetailsList.Value>
        </DetailsList.Item>
      </DetailsList.Root>

      <Divider />

      <TotalPrice {...productPrice} label={t('common:YOUR_PRICE')} />
    </Card.Root>
  )
}
