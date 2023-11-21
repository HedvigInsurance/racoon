import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { CheckIcon, HedvigLogo, mq } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { STYLES } from '@/components/GridLayout/GridLayout.helper'
import * as ProgressIndicator from '@/components/ProgressIndicator/ProgressIndicator'

const STEPS = ['YOUR_INFO', 'SIGN', 'PAY', 'CONFIRMATION'] as const
type Step = (typeof STEPS)[number]

type Props = {
  step: Step
}

type ProgressStep = { key: Step; label: string }

export const Header = (props: Props) => {
  const { t } = useTranslation('widget')
  const progressSteps: Array<ProgressStep> = [
    {
      key: 'YOUR_INFO',
      label: t('WIDGET_PROGRESS_YOUR_INFO'),
    },
    {
      key: 'SIGN',
      label: t('WIDGET_PROGRESS_SIGN'),
    },
    {
      key: 'PAY',
      label: t('WIDGET_PROGRESS_PAY'),
    },
  ]

  const stepIndex = STEPS.indexOf(props.step)

  return (
    <HeaderFrame>
      <LogoArea>
        <HedvigLogo />
      </LogoArea>

      <ProgressArea>
        <ProgressIndicator.Root>
          {progressSteps.map((item, index) => (
            <ProgressIndicator.Step key={item.key} active={props.step === item.key}>
              {index < stepIndex && <CheckIcon size="1rem" />}
              {item.label}
            </ProgressIndicator.Step>
          ))}
        </ProgressIndicator.Root>
      </ProgressArea>
    </HeaderFrame>
  )
}

export const HeaderFrame = styled(GridLayout.Root)({
  height: '4rem',
  alignItems: 'center',
})

const LogoArea = styled.div({
  display: 'none',
  [mq.md]: { display: 'block', gridColumn: '1 / span 2' },
})

const ProgressArea = styled.div(STYLES['1/3'].center, {
  gridColumn: '1 / span 12',
})
