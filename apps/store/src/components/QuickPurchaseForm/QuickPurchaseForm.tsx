import styled from '@emotion/styled'
import * as SelectPrimitive from '@radix-ui/react-select'
import { useTranslation } from 'next-i18next'
import { FormEventHandler, Fragment } from 'react'
import { Button, Space, CheckIcon, ChevronIcon, theme } from 'ui'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { Pillow } from '@/components/Pillow/Pillow'

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

export type FormError = Partial<Record<typeof SSN_FIELDNAME | 'general', string>>

type Props = {
  productOptions: Array<ProductOption>
  onSubmit?: FormEventHandler<HTMLFormElement>
  loading?: boolean
  showSsnField?: boolean
  ssnDefaultValue?: string
  error?: FormError
}

export const QuickPurchaseForm = ({
  productOptions,
  onSubmit,
  loading,
  ssnDefaultValue = '',
  showSsnField = false,
  error,
}: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <form onSubmit={onSubmit}>
      <Space y={0.75}>
        <Space y={0.5}>
          {showSsnField && (
            <PersonalNumberField
              label={t('FIELD_SSN_SE_LABEL')}
              name={SSN_FIELDNAME}
              required={true}
              disabled={loading}
              defaultValue={ssnDefaultValue}
              warning={!!error?.ssn}
              message={error?.ssn}
            />
          )}

          <SelectPrimitive.Root name={PRODUCT_FIELDNAME} disabled={loading} required={true}>
            <SelectTrigger>
              <SelectPrimitive.Value placeholder={t('FIELD_INSURANCE_SELECTOR_PLACEHOLDER')} />
              <SelectPrimitive.Icon asChild>
                <span>
                  <StyledChevronIcon size="1rem" />
                </span>
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
                          <span>
                            <StyledCheckIcon size="1rem" />
                          </span>
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

        {error?.general && <GeneralErrorMessage>{error.general}</GeneralErrorMessage>}
      </Space>
    </form>
  )
}

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

const StyledCheckIcon = styled(CheckIcon)({
  position: 'absolute',
  right: theme.space.md,
  // Centers icon vertically
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
})

const GeneralErrorMessage = styled.p({
  textAlign: 'center',
})
