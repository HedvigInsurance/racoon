import styled from '@emotion/styled'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FormEventHandler } from 'react'
import { BankIdIcon, Button, Text, theme } from 'ui'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useBankIdContext } from '@/services/bankId/BankIdContext'

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
      <SpaceFlex direction="horizontal" align="center">
        <ImageWrapper>
          <Image
            src={'https://a.storyblok.com/f/165473/1566x1308/86d40cd5d1/seal-demo-image.png'}
            alt={'Smiling seal'}
            fill={true}
            style={{
              objectFit: 'cover',
            }}
          />
        </ImageWrapper>
        <ImageWrapper>
          <Image
            src={'https://a.storyblok.com/f/165473/1566x1308/86d40cd5d1/seal-demo-image.png'}
            alt={'Smiling seal'}
            fill={true}
            style={{
              objectFit: 'cover',
            }}
          />
        </ImageWrapper>
      </SpaceFlex>
      <LoginForm
        defaultSsn={singleQueryParam(router.query, SSN_FIELD_NAME)}
        onSuccess={handleLoginSuccess}
      />
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
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const ssn = new FormData(event.currentTarget).get(SSN_FIELD_NAME) as string
    startLogin({
      ssn,
      onSuccess,
    })
  }
  return (
    <FormWrapper direction="vertical" align="center">
      <Text>Please log in to continue</Text>
      <Form onSubmit={handleSubmit}>
        <FieldWrapper>
          <PersonalNumberField
            name={SSN_FIELD_NAME}
            label="Personal number"
            autoFocus={true}
            defaultValue={defaultSsn}
            required={true}
          />
        </FieldWrapper>
        <Button type="submit" loading={!!currentOperation}>
          <SpaceFlex space={0.5} align="center">
            <BankIdIcon />
            Log in with BankID
          </SpaceFlex>
        </Button>
      </Form>
    </FormWrapper>
  )
}

const ImageWrapper = styled.div({
  width: '50%',
  aspectRatio: '1/1',
  position: 'relative',
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

const singleQueryParam = (query: NextParsedUrlQuery, key: string): string | undefined => {
  const val = query[key]
  if (Array.isArray(val)) {
    return val[0]
  }
  return val
}
