'use client'

import { useEffect, useState } from 'react'
import { Text } from 'ui'
import { WidgetEvent, isWidgetEvent } from '@/features/widget/publishWidgetEvent'
import { messageLog, wrapper } from './MessageLogger.css'

export function MessageLogger() {
  const [messages, setMessages] = useState<Array<WidgetEvent>>([])

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (isWidgetEvent(event)) {
        setMessages((prev) => [...prev, event.data])
      }
    }

    window.addEventListener('message', handler)

    return () => {
      window.removeEventListener('message', handler)
    }
  }, [])

  return (
    <div className={wrapper}>
      {messages.map((message, index) => (
        <div className={messageLog} key={index}>
          <Text as="span" size="sm">
            {JSON.stringify(message, null, 2)}
          </Text>
        </div>
      ))}
    </div>
  )
}
