import styled from '@emotion/styled'
import {
  Root as SelectPrimitiveRoot,
  Trigger as SelectPrimitiveTrigger,
  Value as SelectPrimitiveValue,
  Icon as SelectPrimitiveIcon,
  Portal as SelectPrimitivePortal,
  Content as SelectPrimitiveContent,
  Viewport as SelectPrimitiveViewport,
  Item as SelectPrimitiveItem,
  ItemText as SelectPrimitiveItemText,
  ItemIndicator as SelectPrimitiveItemIndicator,
  Separator as SelectPrimitiveSeparator,
  type SelectProps as SelectPrimitiveProps,
} from '@radix-ui/react-select'
import { useTranslation } from 'next-i18next'
import { Fragment } from 'react'
import { CheckIcon, ChevronIcon, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'

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
} & Omit<SelectPrimitiveProps, 'children'>

export const ProductSelector = ({ productOptions, ...delegated }: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <SelectPrimitiveRoot {...delegated}>
      <SelectTrigger>
        <SelectPrimitiveValue placeholder={t('FIELD_INSURANCE_SELECTOR_PLACEHOLDER')} />
        <SelectPrimitiveIcon>
          <StyledChevronIcon size="1rem" />
        </SelectPrimitiveIcon>
      </SelectTrigger>

      <SelectPrimitivePortal>
        <SelectContent position="popper" sideOffset={4}>
          <SelectPrimitiveViewport>
            {productOptions.map((option, index) => (
              <Fragment key={option.value}>
                {index !== 0 && <Separator />}
                <SelectItem value={option.value}>
                  <SelectPrimitiveItemText asChild={true}>
                    <ItemDisplay>
                      <Pillow size="xxsmall" {...option.img} />
                      <span>{option.name}</span>
                    </ItemDisplay>
                  </SelectPrimitiveItemText>

                  <SelectPrimitiveItemIndicator>
                    <StyledCheckIcon size="1rem" />
                  </SelectPrimitiveItemIndicator>
                </SelectItem>
              </Fragment>
            ))}
          </SelectPrimitiveViewport>
        </SelectContent>
      </SelectPrimitivePortal>
    </SelectPrimitiveRoot>
  )
}

const SelectTrigger = styled(SelectPrimitiveTrigger)({
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

  '&[data-placeholder]': {
    color: theme.colors.textSecondary,
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

const SelectContent = styled(SelectPrimitiveContent)({
  width: 'var(--radix-select-trigger-width)',
  maxHeight: 'var(--radix-select-content-available-height)',
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,
  // Cut out borders
  overflow: 'hidden',
})

const SelectItem = styled(SelectPrimitiveItem)({
  position: 'relative',
  minHeight: '3rem',
  paddingInline: theme.space.md,
  paddingBlock: theme.space.xs,
  fontSize: theme.fontSizes.xl,
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

const Separator = styled(SelectPrimitiveSeparator)({
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
