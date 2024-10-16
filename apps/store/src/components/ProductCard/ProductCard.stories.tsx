import type { Meta, StoryObj } from '@storybook/react'
import { type FormEvent, useState, type ComponentProps } from 'react'
import {
  Alert,
  Badge,
  BasePillow,
  Button,
  Card,
  CrossIcon,
  IconButton,
  InfoIcon,
  sprinkles,
  Text,
  ToggleCard,
  Divider,
  tokens,
  yStack,
} from 'ui'
import { CurrencyCode } from '@/services/graphql/graphql'
import { DetailsList } from '../DetailsList/DetailsList'
import { Discount, FORM_CAMPAIGN_CODE } from '../Discount/Discount'
import { InputStartDay } from '../InputDay/InputStartDay'
import { TotalPrice } from '../TotalPrice/TotalPrice'
import { ProductCardDetails } from './ProductCardDetails'

type Controls = ComponentProps<typeof Card.Root>

const meta: Meta<Controls> = {
  title: 'Components / ProductCard',
  component: Card.Root,
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      allowFullscreen: true,
      type: 'figma',
      url: 'https://www.figma.com/file/5kmmDdh6StpXzbEfr7WevV/Hedvig-UI-Kit?type=design&node-id=18673-5100',
    },
  },
}
export default meta

type Story = StoryObj<Controls>

export const Default: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant}>
        <Card.Aside>
          <IconButton variant="secondary">
            <CrossIcon />
          </IconButton>
        </Card.Aside>
        <Card.Header>
          <Card.Media>
            <BasePillow fill={tokens.colors.amber300} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>Homeowner Insurance</Card.Title>
            <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
          </Card.Heading>
        </Card.Header>

        <ProductCardDetails.Root>
          <ProductCardDetails.Trigger>
            {(isOpen) => (isOpen ? 'Hide details' : 'Show details')}
          </ProductCardDetails.Trigger>

          <ProductCardDetails.Content className={sprinkles({ paddingBlock: 'md' })}>
            <Text className={sprinkles({ mb: 'xxs' })}>Details</Text>
            <DetailsList.Root size="md" className={sprinkles({ mb: 'md' })}>
              <DetailsList.Item>
                <DetailsList.Label>Home type</DetailsList.Label>
                <DetailsList.Value>Homeowner</DetailsList.Value>
              </DetailsList.Item>

              <DetailsList.Item>
                <DetailsList.Label>Address</DetailsList.Label>
                <DetailsList.Value>Bellmansgatan 19A</DetailsList.Value>
              </DetailsList.Item>

              <DetailsList.Item>
                <DetailsList.Label>Zip code</DetailsList.Label>
                <DetailsList.Value>118 47</DetailsList.Value>
              </DetailsList.Item>
            </DetailsList.Root>
            <Button variant="secondary" size="medium" fullWidth>
              Edit information
            </Button>
          </ProductCardDetails.Content>
        </ProductCardDetails.Root>

        <InputStartDay />

        <DetailsList.Root>
          <DetailsList.Item>
            <DetailsList.Label>
              Homeowner Insurance{' '}
              <Badge color="pinkFill1" size="tiny">
                Max
              </Badge>
            </DetailsList.Label>
            <DetailsList.Value>379 kr/mo</DetailsList.Value>
          </DetailsList.Item>

          <DetailsList.Item>
            <DetailsList.Label>Extended travel 60 days</DetailsList.Label>
            <DetailsList.Value>79 kr/mo</DetailsList.Value>
          </DetailsList.Item>
        </DetailsList.Root>

        <Divider />

        <TotalPrice amount={458} currencyCode={CurrencyCode.Sek} />
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'primary',
  },
}

