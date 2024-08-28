import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import * as React from 'react'
import gql from 'graphql-tag'
import toast from 'react-hot-toast'
import { TemplateMessagesModal } from './components/TemplateMessagesModal'
import { Market, PickedLocale } from '../config/constants'
import {
  GetTemplatesDocument,
  Template,
  UpsertTemplateInput,
  useGetMemberPickedLocaleAndMarketLazyQuery,
  useGetTemplatesQuery,
  useRemoveTemplateMutation,
  useTogglePinStatusMutation,
  useUpsertTemplateMutation,
} from 'types/generated/graphql'
import { useInsecurePersistentState } from '@hedvig-ui'
import { PushUserAction } from '@hope/features/tracking/utils/tags'

gql`
  query GetTemplates($locales: [String!]!) {
    templates(locales: $locales) {
      id
      title
      messages {
        language
        message
      }
      expirationDate
      pinned
    }
  }

  query GetTemplateById($templateId: ID!) {
    template(id: $templateId) {
      id
      title
      messages {
        language
        message
      }
      expirationDate
      pinned
    }
  }

  query GetMemberPickedLocaleAndMarket($memberId: ID!) {
    member(id: $memberId) {
      memberId
      pickedLocale
      contractMarketInfo {
        market
        preferredCurrency
      }
    }
  }

  mutation TogglePinStatus($templateId: ID!) {
    togglePinStatus(id: $templateId) {
      id
      pinned
    }
  }

  mutation UpsertTemplate($input: UpsertTemplateInput!) {
    upsertTemplate(input: $input) {
      id
      title
      messages {
        language
        message
      }
      expirationDate
      pinned
    }
  }

  mutation RemoveTemplate($templateId: ID!) {
    removeTemplate(id: $templateId)
  }
`

export const formatLocale = (locale: PickedLocale, isEn?: boolean) =>
  isEn ? locale.split('_')[0].toUpperCase() : locale.split('_')[1].toUpperCase()

export const uniquePickedLocales: PickedLocale[] = Object.values(
  PickedLocale,
).filter(
  (locale) =>
    locale !== PickedLocale.EnDk &&
    locale !== PickedLocale.EnNo &&
    locale !== PickedLocale.EnSe,
)

export interface LocaleDisplayed {
  isEnglishLocale: boolean
  memberId?: string
}

interface TemplateMessagesContextProps {
  templates: Template[]
  show: () => void
  toggle: () => void
  create: (template: UpsertTemplateInput, actionOnSuccess?: () => void) => void
  edit: (template: Template) => void
  delete: (id: string) => void
  pin: (id: string) => void
  select: (text: string) => void
  selected: string | null
  locale: PickedLocale
  setLocale: (locale: PickedLocale) => void
  memberId?: string | null
  setMemberId: (id: string | null) => void
  currentLocaleDisplayed: LocaleDisplayed | null
  changeLocaleDisplayed: (memberId: string, isEnglish?: boolean) => void
  changeActiveMember: (newMemberId?: string | null) => void
  loading: boolean
}

const TemplateMessagesContext = createContext<TemplateMessagesContextProps>({
  templates: [],
  show: () => void 0,
  toggle: () => void 0,
  create: () => void 0,
  edit: () => void 0,
  delete: () => void 0,
  pin: () => void 0,
  select: () => void 0,
  selected: null,
  locale: PickedLocale.SvSe,
  setLocale: () => void 0,
  memberId: '',
  setMemberId: () => void 0,
  currentLocaleDisplayed: null,
  changeLocaleDisplayed: () => void 0,
  changeActiveMember: () => void 0,
  loading: false,
})

export const useTemplateMessages = () => useContext(TemplateMessagesContext)

