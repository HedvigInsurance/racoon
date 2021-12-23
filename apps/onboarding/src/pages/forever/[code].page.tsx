import type { GetServerSideProps } from 'next'

import { getStaticProps } from './index.page'
export { default } from './index.page'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getStaticProps(context)
}
