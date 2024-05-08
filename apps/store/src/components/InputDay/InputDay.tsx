import * as Popover from '@radix-ui/react-popover'
import { clsx } from 'clsx'
import { sv } from 'date-fns/locale'
import { useTranslation } from 'next-i18next'
import { type CSSProperties, startTransition, useId, useState } from 'react'
import { useInput, DayPicker, type SelectSingleEventHandler } from 'react-day-picker'
import { ChevronIcon, Text, LockIcon, theme } from 'ui'
import { LoadingDots } from '@/components/LoadingDots/LoadingDots'
import { convertToDate } from '@/utils/date'
import { Language } from '@/utils/l10n/types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { useFormatter } from '@/utils/useFormatter'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import { trigger, label, iconWrapper, chevronIcon, popoverContent, dayPicker } from './InputDay.css'

import 'react-day-picker/dist/style.css'

export type InputDayProps = {
  label: string

  id?: string
  name?: string
  selected?: Date
  defaultSelected?: Date
  onSelect?: (day: Date) => void
  fromDate?: Date
  toDate?: Date
  disabled?: boolean
  required?: boolean
  autoFocus?: boolean
  loading?: boolean
  className?: string
}

export const InputDay = (props: InputDayProps) => {
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

  const { highlight, animationProps } = useHighlightAnimation<HTMLButtonElement>()

  const handleSelect: SelectSingleEventHandler = (day) => {
    if (day) props.onSelect?.(day)
    highlight()
    setOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (open && (props.disabled || props.loading)) return
    startTransition(() => {
      setOpen(open)
    })
  }

  const dateValue = props.selected ?? convertToDate(inputProps.value)

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger
        {...animationProps}
        className={clsx(trigger, props.className)}
        disabled={props.disabled}
      >
        <div>
          <label htmlFor={inputId}>
            <Text className={label} as="span" size="xs" color="textTranslucentSecondary">
              {props.label}
            </Text>
          </label>
          <Text size="xl" color={dateValue ? 'textPrimary' : 'textTertiary'}>
            {dateValue ? formatter.fromNow(dateValue) : t('DATE_INPUT_EMPTY_LABEL')}
          </Text>
        </div>

        <div className={iconWrapper}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {props.loading ? (
            <LoadingDots color={theme.colors.textPrimary} />
          ) : props.disabled ? (
            <LockIcon size="1rem" color={theme.colors.textSecondary} />
          ) : (
            <ChevronIcon className={chevronIcon.animated} size="1rem" />
          )}
        </div>

        <input
          {...inputProps}
          id={inputId}
          name={props.name}
          hidden={true}
          disabled={props.disabled}
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={popoverContent}
          side="bottom"
          align="start"
          sideOffset={-4}
          alignOffset={-4}
        >
          {/* Fix issue on iOS where month dropdown is focused and can't be tapped */}
          <div tabIndex={1} aria-hidden={true} />

          <DayPicker
            {...dayPickerProps}
            className={dayPicker}
            style={
              {
                '--rdp-accent-color': theme.colors.buttonPrimary,
                '--rdp-background-color': theme.colors.gray200,
                '--rdp-outline': `1px solid ${theme.colors.borderTranslucent1}`,
              } as CSSProperties
            }
            mode="single"
            captionLayout="dropdown-buttons"
            onSelect={handleSelect}
            weekStartsOn={1}
            components={{
              IconRight: () => <ChevronIcon className={chevronIcon.right} size="1rem" />,
              IconLeft: () => <ChevronIcon className={chevronIcon.left} size="1rem" />,
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
