import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Space, theme } from 'ui'
import { Button } from '@/components/Button/Button'
import { FixedFooter } from '@/components/FixedFooter'
import { useForm } from '@/hooks/useForm'
import { PageLink } from '@/lib/PageLink'
import { Market } from '@/lib/types'
import { FORMS_PER_MARKET, MARKETS, PageInput, PAGE_WIDTH } from './DebuggerPage.constants'
import { DynamicInput } from './DynamicInput'
import { InputSelect } from './InputSelect'

const PageWrapper = styled.div({
  backgroundColor: theme.colors.gray200,
  minHeight: '100vh',
})

const Content = styled.div(() => ({
  maxWidth: PAGE_WIDTH,
  margin: '0 auto',
  padding: '1rem 0.5rem',
  paddingBottom: `calc(${FixedFooter.HEIGHT} + 1rem)`,
}))

const InputGroup = styled.div({
  backgroundColor: theme.colors.gray100,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  padding: '1rem',
  borderRadius: '0.75rem',
})

const ErrorText = styled.p({
  color: theme.colors.red600,
})

export const DebuggerPage = () => {
  const pageForm = useForm({ action: PageLink.debuggerFormApi() })

  const [market, setMarket] = useState(() => Market.Sweden)

  const formList = Object.entries(FORMS_PER_MARKET[market]).map(([key, value]) => ({
    name: key,
    value,
  }))
  const formOptions = formList.map(({ name }) => ({ name, value: name }))

  const [selectedForm, setSelectedForm] = useState(() => formList[0])

  const handleChangeMarket = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMarket = event.target.value as Market
    setMarket(newMarket)

    const keys = Object.keys(FORMS_PER_MARKET[newMarket])
    setSelectedForm({
      name: keys[0],
      value: FORMS_PER_MARKET[newMarket][keys[0]],
    })
  }

  const handleChangeSelectedForm = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedForm = formList.find(({ name }) => name === event.target.value)
    if (newSelectedForm) {
      setSelectedForm(newSelectedForm)
    }
  }

  return (
    <form {...pageForm.formProps}>
      <PageWrapper>
        <Content>
          <Space y={1}>
            <InputGroup>
              <Space y={1}>
                <InputSelect
                  label="Market"
                  name={PageInput.Market}
                  options={MARKETS}
                  value={market}
                  onChange={handleChangeMarket}
                />

                <InputSelect
                  label="Insurance bundle"
                  name={PageInput.Bundle}
                  options={formOptions}
                  value={selectedForm.name}
                  onChange={handleChangeSelectedForm}
                />
              </Space>
            </InputGroup>

            <Space y={1}>
              {selectedForm.value.inputGroups.map(({ title, inputs }) => (
                <InputGroup key={title}>
                  <Space y={1}>
                    {inputs.map((input) => (
                      <DynamicInput key={input.name} {...input} />
                    ))}
                  </Space>
                </InputGroup>
              ))}
            </Space>
          </Space>
        </Content>

        <FixedFooter>
          <Space y={0.25}>
            <Button fullWidth disabled={pageForm.state === 'submitting'}>
              Submit
            </Button>
            <ErrorText>{pageForm.errors?.form}</ErrorText>
          </Space>
        </FixedFooter>
      </PageWrapper>
    </form>
  )
}
