import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import type { FormEventHandler } from 'react'
import { BankIdIcon, Button, HedvigLogo, Text } from 'ui'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Video } from '@/components/Video/Video'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { singleQueryParam } from '@/utils/singleQueryParam'
import { fieldWrapper, form, formWrapper, grid, loginVideo, loginWrapper } from './LoginPage.css'

const SSN_FIELD_NAME = 'ssn'

export const LoginPage = () => {
  const router = useRouter()
  const handleLoginSuccess = async () => {
    console.log('Login success, reloading and let server side do the redirect')
    window.location.reload()
    // Never resolve, keep BankID dialog open
    return new Promise(() => {})
  }

  return (
    <>
      <Head>
        <title>Hedvig member login</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <div className={grid}>
        <Video
          className={loginVideo}
          autoPlay={true}
          showControls={false}
          sources={[
            {
              url: 'https://cdn.hedvig.com/hedvig-dot-com/videos/pillow-hero.webm',
            },
            {
              url: 'https://cdn.hedvig.com/hedvig-dot-com/videos/pillow-hero.mp4',
            },
          ]}
        />
        <LoginForm
          defaultSsn={singleQueryParam(router.query, SSN_FIELD_NAME)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    </>
  )
}

const LoginForm = ({
  defaultSsn = '',
  onSuccess,
}: {
  defaultSsn?: string
  onSuccess: () => void
}) => {
  const { startLogin, currentOperation } = useBankIdContext()
  const { t } = useTranslation(['memberArea', 'bankid'])
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const ssn = new FormData(event.currentTarget).get(SSN_FIELD_NAME) as string
    startLogin({
      ssn,
      onSuccess,
    })
  }
  return (
    <div className={loginWrapper}>
      <div className={formWrapper}>
        <Text>{t('memberArea:LOGIN_HEADING')}</Text>
        <form className={form} onSubmit={handleSubmit}>
          <div className={fieldWrapper}>
            <PersonalNumberField
              name={SSN_FIELD_NAME}
              label={t('memberArea:LOGIN_SSN_FIELD')}
              autoFocus={true}
              defaultValue={defaultSsn}
              required={true}
            />
          </div>
          <Button type="submit" loading={!!currentOperation}>
            <SpaceFlex space={0.5} align="center">
              <BankIdIcon />
              {t('bankid:LOGIN_BANKID')}
            </SpaceFlex>
          </Button>
        </form>
      </div>
      <HedvigLogo />
    </div>
  )
}
