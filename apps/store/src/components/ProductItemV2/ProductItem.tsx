import { clsx } from 'clsx'
import { useTranslation } from 'next-i18next'
import { useState, useMemo, type ReactNode, type MouseEvent } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { CrossIconSmall, Text, Button, theme, yStack } from 'ui'
import Collapsible from '@/components/Collapsible/Collapsible'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { ProductDetails } from './ProductDetails'
import {
  card,
  cardGreenVariant,
  cardHeader,
  cardHeaderRow,
  priceSection,
  deleteButton,
  editButton,
  separator,
} from './ProductItem.css'
import type { Offer } from './ProductItem.types'

const DETAILS_SECTION_ID = 'details-section'

type Props = {
  selectedOffer: Offer
  children?: ReactNode
  greenVariant?: boolean
  defaultExpanded?: boolean
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onEdit?: () => void
  className?: string
}

export function ProductItem(props: Props) {
  const { t } = useTranslation(['cart', 'purchase-form'])
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? false)

  const productDetails = useMemo(() => {
    const items = props.selectedOffer.displayItems.map((item) => ({
      title: item.displayTitle,
      value: item.displayValue,
    }))
    const tierLevelDisplayName = getTierLevelDisplayName(props.selectedOffer)
    if (tierLevelDisplayName) {
      items.push({ title: t('DATA_TABLE_TIER_LABEL'), value: tierLevelDisplayName })
    }
    const deductibleDisplayName = props.selectedOffer.deductible?.displayName
    if (deductibleDisplayName) {
      items.push({ title: t('DATA_TABLE_DEDUCTIBLE_LABEL'), value: deductibleDisplayName })
    }
    return items
  }, [props.selectedOffer, t])

  const productDocuments = props.selectedOffer.variant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  const toggleExpandCard = () => {
    setExpanded((prev) => !prev)
  }

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    // Prevents expanding the card when clicking the delete button
    event.stopPropagation()
    props.onDelete?.(event)
  }

  const pillow = props.selectedOffer.product.pillowImage

  return (
    <div className={clsx(card, props.greenVariant && cardGreenVariant, props.className)}>
      <button
        className={cardHeader}
        onClick={toggleExpandCard}
        aria-expanded={expanded}
        aria-controls={DETAILS_SECTION_ID}
      >
        <Pillow size="small" src={pillow.src} alt={pillow.alt} />
        <div>
          <div className={cardHeaderRow}>
            <Text as="p" size="md" color="textTranslucentPrimary">
              {props.selectedOffer.product.displayNameFull}
            </Text>

            {props.onDelete && (
              <button className={deleteButton} onClick={handleDelete}>
                <CrossIconSmall color={theme.colors.textSecondary} />
              </button>
            )}
          </div>
          <Text as="p" color="textTranslucentSecondary">
            {props.selectedOffer.exposure.displayNameShort}
          </Text>
        </div>
      </button>

      <div className={yStack({ gap: 'md' })}>
        {props.children}

        <div className={yStack({ gap: 'md' })}>
          <div className={priceSection}>
            <Text as="span">{t('MONTHLY_PRICE_LABEL')}</Text>
            <Price {...getOfferPrice(props.selectedOffer.cost)} />
          </div>

          <Collapsible.Root id={DETAILS_SECTION_ID} open={expanded} onOpenChange={setExpanded}>
            <Collapsible.Content style={{ cursor: 'initial' }}>
              <hr className={separator} />

              <ProductDetails
                className={sprinkles({ py: 'md' })}
                items={productDetails}
                documents={productDocuments}
              />

              {props.onEdit && (
                <Button
                  className={editButton}
                  variant="secondary"
                  size="medium"
                  fullWidth={true}
                  onClick={props.onEdit}
                >
                  {t('EDIT_INFORMATION_BUTTON_LABEL')}
                </Button>
              )}
            </Collapsible.Content>

            <Collapsible.Trigger asChild={true}>
              <Button variant="secondary" size="medium" fullWidth={true}>
                {expanded ? t('HIDE_DETAILS_BUTTON_LABEL') : t('SHOW_DETAILS_BUTTON_LABEL')}
              </Button>
            </Collapsible.Trigger>
          </Collapsible.Root>
        </div>
      </div>
    </div>
  )
}

function getTierLevelDisplayName(item: Pick<ProductOfferFragment, 'variant' | 'product'>) {
  // TODO: small hack, move logic to API
  return item.variant.displayName !== item.product.displayNameFull
    ? item.variant.displayName
    : undefined
}
