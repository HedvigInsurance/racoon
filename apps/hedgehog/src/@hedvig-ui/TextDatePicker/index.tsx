import styled from '@emotion/styled'
import {
  FadeIn,
  Input,
  InputProps,
  Keys,
  Label,
  useClickOutside,
} from '@hedvig-ui'
import nlp from 'compromise'
import dates from 'compromise-dates'
import numbers from 'compromise-numbers'
import { parseISO } from 'date-fns'
import { formatDate } from 'date-fns/format'
import * as React from 'react'
import { Calendar } from 'react-bootstrap-icons'
import DatePicker from 'react-datepicker'
import { toast } from 'react-hot-toast'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`

const positions = {
  top: 'bottom: 40px;',
  bottom: 'top: 45px;',
  right: `left: 40px;
          top: 0;`,
  left: `right: 100%;
         top: 0;`,
}

const DatePickerWrapper = styled.div<{
  position?: 'top' | 'bottom' | 'right' | 'left'
  floating?: boolean
}>`
  position: ${({ floating }) => (floating ? 'absolute' : 'initial')};
  ${({ position }) => position && `${positions[position]}`}
  z-index: 10;
`

const ErrorMessage = styled.span`
  position: absolute;

  font-size: 14px;
  color: ${({ theme }) => theme.danger};

  bottom: -25px;
  right: 10px;
`

const CalendarIcon = styled(Calendar)<{ focus?: boolean }>`
  transition: all 0.1s;
  color: ${({ theme, focus }) =>
    focus ? theme.accent : theme.placeholderColor};
  cursor: pointer;
  width: 1em;
`

interface Dates {
  dates: () => { get: (n: number) => { start: string } }
}

export const getDate = (value: string) => {
  nlp.extend(numbers)
  nlp.extend(dates)

  const result = nlp(value) as unknown as Dates

  return result.dates().get(0)
}

const InlineDatePicker: React.FC<{
  setValue: (dateValue: Date) => void
  onClose: () => void
  maxDate?: Date
  minDate?: Date
  showTimePicker?: boolean
  position?: 'top' | 'bottom' | 'right' | 'left'
  disabled?: boolean
  floating?: boolean
}> = ({
  setValue,
  onClose,
  maxDate,
  minDate,
  showTimePicker,
  position,
  disabled,
  floating = true,
}) => {
  const pickerRef = React.useRef<HTMLDivElement>(null)

  useClickOutside(pickerRef, () => onClose())

  return (
    <DatePickerWrapper ref={pickerRef} position={position} floating={floating}>
      <FadeIn duration={250}>
        {/* TODO: Find or build date picker component with react 18 support */}
        {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
        {/*  @ts-ignore*/}
        <DatePicker
          calendarStartDay={1}
          disabled={disabled}
          inline
          onChange={(date: Date) => {
            setValue(date)
            onClose()
          }}
          showTimeSelect={showTimePicker}
          maxDate={maxDate}
          minDate={minDate}
        />
      </FadeIn>
    </DatePickerWrapper>
  )
}

interface TextDatePickerProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string | null
  onChange: (date: string | null, event: TextDatePickerChangeEvent) => void
  errorMessage?: string
  maxDate?: Date
  minDate?: Date
  showTimePicker?: boolean
  withCurrentTime?: boolean
  position?: 'top' | 'bottom' | 'left' | 'right'
  label?: string
  pickerFloating?: boolean
}

type TextDatePickerChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.KeyboardEvent<HTMLInputElement>
  | React.FocusEvent<HTMLInputElement>
  | undefined

export const TextDatePicker: React.FC<TextDatePickerProps> = ({
  value,
  onChange,
  error,
  errorMessage,
  maxDate,
  minDate,
  showTimePicker,
  withCurrentTime,
  position,
  label,
  disabled,
  pickerFloating = true,
  ...props
}) => {
  const [showOldDatepicker, setShowOldDatepicker] = React.useState(false)
  const [textValue, setTextValue] = React.useState<string | null>()

  React.useEffect(() => {
    setTextValue(value?.split('T')[0])
  }, [value])

  const formatAndSetDate = (date: Date, event: TextDatePickerChangeEvent) => {
    const isoDate = parseISO(date.toISOString())
    let formattedDate: string = formatDate(isoDate, 'yyyy-MM-dd')

    if (withCurrentTime) {
      const isoTime = new Date().toISOString().split('T')[1]
      formattedDate = formattedDate + 'T' + isoTime
    }

    setTextValue(value?.split('T')[0])
    onChange(formattedDate, event)
  }

  const setDateHandler = (event: TextDatePickerChangeEvent) => {
    if (textValue === '') {
      setTextValue(value?.split('T')[0])
      onChange(null, event)
      return
    }

    const date = getDate(textValue || '')

    if (!date) {
      onChange(null, event)
      return
    }

    if (value?.split('T')[0] === textValue) {
      return
    }

    const newDate = new Date(date.start)

    // Zero all time related parts, to only compare the dates (and avoid tz issues)
    newDate.setHours(0, 0, 0, 0)
    minDate?.setHours(0, 0, 0, 0)
    maxDate?.setHours(0, 0, 0, 0)

    if (minDate && newDate < minDate) {
      const message =
        minDate === new Date()
          ? 'Date cannot be in the past'
          : `Date cannot be before ${formatDate(minDate, 'yyyy-MM-dd')}`

      toast.error(message)
      setTextValue(value)

      return
    }

    if (maxDate && newDate > maxDate) {
      const message =
        maxDate === new Date()
          ? 'Date cannot be in the future'
          : `Date cannot be after ${formatDate(maxDate, 'yyyy-MM-dd')}`

      toast.error(message)
      setTextValue(value)

      return
    }

    formatAndSetDate(newDate, event)
  }

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <Input
        {...props}
        disabled={disabled}
        error={error}
        icon={
          <CalendarIcon
            onClick={() => !disabled && setShowOldDatepicker((prev) => !prev)}
          />
        }
        onBlur={(e) => {
          setDateHandler(e)
        }}
        value={textValue || ''}
        onChange={(e) => setTextValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === Keys.Enter.code) {
            setDateHandler(e)
          }

          props.onKeyDown?.(e)
        }}
      />
      {error && <ErrorMessage>{errorMessage ?? 'Invalid date'}</ErrorMessage>}
      {showOldDatepicker && (
        <InlineDatePicker
          setValue={(dateValue: Date) => formatAndSetDate(dateValue, undefined)}
          onClose={() => setShowOldDatepicker(false)}
          maxDate={maxDate}
          minDate={minDate}
          showTimePicker={showTimePicker}
          position={position}
          disabled={disabled}
          floating={pickerFloating}
        />
      )}
    </Wrapper>
  )
}
