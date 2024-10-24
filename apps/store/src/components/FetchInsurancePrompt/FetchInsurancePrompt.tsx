import { useTranslation } from 'next-i18next'
import { Button } from 'ui/src/components/Button/Button'
import { Dialog } from 'ui/src/components/Dialog/Dialog'
import { CheckIcon } from 'ui/src/icons/CheckIcon'
import { Heading, Text, xStack, yStack } from 'ui'

type Props = {
  company: string
  onClickConfirm: () => void
  onClickSkip: () => void
}

export const FetchInsurancePrompt = ({ company, onClickConfirm, onClickSkip }: Props) => {
  const { t } = useTranslation('purchase-form')

  const listItems = t('FETCH_INSURANCE_PROMPT_LIST').split('\n')

  return (
    <div className={yStack({ gap: 'lg', paddingInline: 'xs' })}>
      <div>
        <Dialog.Title asChild={true}>
          <Heading as="h3" variant="standard.18">
            {t('FETCH_INSURANCE_PROMPT_TITLE', { company })}
          </Heading>
        </Dialog.Title>
        <Text color="textSecondary">{t('FETCH_INSURANCE_PROMPT_SUBTITLE')}</Text>
      </div>

      <ul className={yStack({ gap: 'md' })}>
        {listItems.map((item) => (
          <ListItem key={item}>{item}</ListItem>
        ))}
      </ul>

      <div className={yStack({ gap: 'md' })}>
        <div className={yStack({ gap: 'xxs' })}>
          <Button onClick={onClickConfirm} fullWidth={true}>
            {t('FETCH_INSURANCE_PROMPT_BUTTON_CONFIRM')}
          </Button>
          <Button variant="ghost" onClick={onClickSkip} fullWidth={true}>
            {t('FETCH_INSURANCE_PROMPT_BUTTON_SKIP')}
          </Button>
        </div>

        <Text size="xxs" color="textSecondary" align="center" balance={true}>
          {t('FETCH_INSURANCE_PROMPT_DISCLAIMER')}
        </Text>
      </div>
    </div>
  )
}

function ListItem({ children }: { children: string }) {
  return (
    <li className={xStack({ gap: 'sm', alignItems: 'center' })}>
      <CheckIcon size="1rem" />
      <Text>{children}</Text>
    </li>
  )
}
