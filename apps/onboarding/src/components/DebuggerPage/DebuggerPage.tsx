import styled from '@emotion/styled'
import React, { useEffect, useMemo, useState } from 'react'
import { Button, InputBase, InputBaseProps, InputField, Space } from 'ui'
import { useForm } from '@/hooks/use-form'
import { PageLink } from '@/lib/page-link'
import { Market } from '@/lib/types'
import { FORMS_PER_MARKET, MARKETS, PageInput } from './DebuggerPage.constants'

const PAGE_WIDTH = '600px'

const PageWrapper = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.gray200,
  minHeight: '100vh',
}))

const Content = styled.div(() => ({
  maxWidth: PAGE_WIDTH,
  margin: '0 auto',
  padding: '1rem 0.5rem',
}))

const Footer = styled.div(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  padding: '1rem 0.5rem',

  display: 'flex',
  justifyContent: 'center',
  backgroundColor: theme.colors.white,
  boxShadow: `0px -1px 10px rgba(0, 0, 0, 0.1)`,

  [Button.name]: {
    maxWidth: `calc(${PAGE_WIDTH} - 1rem)`,
  },
}))

const InputGroup = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.gray100,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  padding: '1rem',
  borderRadius: '0.75rem',
}))

type InputSelectProps = InputBaseProps & {
  name: string
  options: Array<{ name: string; value: string }>
  value?: string
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

const InputSelect = ({
  options,
  name,
  onChange,
  value,
  defaultValue,
  ...rest
}: InputSelectProps) => {
  console.log('InputSelect', { value, defaultValue })
  return (
    <InputBase {...rest}>
      {() => (
        <select
          id={rest.id}
          name={name}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
        >
          {options.map(({ name, value }) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
      )}
    </InputBase>
  )
}

export const DebuggerPage = () => {
  const [market, setMarket] = useState(() => Market.Sweden)
  const marketForms = useMemo(() => FORMS_PER_MARKET[market], [market])
  const marketFormList = useMemo(
    () =>
      Object.entries(marketForms).map(([key, value]) => ({
        name: key,
        value,
      })),
    [marketForms],
  )
  const [formType, setFormType] = useState(() => marketFormList[0])

  const form = useForm({ action: PageLink.debuggerFormApi() })

  useEffect(() => {
    setFormType(marketFormList[0])
  }, [marketFormList])

  const handleChangeMarket = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMarket = event.target.value as Market
    setMarket(newMarket)

    const keys = Object.keys(FORMS_PER_MARKET[newMarket])
    setFormType({
      name: keys[0],
      value: FORMS_PER_MARKET[newMarket][keys[0]],
    })
  }

  const handleChangeFormType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const marketForm = marketFormList.find(({ name }) => name === event.target.value)
    if (marketForm) {
      setFormType(marketForm)
    }
  }

  return (
    <form {...form.formProps}>
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
                  options={marketFormList.map(({ name }) => ({ name, value: name }))}
                  value={formType.name}
                  onChange={handleChangeFormType}
                />
              </Space>
            </InputGroup>

            <Space y={1}>
              {formType.value.inputGroups.map(({ title, inputs }) => (
                <InputGroup key={title}>
                  <Space y={1}>
                    {inputs.map((input) => {
                      switch (input.type) {
                        case 'select':
                          return (
                            <InputSelect
                              label={input.label}
                              name={input.name}
                              options={input.options}
                              defaultValue={input.defaultValue}
                            />
                          )
                        default:
                          return (
                            <InputField
                              key={input.name}
                              name={input.name}
                              label={input.label}
                              placeholder={input.placeholder}
                              defaultValue={input.defaultValue}
                              type={input.type}
                            />
                          )
                      }
                    })}
                  </Space>
                </InputGroup>
              ))}
            </Space>
          </Space>
        </Content>

        <Footer>
          <Button fullWidth disabled={form.state === 'submitting'}>
            Submit
          </Button>
        </Footer>
      </PageWrapper>
    </form>
  )
}
