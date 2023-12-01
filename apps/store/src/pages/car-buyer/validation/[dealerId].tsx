import { type GetServerSideProps } from 'next'
import Head from 'next/head'
import { type ComponentProps } from 'react'
import { CarBuyerValidationPage } from '@/features/carDealership/CarBuyerValidationPage'

type Props = ComponentProps<typeof CarBuyerValidationPage>
type Params = { dealerId: string }

// @ts-expect-error not an async function
export const getServerSideProps: GetServerSideProps<Props, Params> = (context) => {
  if (!context.params) throw new Error('Missing params')

  const expectedUsername = process.env.CAR_TRIAL_VALIDATION_USERNAME
  const expectedPassword = process.env.CAR_TRIAL_VALIDATION_PASSWORD
  const isProtected = expectedUsername && expectedPassword
  if (isProtected) {
    const { authorization } = context.req.headers
    const [type, token] = authorization ? authorization.split(' ') : []
    const [username, password] = Buffer.from(token, 'base64').toString().split(':')

    if (type !== 'Basic' || username !== expectedUsername || password !== expectedPassword) {
      context.res.setHeader('WWW-Authenticate', 'Basic realm="Hedvig"')
      context.res.statusCode = 401
      return { props: {} }
    }
  }

  return {
    props: {
      dealerId: context.params.dealerId,
      hideChat: true,
    },
  }
}

const Page = (props: Props) => {
  return (
    <>
      <Head>
        <title>Hedvig | Validera bil-kund</title>
        <meta name="robots" content="noindex" />
      </Head>
      <CarBuyerValidationPage dealerId={props.dealerId} />
    </>
  )
}

export default Page
