import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { type ComponentProps, useState } from 'react'
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
import { formInput, formSubmitButton } from './Discount.css'

export const FORM_CAMPAIGN_CODE = 'campaignCode'

type RootProps = Omit<ComponentProps<typeof Collapsible.Root>, 'open'>
const DiscountRoot = ({ children, defaultOpen, ...props }: RootProps) => {
  const { t } = useTranslation('cart')

  const [isOpen, setIsOpen] = useState(defaultOpen || false)

  return (
    <Collapsible.Root open={isOpen} {...props}>
      <div className={xStack({ justifyContent: 'space-between', alignItems: 'center' })}>
        <Text>{t('CAMPAIGN_CODE_HEADING')}</Text>
        <Collapsible.Trigger asChild>
          <Switch checked={isOpen} onCheckedChange={setIsOpen} />
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content>
        <div className={sprinkles({ paddingTop: 'md' })}>{children}</div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

type FormProps = ComponentProps<'form'> & {
  errorMessage?: string
  loading?: boolean
}
const DiscountForm = ({ className, errorMessage, loading, ...props }: FormProps) => {
  const { t } = useTranslation('cart')

  return (
    <form
      className={clsx(
        xStack({ justifyContent: 'space-between', alignItems: 'flex-start', gap: 'sm' }),
        className,
      )}
      {...props}
    >
      <TextField
        className={formInput}
        name={FORM_CAMPAIGN_CODE}
        label={t('CAMPAIGN_CODE_INPUT_LABEL')}
        size="small"
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
        variant="primary-alt"
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
  Form: DiscountForm,
  Code: DiscountCode,
}
