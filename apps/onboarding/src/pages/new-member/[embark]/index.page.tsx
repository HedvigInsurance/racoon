import { Button, Space } from 'ui'
import type { GetServerSideProps, NextPage } from 'next'

import type { ClientPassage } from 'embark-core'
import { PassageAction } from './components/passage-action'
import { getNextEmbarkPassage } from 'services/embark'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useCallback } from 'react'
import { useForm } from 'hooks/use-form'
import { useRouter } from 'next/router'
import { useTranslateTextLabel } from './hooks/use-translate-text-label'

const useRouterRefresh = () => {
  const { asPath, replace } = useRouter()
  return useCallback(() => replace(asPath), [replace, asPath])
}

type Props = {
  passage: ClientPassage
  storyName: string
}

const EmbarkPage: NextPage<Props> = ({ passage, storyName }) => {
  const t = useTranslateTextLabel()
  const refreshData = useRouterRefresh()

  const submitDataForm = useForm({
    action: `/api/embark/${storyName}/${passage.name}`,
    onSuccess: refreshData,
  })
  const goBackForm = useForm({ action: `/api/embark/go-back`, onSuccess: refreshData })

  return (
    <Space y={2}>
      <div>
        {passage.messages.map((message) => (
          <div key={message.text}>{t(message)}</div>
        ))}
      </div>

      {passage.action && (
        <form {...submitDataForm.formProps}>
          <PassageAction action={passage.action} />
          <Button type="submit">
            {submitDataForm.state === 'submitting' ? '...' : 'Continue'}
          </Button>
          {submitDataForm.errors?.form && <div>Something went wrong</div>}
        </form>
      )}

      <form {...goBackForm.formProps}>
        <Button type="submit" $loading={goBackForm.state === 'submitting'}>
          Back
        </Button>
      </form>
    </Space>
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
