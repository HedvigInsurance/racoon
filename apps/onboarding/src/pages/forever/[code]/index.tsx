import type { GetServerSideProps } from 'next'
import { getStaticProps } from '..'

export { default } from '..'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getStaticProps(context)
}
