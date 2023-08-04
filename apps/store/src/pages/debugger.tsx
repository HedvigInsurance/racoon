import { get } from '@vercel/edge-config'
import { GetStaticProps } from 'next'
import { Button, Heading, Space, Text } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  partners: Array<{ name: string; apiKey: string }>
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
                />
                <PersonalNumberField label="Personal number" name="ssn" />
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  if (process.env.FEATURE_DEBUGGER !== 'true') {
    return { notFound: true }
  }

  const partners = (await get('partners')) as Props['partners']

  return {
    props: { partners },
  }
}
