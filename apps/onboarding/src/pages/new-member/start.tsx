import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { StartPage } from '@/components/StartPage/StartPage'
import { replaceMarkdown } from '@/services/i18n'

const NewMemberStartPage: NextPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('STARTPAGE_PAGE_TITLE')}</title>
      </Head>
      <StartPage />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translations = await replaceMarkdown(await serverSideTranslations(locale as string), [
    'START_SCREEN_FOOTER_TOS',
  ])
  return { props: { ...translations } }
}

export default NewMemberStartPage
