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
            if (headerValue === TableMarkers.EmptyHeader)
              return <ComparisonTable.Header key={`empty-header-${index}`} />

            return (
              <ComparisonTable.Header
                key={headerValue}
                active={headerValue === selectedColumn}
                tableTitle={index === 0}
              >
                {headerValue}
              </ComparisonTable.Header>
            )
          })}
        </ComparisonTable.Row>
      </ComparisonTable.Head>

      <ComparisonTable.Body>
        {body.map((row) => {
          const [rowTitle, ...values] = row

          return (
            <ComparisonTable.Row key={rowTitle.title}>
              <ComparisonTable.TitleDataCell
                style={{ width: '60%' }}
                title={rowTitle.title}
                description={rowTitle.description}
                perilColor={rowTitle.perilsColor}
              />
              {values.map((value, index) => (
                <ComparisonTable.DataCell
                  key={index}
                  style={{ width: `calc(40% / ${values.length})` }}
                  active={index + 1 === selectedColumnIndex}
                >
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
