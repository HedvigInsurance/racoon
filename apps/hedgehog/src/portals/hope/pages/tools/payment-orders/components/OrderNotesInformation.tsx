import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { Flex, convertEnumToTitle } from '@hedvig-ui'
import { format, parseISO } from 'date-fns'

export const OrderNotesInformation = ({
  order,
}: {
  order: PaymentOrderInformationFragment
}) => {
  if (!order.notes.length) {
    return null
  }

  return (
    <>
      {order.notes.map((note) => (
        <Flex justify="space-between" gap="small" key={note.addedAt}>
          <Flex direction="column" gap="tiny">
            <b>{convertEnumToTitle(note.type)}</b>
            <span style={{ whiteSpace: 'pre-wrap' }}>{note.text}</span>
          </Flex>
          <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>
            <div>{format(parseISO(note.addedAt), 'yyyy-MM-dd HH:mm')}</div>
            {note.addedByUser.__typename === 'AdminSystemUser' ? (
              <div>{note.addedByUser.email}</div>
            ) : (
              <div>Automation</div>
            )}
          </div>
        </Flex>
      ))}
    </>
  )
}
