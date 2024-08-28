'use client'

import styled from '@emotion/styled'
import { Input } from '@hedvig-ui'
import { enGB } from 'date-fns/locale/en-GB'
import { useRef } from 'react'
import * as React from 'react'
import { Calendar } from 'react-bootstrap-icons'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { setHours, startOfHour } from 'date-fns'

registerLocale('enGB', enGB)

interface DatePickerProps {
  date: Date | null
  setDate: (date: Date) => void
  showTimePicker?: boolean
  maxDate?: Date
  minDate?: Date
  fullWidth?: boolean
  placeholder?: string
  disabled?: boolean
  name?: string
  tabIndex?: number
}

const Wrapper = styled.div`
  .datePicker {
    width: 100%;
  }
`

const CalendarIcon = styled(Calendar)`
  transition: all 0.1s;
  color: ${({ theme }) => theme.placeholderColor};
  cursor: pointer;
  width: 1em;
`

export const DateTimePicker: React.FC<DatePickerProps> = ({
  date,
  setDate,
  maxDate,
  minDate,
  showTimePicker = false,
  fullWidth = false,
  placeholder,
  disabled = false,
  name,
  tabIndex = 0,
}) => {
  const picker = useRef<DatePicker>(null)

  return (
    <Wrapper>
      {/* TODO: Find or build date picker component with react 18 support */}
      {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
      {/*  @ts-ignore*/}
      <DatePicker
        ref={picker}
        calendarStartDay={1}
        tabIndex={tabIndex}
        wrapperClassName={fullWidth ? 'datePicker' : undefined}
        autoComplete="off"
        locale="enGB"
        selected={date}
        disabled={disabled}
        placeholderText={placeholder}
        onChange={(newDate) => {
          if (!newDate) {
            return
          }

          setDate(newDate)
        }}
        showTimeSelect={showTimePicker}
        maxDate={maxDate}
        minDate={minDate}
        minTime={startOfHour(setHours(new Date(), 8))}
        maxTime={startOfHour(setHours(new Date(), 22))}
        name={name}
        customInput={
          <Input
            icon={
              <CalendarIcon
                onClick={() => {
                  picker?.current?.setOpen(true)
                }}
              />
            }
          />
        }
        dateFormat={showTimePicker ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
        timeIntervals={1}
      />
    </Wrapper>
  )
}
