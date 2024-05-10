import styled from '@emotion/styled'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import type { FormEventHandler } from 'react'
import { BankIdIcon, Button, HedvigLogo, mq, Text, theme } from 'ui'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Video } from '@/components/Video/Video'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { singleQueryParam } from '@/utils/singleQueryParam'

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
      <Grid>
        <LoginVideo
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
      </Grid>
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
    <LoginWrapper>
      <FormWrapper direction="vertical" align="center">
        <Text>{t('memberArea:LOGIN_HEADING')}</Text>
        <Form onSubmit={handleSubmit}>
          <FieldWrapper>
            <PersonalNumberField
              name={SSN_FIELD_NAME}
              label={t('memberArea:LOGIN_SSN_FIELD')}
              autoFocus={true}
              defaultValue={defaultSsn}
              required={true}
            />
          </FieldWrapper>
          <Button type="submit" loading={!!currentOperation}>
            <SpaceFlex space={0.5} align="center">
              <BankIdIcon />
              {t('bankid:LOGIN_BANKID')}
            </SpaceFlex>
          </Button>
        </Form>
      </FormWrapper>
      <HedvigLogo />
    </LoginWrapper>
  )
}

const Grid = styled.div({
  display: 'grid',
  gridTemplateRows: '1fr 1fr',
  justifyItems: 'center',
  height: '100vh',

  [mq.lg]: {
    gridTemplateColumns: '550px 1fr',
    gridTemplateRows: 'auto',
    alignItems: 'stretch',
  },
})

const LoginVideo = styled(Video)({
  position: 'relative',
  width: '100%',
  height: '100%',
})

const LoginWrapper = styled.div({
  display: 'grid',
  gridTemplateRows: '1fr 200px',
  alignItems: 'center',
  justifyItems: 'center',
  [mq.lg]: {
    order: -1,
  },
})

const FormWrapper = styled(SpaceFlex)({
  marginTop: theme.space.xxxl,
})

const Form = styled.form({
  minWidth: '20rem',
})

const FieldWrapper = styled.div({
  marginTop: theme.space.lg,
  marginBottom: theme.space.xxs,
})
