import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as Popover from '@radix-ui/react-popover'
import { sv } from 'date-fns/locale'
import { useTranslation } from 'next-i18next'
import { useId, useState } from 'react'
import { useInput, DayPicker, type SelectSingleEventHandler } from 'react-day-picker'
import { ChevronIcon, theme, Text, LockIcon } from 'ui'
import { LoadingDots } from '@/components/LoadingDots/LoadingDots'
import { convertToDate } from '@/utils/date'
import { Language } from '@/utils/l10n/types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { useFormatter } from '@/utils/useFormatter'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

import 'react-day-picker/dist/style.css'

type Props = {
  label: string

  id?: string
  name?: string
  selected?: Date
  defaultSelected?: Date
  onSelect?: (day: Date) => void
  fromDate?: Date
  toDate?: Date
  disabled?: boolean
  backgroundColor?: 'default' | 'light'
  required?: boolean
  autoFocus?: boolean
  loading?: boolean
}

export const InputDay = (props: Props) => {
  const { t } = useTranslation()
  const formatter = useFormatter()
  const { language } = useCurrentLocale()
  const { inputProps, dayPickerProps } = useInput({
    locale: language === Language.Sv ? sv : undefined,
    format: 'yyyy-MM-dd',
    required: props.required,
    defaultSelected: props.selected ?? props.defaultSelected,
    fromDate: props.fromDate,
    toDate: props.toDate,
  })

  const [open, setOpen] = useState(props.autoFocus ?? false)

  const autoIdentifier = useId()
  const inputId = props.id ?? autoIdentifier

  const backgroundColor =
    props.backgroundColor === 'light'
      ? theme.colors.backgroundFrostedGlass
      : theme.colors.translucent1

  const { highlight, animationProps } = useHighlightAnimation<HTMLButtonElement>({
    defaultColor: backgroundColor,
  })

  const handleSelect: SelectSingleEventHandler = (day) => {
    if (day) props.onSelect?.(day)
    highlight()
    setOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (open && (props.disabled || props.loading)) return
    setOpen(open)
  }

  const dateValue = props.selected ?? convertToDate(inputProps.value)

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Wrapper {...animationProps} disabled={props.disabled} style={{ backgroundColor }}>
        <Label htmlFor={inputId} data-disabled={props.disabled}>
          {props.label}
        </Label>
        <InnerWrapper>
          {dateValue ? (
            <Text size="xl">{formatter.fromNow(dateValue)}</Text>
          ) : (
            <Text size="xl" color="textTertiary">
              {t('DATE_INPUT_EMPTY_LABEL')}
            </Text>
          )}

          {/* eslint-disable-next-line no-nested-ternary */}
          {props.loading ? (
            <LoadingDots color={theme.colors.textPrimary} />
          ) : props.disabled ? (
            <LockIcon size="1rem" color={theme.colors.textSecondary} />
          ) : (
            <StyledChevronIcon size="1rem" />
          )}
        </InnerWrapper>

        <input
          {...inputProps}
          id={inputId}
          name={props.name}
          hidden={true}
          disabled={props.disabled}
        />
      </Wrapper>

      <Popover.Portal>
        <PopoverContent side="bottom" align="start" sideOffset={-4} alignOffset={-4}>
          {/* Fix issue on iOS where month dropdown is focused and can't be tapped */}
          <div tabIndex={1} aria-hidden={true} />

          <StyledDayPicker
            {...dayPickerProps}
            mode="single"
            captionLayout="dropdown-buttons"
            onSelect={handleSelect}
            weekStartsOn={1}
            components={{
              IconRight: () => <ChevronRightIcon size="1rem" />,
              IconLeft: () => <ChevronLeftIcon size="1rem" />,
            }}
          />
        </PopoverContent>
      </Popover.Portal>
    </Popover.Root>
  )
}

const slideUpAndFadeAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideDownAndFadeAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const PopoverContent = styled(Popover.Content)({
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.backgroundStandard,
  boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 12px',

  maxHeight: 'var(--radix-tooltip-content-available-height)',

  animationDuration: '0.6s',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  transformOrigin: 'var(--radix-tooltip-content-transform-origin)',

  '&[data-side="top"]': {
    animationName: slideUpAndFadeAnimation,
  },

  '&[data-side="bottom"]': {
    animationName: slideDownAndFadeAnimation,
  },
})

const StyledDayPicker = styled(DayPicker)({
  // Docs: https://react-day-picker.js.org/basics/styling

  '--rdp-accent-color': theme.colors.buttonPrimary,
  '--rdp-background-color': theme.colors.gray200,
  '--rdp-outline': `1px solid ${theme.colors.borderTranslucent1}`,

  fontFamily: theme.fonts.body,
  color: theme.colors.textPrimary,
  margin: 0,
  padding: theme.space.md,

  '.rdp-day, .rdp-nav_button': {
    height: 'calc(var(--rdp-cell-size) * 0.9)',
    width: 'calc(var(--rdp-cell-size) * 0.9)',
    borderRadius: theme.radius.xs,
  },

  '.rdp-day_today': {
    fontWeight: 'normal',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray200,
  },

  '.rdp-caption_label': {
    fontWeight: 'normal',
    borderWidth: 1,
  },

  '.rdp-head_cell': {
    color: theme.colors.textSecondary,
    fontWeight: 'normal',
  },
})

const ChevronRightIcon = styled(ChevronIcon)({ transform: 'rotate(-90deg)' })
const ChevronLeftIcon = styled(ChevronIcon)({ transform: 'rotate(90deg)' })

const Wrapper = styled(Popover.Trigger)({
  position: 'relative',
  borderRadius: theme.radius.sm,
  height: '4.5rem',
  width: '100%',
  cursor: 'pointer',

  ':focus-visible': {
    boxShadow: theme.shadow.focus,
    borderRadius: theme.radius.sm,
  },
})

const InnerWrapper = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.space.xl,
  paddingRight: '1.25rem',
  paddingBottom: theme.space.sm,
  paddingLeft: theme.space.md,
})

const Label = styled.label({
  position: 'absolute',
  left: theme.space.md,
  top: theme.space.sm,
  fontSize: theme.fontSizes.xs,
  overflow: 'visible',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: theme.colors.textSecondary,

  '&&[data-disabled=true]': {
    color: theme.colors.textSecondary,
  },
})

const StyledChevronIcon = styled(ChevronIcon)(() => ({
  pointerEvents: 'none',
  transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',

  [`${Wrapper}[data-state=open] &`]: {
    transform: 'rotate(180deg)',
  },
}))