export const TemplateMessagesProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [memberId, setMemberId] = useState<string | null>(null)
  const [locale, setLocale] = useState<PickedLocale>(PickedLocale.SvSe)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [showTemplateMessages, setShowTemplateMessages] = useState(false)
  const [getMemberPickedLocale, { data: memberData }] =
    useGetMemberPickedLocaleAndMarketLazyQuery({
      fetchPolicy: 'cache-first',
    })

  const [localesDisplayed, setLocalesDisplayed] = useInsecurePersistentState<
    LocaleDisplayed[]
  >('templates:member:language', [])

  const { data } = useGetTemplatesQuery({
    variables: {
      locales: [formatLocale(locale)],
    },
  })

  const [upsertTemplate, { loading }] = useUpsertTemplateMutation()
  const [togglePinStatus] = useTogglePinStatusMutation()
  const [removeTemplate] = useRemoveTemplateMutation()

  const templates = data?.templates ?? []

  useEffect(() => {
    if (!memberId) {
      setLocale(PickedLocale.SvSe)
      return
    }
    getMemberPickedLocale({
      variables: { memberId },
    })
  }, [memberId, getMemberPickedLocale])

  useEffect(() => {
    const pickedLocale = memberData?.member?.pickedLocale as PickedLocale
    const market = memberData?.member?.contractMarketInfo?.market
    if (!pickedLocale && market) {
      switch (market) {
        case Market.Denmark:
          setLocale(PickedLocale.DaDk)
          return
        case Market.Norway:
          setLocale(PickedLocale.NbNo)
          return
        case Market.Sweden:
          setLocale(PickedLocale.SvSe)
          return
        default:
          setLocale(PickedLocale.SvSe)
          return
      }
    }
    setLocale(pickedLocale ?? PickedLocale.SvSe)
  }, [
    memberData?.member?.pickedLocale,
    memberData?.member?.contractMarketInfo?.market,
  ])

  useEffect(() => {
    setLocalesDisplayed((localesDisplayed) => {
      if (
        memberId &&
        !localesDisplayed?.find((locale) => locale.memberId === memberId)
      ) {
        return [
          ...localesDisplayed,
          {
            isEnglishLocale: false,
            memberId,
          },
        ]
      }
      return localesDisplayed
    })

    setSelectedText((selectedText) => {
      if (!memberId && selectedText) {
        return null
      }
      return selectedText
    })
  }, [memberId, setLocalesDisplayed])

  const createHandler = (
    newTemplate: UpsertTemplateInput,
    actionOnSuccess?: () => void,
  ) => {
    const template: Template = {
      id: newTemplate.id ?? 'temp-id',
      title: newTemplate.title,
      expirationDate: newTemplate.expirationDate,
      messages: newTemplate.messages,
      pinned: false,
    }

    toast.promise(
      upsertTemplate({
        variables: {
          input: {
            title: template.title,
            expirationDate: template.expirationDate,
            messages: template.messages,
          },
        },
        optimisticResponse: {
          upsertTemplate: { __typename: 'Template', ...template },
        },
        refetchQueries: [{ query: GetTemplatesDocument }],
      }),
      {
        loading: 'Creating template',
        success: () => {
          actionOnSuccess?.()
          PushUserAction('template', 'created', null, null)
          return 'Template created'
        },
        error: (err) => {
          if (err.toString().includes('already exists')) {
            const splittedError = err.toString().split(': ')
            return splittedError[splittedError.length - 1]
          }

          return 'Could not create template'
        },
      },
    )
  }

  const editHandler = (newTemplate: Template) => {
    toast.promise(
      upsertTemplate({
        variables: {
          input: {
            id: newTemplate.id,
            title: newTemplate.title,
            expirationDate: newTemplate.expirationDate,
            messages: newTemplate.messages,
          },
        },
        optimisticResponse: {
          upsertTemplate: { __typename: 'Template', ...newTemplate },
        },
      }),
      {
        loading: 'Updating template',
        success: () => {
          PushUserAction('template', 'updated', null, null)
          return 'Template updated'
        },
        error: 'Could not update template',
      },
    )
  }

  const deleteHandler = (templateId: string) => {
    const deletingTemplate = templates.find(
      (template) => template.id === templateId,
    )

    if (!deletingTemplate) {
      return
    }

    toast.promise(
      removeTemplate({
        variables: {
          templateId,
        },
        optimisticResponse: {
          removeTemplate: true,
        },
        refetchQueries: [{ query: GetTemplatesDocument }],
      }),
      {
        loading: 'Deleting template',
        success: () => {
          PushUserAction('template', 'deleted', null, null)
          return 'Template deleted'
        },
        error: 'Could not delete template',
      },
    )
  }

  const pinHandler = (templateId: string) => {
    const changedTemplate: Template | undefined = templates.find(
      (template) => template.id === templateId,
    )

    if (changedTemplate) {
      toast.promise(
        togglePinStatus({
          variables: {
            templateId,
          },
          optimisticResponse: {
            togglePinStatus: {
              __typename: 'Template',
              id: templateId,
              pinned: !changedTemplate.pinned,
            },
          },
        }),
        {
          loading: 'Pinning template',
          success: (response) => {
            PushUserAction('template', 'pinned', null, null)

            const status = response.data?.togglePinStatus.pinned
              ? 'pinned'
              : 'unpinned'

            return 'Template ' + status
          },
          error: 'Could not pin template',
        },
      )
    }
  }

  const changeLocaleDisplayed = (memberId: string, isEnglish?: boolean) => {
    setLocalesDisplayed((prev) =>
      prev.map((locale) => {
        if (locale.memberId === memberId) {
          return {
            ...locale,
            isEnglishLocale: isEnglish || !locale.isEnglishLocale,
          }
        }

        return locale
      }),
    )
  }

  const changeActiveMember = useCallback((newMemberId?: string | null) => {
    if (!newMemberId) {
      setMemberId(null)
      return
    }
    setMemberId(newMemberId)
  }, [])

  return (
    <TemplateMessagesContext.Provider
      value={{
        templates: [...templates].sort((a, b) => {
          if (a.title < b.title) {
            return -1
          }
          if (a.title > b.title) {
            return 1
          }
          return 0
        }),
        show: () => setShowTemplateMessages(true),
        toggle: () => setShowTemplateMessages((prev) => !prev),
        create: createHandler,
        edit: editHandler,
        delete: deleteHandler,
        pin: pinHandler,
        select: (text: string) => setSelectedText(text),
        selected: selectedText,
        locale,
        setLocale: (newLocale: PickedLocale) => setLocale(newLocale),
        memberId,
        setMemberId,
        currentLocaleDisplayed:
          localesDisplayed?.find((locale) => locale.memberId === memberId) ||
          null,
        changeLocaleDisplayed,
        changeActiveMember,
        loading,
      }}
    >
      {children}
      {showTemplateMessages && (
        <TemplateMessagesModal hide={() => setShowTemplateMessages(false)} />
      )}
    </TemplateMessagesContext.Provider>
  )
}
