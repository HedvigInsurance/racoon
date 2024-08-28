import { useCallback, useState } from 'react'
import * as React from 'react'
import { Template } from 'types/generated/graphql'
import { isPressing, Keys } from '@hedvig-ui'
import {
  formatLocale,
  useTemplateMessages,
} from '@hope/features/template-messages/use-template-messages'
import { PickedLocale } from '../config/constants'
import { PushUserAction } from '@hope/features/tracking/utils/tags'

export const useTemplatesHinting = (
  message: string,
  setMessage: (e: string) => void,
  isAdditionalKey: (e: React.KeyboardEvent | KeyboardEvent) => boolean,
): {
  hinting: boolean
  templateHint: Template | null
  clearHinting: () => void
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
} => {
  const [hinting, setHinting] = useState(false)
  const [templateHint, setTemplateHint] = useState<Template | null>(null)

  const { templates, locale, currentLocaleDisplayed, loading } =
    useTemplateMessages()

  const searchTemplate = (searchText: string) =>
    templates.find(
      (template) =>
        template.title.substring(0, searchText.length).toLowerCase() ===
        searchText.toLowerCase(),
    ) || null

  const getTemplateName = (
    searchTemplate: Template | null,
    searchText: string,
  ) =>
    searchTemplate?.title
      .split('')
      .map((letter: string, index: number) => {
        if (searchText[index] === letter.toUpperCase()) {
          return letter.toUpperCase()
        }

        return letter.toLowerCase()
      })
      .join('') || ''

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.currentTarget.value

    if (!e.currentTarget.value.includes('/') && hinting) {
      setHinting(false)
    }

    if (hinting) {
      const searchText = text.slice(1)
      const filteredTemplates = searchTemplate(searchText)
      const templateName = getTemplateName(filteredTemplates, searchText)

      setTemplateHint(
        filteredTemplates
          ? { ...filteredTemplates, title: templateName }
          : null,
      )
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '/' && !hinting && !loading && !e.currentTarget.value) {
      e.preventDefault()

      setTemplateHint(searchTemplate(''))
      setMessage('/')
      setHinting(true)
      PushUserAction('template', 'hinting', null, null)
    }

    if (isPressing(e, Keys.Right) && hinting && templateHint && !loading) {
      e.preventDefault()
      setMessage('/' + templateHint.title)
    }

    if (
      (isPressing(e, Keys.Down) || isPressing(e, Keys.Up)) &&
      hinting &&
      templateHint &&
      !loading
    ) {
      e.preventDefault()

      const searchText = message.slice(1)

      const templatesIds = templates
        .filter(
          (template) =>
            template.title.substring(0, searchText.length).toLowerCase() ===
            searchText.toLowerCase(),
        )
        .map((template) => template.id)

      const indexOfCurrentTemplate = templatesIds.indexOf(templateHint.id)

      if (
        indexOfCurrentTemplate < templatesIds.length - 1 &&
        isPressing(e, Keys.Down)
      ) {
        const template =
          templates.find(
            (template) =>
              template.id === templatesIds[indexOfCurrentTemplate + 1],
          ) || null

        const templateName = getTemplateName(template, searchText)

        setTemplateHint(template ? { ...template, title: templateName } : null)
      }

      if (indexOfCurrentTemplate > 0 && isPressing(e, Keys.Up)) {
        const template =
          templates.find(
            (template) =>
              template.id === templatesIds[indexOfCurrentTemplate - 1],
          ) || null

        const templateName = getTemplateName(template, searchText)

        setTemplateHint(template ? { ...template, title: templateName } : null)
      }
    }

    if (isPressing(e, Keys.Escape) && hinting) {
      e.preventDefault()

      setTemplateHint(null)
      setHinting(false)
    }

    if (!isAdditionalKey(e) && isPressing(e, Keys.Enter) && hinting) {
      e.preventDefault()

      const newMessage = templateHint?.messages.find((msg) =>
        currentLocaleDisplayed?.isEnglishLocale
          ? msg.language === formatLocale(PickedLocale.EnSe, true)
          : msg.language === formatLocale(locale),
      )?.message

      setMessage(newMessage || '')
      PushUserAction('template', 'used', null, null)

      setTemplateHint(null)
      setHinting(false)
    }
  }

  const clearHinting = useCallback(() => {
    setTemplateHint(null)
    setHinting(false)
  }, [])

  return {
    hinting,
    templateHint,
    clearHinting,
    onChange,
    onKeyDown,
  }
}
