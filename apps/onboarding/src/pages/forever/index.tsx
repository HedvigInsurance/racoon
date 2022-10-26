import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ForeverPage } from '@/components/ForeverPage/ForeverPage'
import { replaceMarkdown } from '@/services/i18n'

const NextForeverPage: NextPage = () => <ForeverPage />

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translations = await replaceMarkdown(await serverSideTranslations(locale as string), [
    'FOREVER_LANDINGPAGE_INFO_TEXT',
  ])

  return { props: { ...translations } }
}

export default NextForeverPage
