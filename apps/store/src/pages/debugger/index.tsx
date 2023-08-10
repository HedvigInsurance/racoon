import { get } from '@vercel/edge-config'
import { type GetServerSideProps } from 'next'
import { Button, Heading, Space, Text } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  partners: Array<{ name: string; apiKey: string }>

  partner?: string
  ssn?: string
  error?: string
}

const Page = (props: Props) => {
  return (
    <GridLayout.Root>
      <GridLayout.Content width="1/2" align="center">
        <Space y={1}>
          <Heading as="h1" variant="standard.32">
            Debugger
          </Heading>

          <Space y={0.5}>
            <Text as="p" size="lg">
              Create a new trial
            </Text>
            <form method="GET" action="/api/trials">
              <Space y={0.25}>
                <InputSelect
                  label="Partner"
                  name="partner"
                  options={props.partners.map((item) => ({
                    name: item.name,
                    value: item.apiKey,
                  }))}
                  defaultValue={props.partner}
                  required={true}
                />
                <PersonalNumberField label="Personal number" name="ssn" defaultValue={props.ssn} />
                <Space y={0.25}>
                  <Text as="p">...and go to:</Text>

                  <SpaceFlex space={0.25}>
                    <Button size="medium" type="submit" name="destination" value="widget">
                      Partner Widget
                    </Button>

                    <Button size="medium" type="submit">
                      Hedvig.com
                    </Button>
                  </SpaceFlex>

                  {props.error && (
                    <Text as="p" color="textRed">
                      {props.error}
                    </Text>
                  )}
                </Space>
              </Space>
            </form>
          </Space>
        </Space>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

export default Page

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  if (process.env.FEATURE_DEBUGGER !== 'true') {
    return { notFound: true }
  }

  const partners: Props['partners'] = (await get('partners')) ?? []

  return {
    props: {
      partners,
      ...(typeof context.query.partner === 'string' && { partner: context.query.partner }),
      ...(typeof context.query.ssn === 'string' && { ssn: context.query.ssn }),
      ...(typeof context.query.error === 'string' && { error: context.query.error }),
    },
  }
}
