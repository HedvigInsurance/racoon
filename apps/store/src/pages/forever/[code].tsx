import { GetServerSideProps, NextPageWithLayout } from 'next'
import Head from 'next/head'
import { ForeverPage, type Props } from '@/components/ForeverPage/ForeverPage'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'

type Params = { code: string }

const NextPage: NextPageWithLayout<Props> = (props) => (
  <>
    <Head>
      <meta name="robots" content="noindex, follow" />
    </Head>
    <ForeverPage {...props} />
  </>
)

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (!context.params?.code) return { notFound: true }

  const layoutWithMenuProps = await getLayoutWithMenuProps(context)
  if (layoutWithMenuProps === null) return { notFound: true }

  return {
    props: {
      ...layoutWithMenuProps,
      code: context.params.code,
    },
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu hideFooter={true}>{children}</LayoutWithMenu>

export default NextPage
