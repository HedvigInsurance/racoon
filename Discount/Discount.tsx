import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { type ComponentProps, createContext, useContext, useState } from 'react'
import {
  xStack,
  Text,
  Switch,
  sprinkles,
  Button,
  Badge,
  IconButton,
  CrossIconSmall,
  tokens,
} from 'ui'
import Collapsible from '@/components/Collapsible/Collapsible'
import { TextField } from '@/components/TextField/TextField'
import {
  discountForm,
  formInput,
  formSubmitButton,
} from '/Users/rafaelyouakeem/Desktop/projects/hedvig/racoon/apps/store/src/components/Discount/Discount.css'

export const FORM_CAMPAIGN_CODE = 'campaignCode'

type DiscountContext = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}
const Context = createContext<DiscountContext | null>(null)

const useDiscount = () => {
  const context = useContext(Context)

  if (!context) {
    throw new Error('useDiscount must be used inside Discount.Root')
  }

  return context
}

type RootProps = Omit<ComponentProps<typeof Collapsible.Root>, 'open'>
const DiscountRoot = ({ children, defaultOpen, ...props }: RootProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false)

  return (
    <Context.Provider value={{ isOpen, setIsOpen }}>
      <Collapsible.Root open={isOpen} {...props}>
        {children}
      </Collapsible.Root>
    </Context.Provider>
  )
}

const DiscountHeader = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={clsx(xStack({ justifyContent: 'space-between', alignItems: 'center' }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

const DiscountToggle = () => {
  const { isOpen, setIsOpen } = useDiscount()

  return (
    <Collapsible.Trigger asChild>
      <Switch checked={isOpen} onCheckedChange={setIsOpen} />
    </Collapsible.Trigger>
  )
}

const DiscountContent = ({ children, ...props }: ComponentProps<typeof Collapsible.Content>) => {
  return (
    <Collapsible.Content {...props}>
      <div className={sprinkles({ paddingTop: 'md' })}>{children}</div>
    </Collapsible.Content>
  )
}

type FormProps = ComponentProps<'form'> & {
  errorMessage?: string
  loading?: boolean
}
const DiscountForm = ({ className, errorMessage, loading, ...props }: FormProps) => {
  const { t } = useTranslation('cart')

  return (
    <form className={clsx(discountForm, className)} {...props}>
      <TextField
        className={formInput}
        name={FORM_CAMPAIGN_CODE}
        label={t('CAMPAIGN_CODE_INPUT_LABEL')}
        size="medium"
        warning={!!errorMessage}
        message={errorMessage}
        required={true}
        upperCaseInput={true}
        readOnly={loading}
        disabled={loading}
      />

      <Button
        className={formSubmitButton}
        type="submit"
        size="medium"
        variant="primary"
        loading={loading}
        disabled={loading}
      >
        {t('CHECKOUT_ADD_DISCOUNT_BUTTON')}
      </Button>
    </form>
  )
}

type CodeProps = ComponentProps<'form'> & {
  code: string
}
const DiscountCode = ({ children, className, code, ...props }: CodeProps) => {
  return (
    <form
      className={clsx(xStack({ justifyContent: 'space-between', alignItems: 'center' }), className)}
      {...props}
    >
      <Badge
        className={xStack({ alignItems: 'center', paddingRight: 'none', gap: 'sm' })}
        color="translucent1"
      >
        <Text as="span" size="xs">
          {code}
        </Text>
        <input hidden name={FORM_CAMPAIGN_CODE} value={code} readOnly />
        <IconButton variant="ghost" style={{ padding: 0 }} data-no-hover>
          <CrossIconSmall color={tokens.colors.textTertiary} />
        </IconButton>
      </Badge>
      <Text>{children}</Text>
    </form>
  )
}

export const Discount = {
  Root: DiscountRoot,
  Header: DiscountHeader,
  Toggle: DiscountToggle,
  Content: DiscountContent,
  Form: DiscountForm,
  Code: DiscountCode,
}
