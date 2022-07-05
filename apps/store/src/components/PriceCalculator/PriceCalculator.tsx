import styled from '@emotion/styled'
import * as Accordion from '@radix-ui/react-accordion'
import { forwardRef } from 'react'
import { Button, ChevronIcon, Space } from 'ui'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'
import { FormGroup } from './FormGroup'
import { PriceFormTemplate } from './PriceCalculator.types'
import { useTranslateTextLabel } from './useTranslateTextLabel'

const AccordionHeader = styled(Accordion.Header)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.space[4],
  paddingRight: theme.space[5],
  height: '4rem',

  '&[data-state=closed]': {
    borderBottom: `1px solid ${theme.colors.gray500}`,
  },
}))

const AccordionChevron = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

const AccordionContent = styled(Accordion.Content)(({ theme }) => ({
  borderBottom: `1px solid ${theme.colors.gray500}`,
  padding: theme.space[4],
  paddingTop: theme.space[0],
}))

type OnSubmitParams = { data: Record<string, string> }

export type PriceCalculatorProps = {
  form: PriceFormTemplate
  onSubmit: (params: OnSubmitParams) => void
}

export const PriceCalculator = forwardRef<HTMLFormElement, PriceCalculatorProps>(
  ({ form, onSubmit }, ref) => {
    const translateTextLabel = useTranslateTextLabel({ data: {} })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)

      const userData: Record<string, string> = {}
      data.forEach((value, key) => {
        if (typeof value !== 'string') return
        userData[key] = value
      })

      onSubmit({ data: userData })
    }

    const selectedGroup = form.groups.find((group) => group.state !== 'VALID')

    return (
      <form ref={ref} onSubmit={handleSubmit}>
        <Accordion.Root type="single" value={selectedGroup?.id}>
          {form.groups.map(({ id, title, cta, inputs, state }, index) => (
            <Accordion.Item key={id} value={id}>
              <AccordionHeader>
                <SpaceFlex space={1}>
                  {state === 'VALID' ? '✅' : state === 'INVALID' ? '❌' : `${index + 1}.`}
                  <h2>{translateTextLabel(title)}</h2>
                </SpaceFlex>
                <Accordion.Trigger>
                  <AccordionChevron size="1rem" />
                </Accordion.Trigger>
              </AccordionHeader>
              <AccordionContent>
                <Space y={2}>
                  <FormGroup inputs={inputs} />

                  <footer>
                    <Button type="submit" fullWidth>
                      {translateTextLabel(cta)}
                    </Button>
                  </footer>
                </Space>
              </AccordionContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </form>
    )
  },
)

PriceCalculator.displayName = 'PriceCalculator'
