import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import type { FormEventHandler } from 'react'
import { BankIdIcon, Button, HedvigLogo, Text, xStack } from 'ui'
import { Video } from '@/components/Video/Video'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { form, formWrapper, grid, loginVideo, loginWrapper } from './LoginPage.css'

export const LoginPage = () => {
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
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </>
  )
}

const LoginForm = ({ onSuccess }: { defaultSsn?: string; onSuccess: () => void }) => {
  const { startLogin, currentOperation } = useBankIdContext()
  const { t } = useTranslation(['memberArea', 'bankid'])
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    startLogin({
      ssn: null,
      onSuccess,
    })
  }
  return (
    <div className={loginWrapper}>
      <div className={formWrapper}>
        <Text>{t('memberArea:LOGIN_HEADING')}</Text>
        <form className={form} onSubmit={handleSubmit}>
          <Button type="submit" loading={!!currentOperation} fullWidth={true}>
            <div className={xStack({ gap: 'xs', alignItems: 'center' })}>
              <BankIdIcon />
              {t('bankid:LOGIN_BANKID')}
            </div>
          </Button>
        </form>
      </div>
      <HedvigLogo />
    </div>
  )
}
