'use client'

import { useEffect, useRef } from 'react'

export const useTitle = (title: string, retainOnUnmount = false) => {
  const documentTitle = useRef(document.title)

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    const defaultTitle = documentTitle.current
    return () => {
      if (!retainOnUnmount) {
        document.title = defaultTitle
      }
    }
  }, [retainOnUnmount])
}
