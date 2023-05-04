import styled from '@emotion/styled'
import Head from 'next/head'
import { FormEventHandler, useCallback, useState } from 'react'
import { Button, Heading, Space } from 'ui'
import {
  ShopSessionSigningStatus,
  usePetMigrationSignMutation,
  useShopSessionPetMigrationQuery,
  useShopSessionSigningQuery,
} from '@/services/apollo/generated'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'

type Props = {
  [SHOP_SESSION_PROP_NAME]: string
}

export const ManyPetsMigrationPage = (props: Props) => {
  const { shopSessionId } = props

  const queryResult = useShopSessionPetMigrationQuery({
    variables: { shopSessionId },
  })

  const offers = queryResult.data?.shopSession.priceIntents.flatMap((x) => x.offers)
  const offerIds = offers?.map((offer) => offer.id) ?? []

  const { handleSubmitSign, loading } = useSignMigration(shopSessionId, offerIds)

  return (
    <>
      <Head>
        <title>TODO: Page title</title>
        <meta name="robots" content="none" />
      </Head>
      <Layout>
        <Heading variant="serif.40" as="h1">
          Pet Migration page 🐈‍ 🐩
        </Heading>
        <Space>
          <Heading as="h2">Your pets</Heading>
          <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
            {queryResult.loading && 'Loading...'}

            {offers?.map((offer) => (
              <pre
                key={offer.id}
                style={{
                  whiteSpace: 'pre',
                  fontFamily: 'monospace',
                  margin: '1rem 0',
                  borderTop: 'solid 1px gray',
                }}
              >
                {JSON.stringify(offer, null, 2)}
              </pre>
            ))}
          </div>
        </Space>

        {offerIds.length > 0 && (
          <form onSubmit={handleSubmitSign}>
            <Space>
              <Button type="submit" loading={loading}>
                {loading ? 'LOADING...' : 'SIGN IT!'}
              </Button>
            </Space>
          </form>
        )}
      </Layout>
    </>
  )
}

const Layout = styled.div({})

// TODO:
// - Use BankIdContext for visualization
// - Handle returning members
// - Prevent signing of complete session
// - Extract and handle errors
const useSignMigration = (shopSessionId: string, offerIds: Array<string>) => {
  const [signingId, setSigningId] = useState<string | null>(null)

  const [startSign, startSignResult] = usePetMigrationSignMutation({
    variables: { shopSessionId, offerIds },
  })

  useShopSessionSigningQuery({
    skip: !signingId,
    variables: signingId ? { shopSessionSigningId: signingId } : undefined,
    pollInterval: 1000,
    onCompleted(data) {
      if (data.shopSessionSigning.status === ShopSessionSigningStatus.Signed) {
        setSigningId(null)
        window.alert('Congratulations, signed successfully')
      }
    },
  })

  const handleSubmitSign: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault()
      const startSignResult = await startSign()
      setSigningId(() => startSignResult.data?.shopSessionStartSign.signing?.id ?? null)
      window.alert('Open your BankID app and sign')
    },
    [startSign],
  )

  return { handleSubmitSign, loading: startSignResult.loading || !!signingId }
}
