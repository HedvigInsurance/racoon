import {
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody,
  TableRow,
  TableColumn,
  Button,
  Placeholder,
  Flex,
  StandaloneMessage,
} from '@hedvig-ui'
import { SystemUserFragment, TravelCertificate } from 'types/generated/graphql'

type TravelCertificatesTableProps = {
  certificates: TravelCertificate[]
}

export const TravelCertificatesTable = (
  props: TravelCertificatesTableProps,
) => {
  const viewTravelCertificate = (travelCertificateUrl: string) => {
    window.open(travelCertificateUrl, '_blank')
  }

  if (!props.certificates.length) {
    return (
      <StandaloneMessage>No travel certificates created yet</StandaloneMessage>
    )
  }

  const getCreatedByUser = (user: SystemUserFragment): string | null =>
    user.__typename === 'AdminSystemUser' ? user.email : null

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>From</TableHeaderColumn>
        <TableHeaderColumn>Expires</TableHeaderColumn>
        <TableHeaderColumn>Created by</TableHeaderColumn>
        <TableHeaderColumn></TableHeaderColumn>
      </TableHeader>
      <TableBody>
        {props.certificates.map((certificate) => (
          <TableRow key={certificate.id} style={{ cursor: 'default' }}>
            <TableColumn>{certificate.startDate}</TableColumn>
            <TableColumn>
              <Flex direction="column">
                <span>{certificate.expiryDate}</span>
                {!!certificate.endDate && (
                  <Placeholder> end date: {certificate.endDate}</Placeholder>
                )}
              </Flex>
            </TableColumn>
            <TableColumn>
              <Flex direction="column">
                <span>
                  {certificate.source === 'EXTERNAL' ? 'Member' : 'Admin'}
                </span>
                <Placeholder>
                  {getCreatedByUser(
                    certificate.createdByUser as SystemUserFragment,
                  )}
                </Placeholder>
              </Flex>
            </TableColumn>
            <TableColumn
              role="button"
              onClick={() => viewTravelCertificate(certificate.url)}
            >
              <Button
                style={{ width: '100%' }}
                size="small"
                variant="secondary"
              >
                View
              </Button>
            </TableColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