export const Info: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant}>
        <Card.Aside>
          <IconButton variant="secondary">
            <CrossIcon />
          </IconButton>
        </Card.Aside>
        <Card.Header>
          <Card.Media>
            <BasePillow fill={tokens.colors.amber300} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>Homeowner Insurance</Card.Title>
            <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
          </Card.Heading>
        </Card.Header>

        <ProductCardDetails.Root>
          <ProductCardDetails.Trigger>
            {(isOpen) => (isOpen ? 'Hide details' : 'Show details')}
          </ProductCardDetails.Trigger>

          <ProductCardDetails.Content className={sprinkles({ paddingBlock: 'md' })}>
            <Text className={sprinkles({ mb: 'xxs' })}>Details</Text>
            <DetailsList.Root size="md" className={sprinkles({ mb: 'md' })}>
              <DetailsList.Item>
                <DetailsList.Label>Home type</DetailsList.Label>
                <DetailsList.Value>Homeowner</DetailsList.Value>
              </DetailsList.Item>

              <DetailsList.Item>
                <DetailsList.Label>Address</DetailsList.Label>
                <DetailsList.Value>Bellmansgatan 19A</DetailsList.Value>
              </DetailsList.Item>

              <DetailsList.Item>
                <DetailsList.Label>Zip code</DetailsList.Label>
                <DetailsList.Value>118 47</DetailsList.Value>
              </DetailsList.Item>
            </DetailsList.Root>
            <Button variant="secondary" size="medium" fullWidth>
              Edit information
            </Button>
          </ProductCardDetails.Content>
        </ProductCardDetails.Root>

        <div className={yStack({ gap: 'xxs' })}>
          <InputStartDay />

          <Alert.Root variant="info">
            <Alert.Icon icon={InfoIcon} />
            <Alert.Body>
              <Alert.Message>
                Unfortunately we are unable to cancel your old insurance with Folksam. Please
                provide your end date above.
              </Alert.Message>
            </Alert.Body>
          </Alert.Root>
        </div>

        <DetailsList.Root>
          <DetailsList.Item>
            <DetailsList.Label>
              Homeowner Insurance{' '}
              <Badge color="pinkFill1" size="tiny">
                Max
              </Badge>
            </DetailsList.Label>
            <DetailsList.Value>379 kr/mo</DetailsList.Value>
          </DetailsList.Item>

          <DetailsList.Item>
            <DetailsList.Label>Extended travel 60 days</DetailsList.Label>
            <DetailsList.Value>79 kr/mo</DetailsList.Value>
          </DetailsList.Item>
        </DetailsList.Root>

        <Divider />

        <TotalPrice amount={458} currencyCode={CurrencyCode.Sek} />
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'primary',
  },
}

export const WithSwitching: Story = {
  render: (args: Controls) => {
    const [shouldAutoSwitch, setShouldAutoSwitch] = useState(true)

    return (
      <div style={{ maxWidth: '400px' }}>
        <Card.Root variant={args.variant}>
          <Card.Aside>
            <IconButton variant="secondary">
              <CrossIcon />
            </IconButton>
          </Card.Aside>
          <Card.Header>
            <Card.Media>
              <BasePillow fill={tokens.colors.amber300} />
            </Card.Media>
            <Card.Heading>
              <Card.Title>Homeowner Insurance</Card.Title>
              <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
            </Card.Heading>
          </Card.Header>

          <ProductCardDetails.Root>
            <ProductCardDetails.Trigger>
              {(isOpen) => (isOpen ? 'Hide details' : 'Show details')}
            </ProductCardDetails.Trigger>

            <ProductCardDetails.Content className={sprinkles({ paddingBlock: 'md' })}>
              <Text className={sprinkles({ mb: 'xxs' })}>Details</Text>
              <DetailsList.Root size="md" className={sprinkles({ mb: 'md' })}>
                <DetailsList.Item>
                  <DetailsList.Label>Home type</DetailsList.Label>
                  <DetailsList.Value>Homeowner</DetailsList.Value>
                </DetailsList.Item>

                <DetailsList.Item>
                  <DetailsList.Label>Address</DetailsList.Label>
                  <DetailsList.Value>Bellmansgatan 19A</DetailsList.Value>
                </DetailsList.Item>

                <DetailsList.Item>
                  <DetailsList.Label>Zip code</DetailsList.Label>
                  <DetailsList.Value>118 47</DetailsList.Value>
                </DetailsList.Item>
              </DetailsList.Root>
              <Button variant="secondary" size="medium" fullWidth>
                Edit information
              </Button>
            </ProductCardDetails.Content>
          </ProductCardDetails.Root>

          <div className={yStack({ gap: 'xxs' })}>
            <ToggleCard.Root>
              <ToggleCard.Label>Automatic switching</ToggleCard.Label>
              <ToggleCard.Switch checked={shouldAutoSwitch} onCheckedChange={setShouldAutoSwitch} />
              <ToggleCard.Description>
                Hedvig will cancel your current insurance at Folksam. Your insurance at Hedvig
                activates automatically when it expires
              </ToggleCard.Description>
            </ToggleCard.Root>

            {!shouldAutoSwitch ? <InputStartDay /> : null}
          </div>

          <DetailsList.Root>
            <DetailsList.Item>
              <DetailsList.Label>
                Homeowner Insurance{' '}
                <Badge color="pinkFill1" size="tiny">
                  Max
                </Badge>
              </DetailsList.Label>
              <DetailsList.Value>379 kr/mo</DetailsList.Value>
            </DetailsList.Item>

            <DetailsList.Item>
              <DetailsList.Label>Extended travel 60 days</DetailsList.Label>
              <DetailsList.Value>79 kr/mo</DetailsList.Value>
            </DetailsList.Item>
          </DetailsList.Root>

          <Divider />

          <TotalPrice amount={458} currencyCode={CurrencyCode.Sek} />
        </Card.Root>
      </div>
    )
  },
  args: {
    variant: 'primary',
  },
}

