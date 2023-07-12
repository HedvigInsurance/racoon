import * as ComparisonTable from '@/components/ComparisonTable/ComparisonTable'
import { getCellValue } from './ComparisonTable.helpers'
import { type Head, type Body, TableMarkers } from './ComparisonTable.types'

type Props = {
  head: Head
  body: Body
  selectedColumn?: string
  className?: string
}

export const DesktopComparisonTable = ({ className, head, body, selectedColumn }: Props) => {
  const selectedColumnIndex = head.findIndex((headerValue) => headerValue === selectedColumn)

  return (
    <ComparisonTable.Root className={className}>
      <ComparisonTable.Head>
        <ComparisonTable.Row>
          {head.map((headerValue, index) => {
            if (headerValue == TableMarkers.EmptyHeader)
              return <ComparisonTable.Header key={`empty-header-${index}`} />

            return (
              <ComparisonTable.Header key={headerValue} active={headerValue === selectedColumn}>
                {headerValue}
              </ComparisonTable.Header>
            )
          })}
        </ComparisonTable.Row>
      </ComparisonTable.Head>

      <ComparisonTable.Body>
        {body.map((row) => {
          const [attribute, ...values] = row

          return (
            <ComparisonTable.Row key={attribute}>
              <ComparisonTable.TitleDataCell>{attribute}</ComparisonTable.TitleDataCell>
              {values.map((value, index) => (
                <ComparisonTable.DataCell key={index} active={index + 1 === selectedColumnIndex}>
                  {getCellValue(value)}
                </ComparisonTable.DataCell>
              ))}
            </ComparisonTable.Row>
          )
        })}
      </ComparisonTable.Body>
    </ComparisonTable.Root>
  )
}
