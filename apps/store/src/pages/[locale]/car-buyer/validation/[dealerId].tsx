import { type GetServerSideProps, type GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { type ComponentProps } from 'react'
import { Heading } from 'ui'
import { CarBuyerValidationPage } from '@/features/carDealership/CarBuyerValidationPage'
import { hideChatOnPage } from '@/services/pageChat'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type Props = ComponentProps<typeof CarBuyerValidationPage> & { authenticated: boolean }
type Params = { dealerId: string }

// @ts-expect-error not an async function
export const getServerSideProps: GetServerSideProps<Props, Params> = (context) => {
  patchNextI18nContext(context)
  if (!context.params) throw new Error('Missing params')
  if (needsAuthentication(context)) {
    context.res.setHeader('WWW-Authenticate', 'Basic realm="Hedvig"')
    context.res.statusCode = 401
    return { props: { authenticated: false } }
  }

  return {
    props: {
      authenticated: true,
      dealerId: context.params.dealerId,
      ...hideChatOnPage(),
    },
  }
}

const needsAuthentication = (context: GetServerSidePropsContext): boolean => {
  const expectedUsername = process.env.CAR_TRIAL_VALIDATION_USERNAME
  const expectedPassword = process.env.CAR_TRIAL_VALIDATION_PASSWORD
  const isProtected = typeof expectedUsername === 'string' && typeof expectedPassword === 'string'

  if (!isProtected) return false

  const { authorization } = context.req.headers
  if (!authorization) return true

  const [type, token] = authorization ? authorization.split(' ') : []
  if (!type || !token) return true

  const [username, password] = Buffer.from(token, 'base64').toString().split(':')
  if (type !== 'Basic' || username !== expectedUsername || password !== expectedPassword) {
    return true
  }

  return false
}

const Page = (props: Props) => {
  return (
    <>
      <Head>
        <title>Hedvig | Validera bil-kund</title>
        <meta name="robots" content="noindex" />
      </Head>
      {props.authenticated ? (
        <CarBuyerValidationPage dealerId={props.dealerId} />
      ) : (
        <Heading as="h1" align="center" variant="serif.32">
          Ladda om sidan för att logga in
        </Heading>
      )}
    </>
  )
}

export default Page
