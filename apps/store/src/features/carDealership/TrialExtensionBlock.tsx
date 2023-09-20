import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { type ComponentProps, useState } from 'react'
import { BankIdIcon, Button, RestartIcon, Space, Text } from 'ui'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { ProductItemContractContainerCar } from '@/components/ProductItem/ProductItemContractContainer'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { CurrencyCode, type ProductOfferFragment } from '@/services/apollo/generated'
import { type PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ActionButtonsCar } from './ActionButtonsCar'

const SIGN_AND_PAY_BUTTON = 'Signera och betala'
const UNDO_REMOVE_BUTTON = 'Ångra borttagning'

type Props = {
  priceIntent: PriceIntent
}

type UpdateOfferFunction = ComponentProps<typeof ActionButtonsCar>['onUpdateOffer']

export const TrialExtensionBlock = (props: Props) => {
  const { t } = useTranslation('checkout')
  const [isHidden, setIsHidden] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<ProductOfferFragment>(() => {
    // Use `PriceIntent.defaultOffer` when available
    return props.priceIntent.offers[0]
  })

  const handleUpdateOffer: UpdateOfferFunction = (offer) => {
    const newOffer = props.priceIntent.offers.find((item) => item.id === offer?.id)

    if (newOffer) {
      setSelectedOffer(newOffer)
      return
    }

    // Use `PriceIntent.defaultOffer` when available
    setSelectedOffer(props.priceIntent.offers[0])
  }

  const handleRemove = () => {
    setIsHidden(true)
  }

  const handleClickUndo = () => {
    datadogRum.addAction('Offer Car Undo')
    setIsHidden(false)
  }

  const handleSignAndPay = () => {
    datadogRum.addAction('Offer Car Sign and Pay')
    // TODO: implement
  }

  return (
    <Space y={1.5}>
      {/* TODO: replace with API `Contract.exposure.displayNameFull` */}
      <Text align="center">Volkswagen Polo · LPP 083</Text>

      <Space y={1}>
        <ProductItemContractContainerCar contract={FIXTURE_CONTRACT} />

        {isHidden ? (
          <Button onClick={handleClickUndo} variant="secondary">
            <SpaceFlex space={0.5} align="center">
              <RestartIcon size="1rem" />
              {UNDO_REMOVE_BUTTON}
            </SpaceFlex>
          </Button>
        ) : (
          <Space y={1}>
            <ProductItemContainer offer={selectedOffer} defaultExpanded={true}>
              <ActionButtonsCar
                priceIntent={props.priceIntent}
                offer={selectedOffer}
                onRemove={handleRemove}
                onUpdateOffer={handleUpdateOffer}
              />
            </ProductItemContainer>
            {/* TODO: Add blue info card */}
          </Space>
        )}
      </Space>

      <Space y={1}>
        <Button onClick={handleSignAndPay}>
          <SpaceFlex space={0.5} align="center">
            <BankIdIcon />
            {SIGN_AND_PAY_BUTTON}
          </SpaceFlex>
        </Button>

        <Text size="xs" color="textSecondary" align="center">
          {t('SIGN_DISCLAIMER')}
        </Text>
      </Space>
    </Space>
  )
}

// TODO: remove this when we can get the data from the API
const FIXTURE_CONTRACT = {
  id: '1',

  exposure: {
    displayNameFull: 'Volkswagen Polo · LPP 083',
  },

  cost: { amount: 299, currencyCode: CurrencyCode.Sek },

  endDate: '2023-10-31',

  displayItems: [
    {
      displayTitle: 'Registration number',
      displayValue: 'ABC 123',
    },
    {
      displayTitle: 'Address',
      displayValue: 'Hedvigsgatan 11',
    },
    {
      displayTitle: 'Milage',
      displayValue: '1,500 km/year',
    },
  ],

  variant: {
    displayName: 'Helförsäkring',

    product: {
      pillowImage: { src: 'https://placekitten.com/200/300' },
    },

    documents: [
      {
        displayName: 'Insurance terms',
        url: 'https://www.hedvig.com/se/forsakringar/hemforsakring/villkor',
      },
      {
        displayName: 'Insurance letter',
        url: 'https://www.hedvig.com/se/forsakringar/hemforsakring/brev',
      },
    ],
  },
}
