import Link from 'next/link'
import { Button, Heading, Text } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { PageLink } from '@/utils/PageLink'

export const PaymentsSection = ({
  hasActivePaymentConnection,
}: {
  hasActivePaymentConnection: boolean
}) => {
  return (
    <SpaceFlex direction="vertical">
      <Heading as="h3" variant="standard.24">
        Payment
      </Heading>
      {hasActivePaymentConnection ? (
        <Text>Configured ✅</Text>
      ) : (
        <>
          <Text>Not configured yet</Text>
          <Link href={PageLink.paymentConnect()} target="_blank">
            <Button>Configure</Button>
          </Link>
        </>
      )}
    </SpaceFlex>
  )
}
