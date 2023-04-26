'use client'

import styled from '@emotion/styled'
import Head from 'next/head'
import { FormEventHandler, useEffect, useState } from 'react'
import { Button, Space, theme } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import { PageLink } from '@/utils/PageLink'

const HEDVIG_DEBUGGER_SSN = 'hedvig:debugger-ssn'

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [defaultSsn, setDefaultSsn] = useState<string | undefined>(undefined)

  useEffect(() => {
    const ssn = window.localStorage.getItem(HEDVIG_DEBUGGER_SSN)
    if (ssn) setDefaultSsn(ssn)
  }, [])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const ssn = event.currentTarget.ssn.value
    setLoading(true)
    const response = await fetch(PageLink.apiSessionCreate(ssn))
    // TODO: Handle error
    if (!response.ok) {
      setLoading(false)
      throw new Error("Couldn't create session")
    }

    window.localStorage.setItem(HEDVIG_DEBUGGER_SSN, ssn)
    window.location.href = PageLink.cart({ locale: 'se-en' })
  }

  return (
    <>
      <Head>
        <meta name="robots" content="none" />
      </Head>
      <Wrapper>
        <form onSubmit={handleSubmit}>
          <Space y={0.25}>
            <TextField
              key={defaultSsn}
              defaultValue={defaultSsn}
              label="YYYYMMDDXXXX"
              autoFocus
              name="ssn"
            />
            <Button loading={loading}>Create session</Button>
          </Space>
        </form>
      </Wrapper>
    </>
  )
}

export default Page

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  maxWidth: '20rem',
  marginInline: 'auto',
  padding: theme.space.md,
})
