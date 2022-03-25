import styled from '@emotion/styled'
import { ClientPassage } from 'embark-core'
import { useForm } from 'hooks/use-form'
import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { getNextEmbarkPassage } from 'services/embark'
import { Button, Space } from 'ui'
import { PassageAction } from '@/components/embark/PassageAction'
import { useOfferPageRedirectEffect } from '@/components/embark/useOfferPageRedirectEffect'
import { useSubmitGraphQLEffect } from '@/components/embark/useSubmitGraphQLEffect'
import { useTranslateTextLabel } from '@/components/embark/useTranslateTextLabel'

const useRouterRefresh = () => {
  const { asPath, replace } = useRouter()
  return useCallback(() => replace(asPath), [replace, asPath])
}

type Props = {
  passage: ClientPassage
  storyName: string
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

const EmbarkPage: NextPage<Props> = ({ passage, storyName }) => {
  const t = useTranslateTextLabel()
  const refreshData = useRouterRefresh()

  const submitDataForm = useForm({
    action: `/api/embark/${storyName}/${passage.name}`,
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

      <form {...goBackForm.formProps}>
        <Button type="submit">{goBackForm.state === 'submitting' ? 'Loading' : 'Back'}</Button>
      </form>

      {passage.action && (
        <form {...submitDataForm.formProps}>
          <PassageAction action={passage.action} />
        </form>
      )}
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  locale,
  query,
  req,
  res,
}) => {
  const translations = await serverSideTranslations(locale as string, ['embark'])
  const storyName = query.embark as string
  const passage = await getNextEmbarkPassage({ req, res, storyName })

  return {
    props: {
      // remove undefined values
      passage: JSON.parse(JSON.stringify(passage)),
      storyName,
      ...translations,
    },
  }
}

export default EmbarkPage
