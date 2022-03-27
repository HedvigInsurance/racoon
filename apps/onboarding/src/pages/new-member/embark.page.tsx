import styled from '@emotion/styled'
import { ClientPassage } from 'embark-core'
import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Button, Space } from 'ui'
import { PassageAction } from '@/components/embark/PassageAction'
import { useOfferPageRedirectEffect } from '@/components/embark/useOfferPageRedirectEffect'
import { useSubmitGraphQLEffect } from '@/components/embark/useSubmitGraphQLEffect'
import { useTranslateTextLabel } from '@/components/embark/useTranslateTextLabel'
import { useForm } from '@/hooks/use-form'
import * as Embark from '@/services/embark/embark'

const useRouterRefresh = () => {
  const { asPath, replace } = useRouter()
  return useCallback(() => replace(asPath), [replace, asPath])
}

type Props = {
  passage: ClientPassage
  showBackButton: boolean
}

const Wrapper = styled(Space)(({ theme }) => ({
  backgroundColor: theme.colors.gray100,
  height: '100vh',
  padding: '1rem',
}))

const Message = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.gray300,
  padding: '1rem',
  borderRadius: '0.5rem',
  maxWidth: '30ch',
}))

const EmbarkPage: NextPage<Props> = ({ passage, showBackButton }) => {
  const t = useTranslateTextLabel()
  const refreshData = useRouterRefresh()

  const submitDataForm = useForm({
    action: `/api/embark/submit/${passage.name}`,
    onSuccess: refreshData,
  })
  const goBackForm = useForm({ action: `/api/embark/go-back`, onSuccess: refreshData })

  useOfferPageRedirectEffect(passage)
  useSubmitGraphQLEffect(submitDataForm.submitForm, passage)

  return (
    <Wrapper y={2}>
      <Space y={0.5}>
        {passage.messages.map((message) => (
          <Message key={message.text}>{t(message)}</Message>
        ))}
      </Space>

      {showBackButton && (
        <form {...goBackForm.formProps}>
          <Button>{goBackForm.state === 'submitting' ? 'Loading' : 'Back'}</Button>
        </form>
      )}

      {passage.action && (
        <form {...submitDataForm.formProps}>
          <PassageAction action={passage.action} />
        </form>
      )}
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ locale, req, res }) => {
  const translations = await serverSideTranslations(locale as string, ['embark'])

  const session = Embark.Persistence.get({ req, res })
  if (session === null) throw new Error('Session not found')

  const passage = await Embark.nextPassage({ storyName: session.story, history: session.history })

  return {
    props: {
      // remove undefined values
      passage: JSON.parse(JSON.stringify(passage)),
      showBackButton: session.history.length > 0,
      ...translations,
    },
  }
}

export default EmbarkPage
