import styled from '@emotion/styled'
import * as SelectPrimitive from '@radix-ui/react-select'
import { useTranslation } from 'next-i18next'
import { FormEventHandler, Fragment } from 'react'
import { Button, Space, CheckIcon, ChevronIcon, theme } from 'ui'
import { useGetDiscountExplanation } from '@/components/CartInventory/CartInventory.helpers'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { Pillow } from '@/components/Pillow/Pillow'
import { RedeemedCampaign } from '@/services/apollo/generated'

export const SSN_FIELDNAME = 'ssn'
export const PRODUCT_FIELDNAME = 'product'

export type ProductOption = {
  name: string
  value: string
  img: {
    src: string
    alt?: string
  }
}

type Props = {
  productOptions: Array<ProductOption>
  onSubmit?: FormEventHandler<HTMLFormElement>
  loading?: boolean
  ssnDefaultValue?: string
  redeemedCampaign?: RedeemedCampaign
}

export const QuickPurchaseForm = ({
  productOptions,
  onSubmit,
  loading,
  ssnDefaultValue = '',
  redeemedCampaign,
}: Props) => {
  const { t } = useTranslation('purchase-form')
  const getDiscountExplanation = useGetDiscountExplanation()

  return (
    <Wrapper y={0.75}>
      {redeemedCampaign && (
        <Space y={0.75}>
          <CampaignCodeBadge>{redeemedCampaign.code}</CampaignCodeBadge>
          <p>{getDiscountExplanation(redeemedCampaign.discount)}</p>
        </Space>
      )}
      <form onSubmit={onSubmit}>
        <Space y={0.75}>
          <Space y={0.5}>
            <PersonalNumberField
              label={t('FIELD_SSN_SE_LABEL')}
              name={SSN_FIELDNAME}
              required={true}
              disabled={loading}
              defaultValue={ssnDefaultValue}
            />

            <SelectPrimitive.Root name={PRODUCT_FIELDNAME} disabled={loading} required={true}>
              <SelectTrigger>
                <SelectPrimitive.Value placeholder={t('FIELD_INSURANCE_SELECTOR_PLACEHOLDER')} />
                <SelectPrimitive.Icon asChild>
                  <StyledChevronIcon size="1rem" />
                </SelectPrimitive.Icon>
              </SelectTrigger>

              <SelectPrimitive.Portal>
                <SelectContent position="popper">
                  <SelectPrimitive.Viewport>
                    {productOptions.map((option) => (
                      <Fragment key={option.value}>
                        <Separator />
                        <SelectItem value={option.value}>
                          <SelectPrimitive.ItemText asChild>
                            <ItemDisplay>
                              <Pillow size="xxsmall" {...option.img} />
                              <span>{option.name}</span>
                            </ItemDisplay>
                          </SelectPrimitive.ItemText>

                          <SelectPrimitive.ItemIndicator asChild>
                            <SelectedItemIcon size="1rem" />
                          </SelectPrimitive.ItemIndicator>
                        </SelectItem>
                      </Fragment>
                    ))}
                  </SelectPrimitive.Viewport>
                </SelectContent>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
          </Space>

          <Button type="submit" loading={loading}>
            {t('BUTTON_LABEL_GET_PRICE')}
          </Button>
        </Space>
      </form>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  padding: theme.space.sm,
  borderRadius: theme.radius.xs,
})

const CampaignCodeBadge = styled.span({
  borderRadius: theme.radius.xs,
  backgroundColor: theme.colors.gray200,
  textTransform: 'uppercase',
  padding: `${theme.space.xxs} ${theme.space.xs}`,
})

const SelectTrigger = styled(SelectPrimitive.Trigger)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.xs,
  width: '100%',
  height: '3rem',
  borderRadius: theme.radius.sm,
  paddingInline: theme.space.md,
  backgroundColor: theme.colors.opaque1,
  fontSize: theme.fontSizes.xl,
  cursor: 'pointer',

  '&[data-state=open]': {
    borderBottomLeftRadius: 'revert',
    borderBottomRightRadius: 'revert',
  },

  '&[data-placeholder]': {
    color: theme.colors.textSecondary,
  },

  '&:focus-visible': {
    outline: `2px solid ${theme.colors.black}`,
  },

  '&:invalid, &:disabled': {
    color: theme.colors.textSecondary,
  },

  '&:disabled': {
    cursor: 'not-allowed',
  },
})

const StyledChevronIcon = styled(ChevronIcon)({
  transition: 'transform 200ms cubic-bezier(0.77, 0, 0.18, 1)',

  [`${SelectTrigger}[data-state=open] &`]: {
    transform: 'rotate(180deg)',
  },
})

const SelectContent = styled(SelectPrimitive.Content)({
  width: 'var(--radix-select-trigger-width)',
  maxHeight: 'var(--radix-select-content-available-height)',
  backgroundColor: theme.colors.opaque1,
  borderBottomLeftRadius: theme.radius.sm,
  borderBottomRightRadius: theme.radius.sm,
  // Cut out borders
  overflow: 'hidden',
})

const SelectItem = styled(SelectPrimitive.Item)({
  position: 'relative',
  minHeight: '3rem',
  paddingInline: theme.space.md,
  paddingBlock: theme.space.xs,
  fontSize: theme.fontSizes.lg,
  isolation: 'isolate',

  '&[data-highlighted]': {
    backgroundColor: theme.colors.gray300,
  },

  '@media (hover: hover)': {
    ':hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray300,
    },
  },
})

const Separator = styled(SelectPrimitive.Separator)({
  height: 1,
  backgroundColor: theme.colors.opaque2,
  marginInline: theme.space.md,
})

const ItemDisplay = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
})

const SelectedItemIcon = styled(CheckIcon)({
  position: 'absolute',
  right: theme.space.md,
  // Centers icon vertically
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
})
