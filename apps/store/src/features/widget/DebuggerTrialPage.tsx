import styled from '@emotion/styled'
import { Button, Heading, Space, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import * as InputRadio from '@/components/PriceCalculator/InputRadio'
import { TextField } from '@/components/TextField/TextField'
import { Field } from './debuggerTrial.types'

export const DebuggerTrialPage = () => {
  // 10 days from now
  const defaultStartDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  return (
    <Wrapper>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={2}>
            <Heading as="h1" align="center">
              Trial Contract Debugger
            </Heading>

            <form method="POST" action="/api/debugger/trial">
              <Space y={0.25}>
                <TextField
                  label="First name"
                  name={Field.firstName}
                  required={true}
                  defaultValue="Sven"
                />
                <TextField
                  label="Last name"
                  name={Field.lastName}
                  required={true}
                  defaultValue="Svensson"
                />
                <TextField
                  label="Start date (YYYY-MM-DD)"
                  name={Field.startDate}
                  required={true}
                  pattern="\d{4}-\d{2}-\d{2}"
                  defaultValue={defaultStartDate}
                />
                <TextField
                  label="Street"
                  name={Field.street}
                  required={true}
                  defaultValue="Kungsholms strand 181"
                />
                <TextField
                  label="Zip Code"
                  name={Field.zipCode}
                  required={true}
                  pattern="\d{3} \d{2}"
                  defaultValue="112 48"
                />
                <InputRadio.HorizontalRoot
                  name={Field.subType}
                  label="Sub Type"
                  required={true}
                  defaultValue="RENT"
                >
                  <InputRadio.HorizontalItem label="Rent" value="RENT" />
                  <InputRadio.HorizontalItem label="Own" value="BRF" />
                </InputRadio.HorizontalRoot>

                <TextField
                  type="email"
                  label="Email"
                  name={Field.email}
                  placeholder="Leave empty to randomize"
                />
                <TextField
                  label="Birth date (YYYY-MM-DD)"
                  name={Field.birthDate}
                  pattern="\d{4}-\d{2}-\d{2}"
                />

                <Button type="submit">Create trial contract</Button>
              </Space>
            </form>
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  paddingBlock: theme.space.xl,
})