export const WithDiscount: Story = {
  render: (args: Controls) => {
    const [shouldAutoSwitch, setShouldAutoSwitch] = useState(true)
    const [discountCode, setDiscountCode] = useState<string | null>('BANK')

    const removeDiscount = () => {
      setDiscountCode(null)
    }

    const addDiscount = (event: FormEvent<HTMLFormElement>) => {
      const formData = new FormData(event.currentTarget)
      const code = formData.get(FORM_CAMPAIGN_CODE) as string

      setDiscountCode(code)
    }

    return (
      <div style={{ maxWidth: '400px' }}>
        <Card.Root variant={args.variant}>
          <Card.Aside>
            <IconButton variant="secondary">
              <CrossIcon />
            </IconButton>
          </Card.Aside>
          <Card.Header>
            <Card.Media>
              <BasePillow fill={tokens.colors.amber300} />
            </Card.Media>
            <Card.Heading>
              <Card.Title>Homeowner Insurance</Card.Title>
              <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
            </Card.Heading>
          </Card.Header>

          <ProductCardDetails.Root>
            <ProductCardDetails.Trigger>
              {(isOpen) => (isOpen ? 'Hide details' : 'Show details')}
            </ProductCardDetails.Trigger>

            <ProductCardDetails.Content className={sprinkles({ paddingBlock: 'md' })}>
              <Text className={sprinkles({ mb: 'xxs' })}>Details</Text>
              <DetailsList.Root size="md" className={sprinkles({ mb: 'md' })}>
                <DetailsList.Item>
                  <DetailsList.Label>Home type</DetailsList.Label>
                  <DetailsList.Value>Homeowner</DetailsList.Value>
                </DetailsList.Item>

                <DetailsList.Item>
                  <DetailsList.Label>Address</DetailsList.Label>
                  <DetailsList.Value>Bellmansgatan 19A</DetailsList.Value>
                </DetailsList.Item>

                <DetailsList.Item>
                  <DetailsList.Label>Zip code</DetailsList.Label>
                  <DetailsList.Value>118 47</DetailsList.Value>
                </DetailsList.Item>
              </DetailsList.Root>
              <Button variant="secondary" size="medium" fullWidth>
                Edit information
              </Button>
            </ProductCardDetails.Content>
          </ProductCardDetails.Root>

          <div className={yStack({ gap: 'xxs' })}>
            <ToggleCard.Root>
              <ToggleCard.Label>Automatic switching</ToggleCard.Label>
              <ToggleCard.Switch checked={shouldAutoSwitch} onCheckedChange={setShouldAutoSwitch} />
              <ToggleCard.Description>
                Hedvig will cancel your current insurance at Folksam. Your insurance at Hedvig
                activates automatically when it expires
              </ToggleCard.Description>
            </ToggleCard.Root>

            {!shouldAutoSwitch ? <InputStartDay /> : null}
          </div>

          <Discount.Root
            defaultOpen={!!discountCode}
            onOpenChange={(isOpen) => !isOpen && removeDiscount()}
          >
            {discountCode ? (
              <Discount.Code code={discountCode} onSubmit={removeDiscount}>
                -20% for 3 months
              </Discount.Code>
            ) : (
              <Discount.Form onSubmit={addDiscount} />
            )}
          </Discount.Root>

          <Divider />

          <DetailsList.Root>
            <DetailsList.Item>
              <DetailsList.Label>
                Homeowner Insurance{' '}
                <Badge color="pinkFill1" size="tiny">
                  Max
                </Badge>
              </DetailsList.Label>
              <DetailsList.Value>379 kr/mo</DetailsList.Value>
            </DetailsList.Item>

            <DetailsList.Item>
              <DetailsList.Label>Extended travel 60 days</DetailsList.Label>
              <DetailsList.Value>79 kr/mo</DetailsList.Value>
            </DetailsList.Item>
          </DetailsList.Root>

          <Divider />

          <TotalPrice amount={458} currencyCode={CurrencyCode.Sek} />
        </Card.Root>
      </div>
    )
  },
  args: {
    variant: 'primary',
  },
}
