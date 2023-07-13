import { type GetServerSideProps, type NextPageWithLayout } from 'next'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { RetargetingPage } from '@/components/RetargetingPage/RetargetingPage'

type Props = {
  shopSessionId: string
}

type Params = {
  shopSessionId: string
}

const NextPage: NextPageWithLayout<Props> = RetargetingPage

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (!context.params) throw new Error('No params in context')

  const { shopSessionId } = context.params

  return {
    props: {
      ...(await getLayoutWithMenuProps(context)),
      shopSessionId,
    },
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextPage
