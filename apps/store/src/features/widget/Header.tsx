import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { CheckIcon } from 'ui/src/icons/CheckIcon'
import { ChevronIcon } from 'ui/src/icons/Chevron'
import { HedvigLogo, mq, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { STYLES as GRID_LAYOUT_STYLES } from '@/components/GridLayout/GridLayout.helper'
import * as ProgressIndicator from '@/components/ProgressIndicator/ProgressIndicator'

const STEPS = ['YOUR_INFO', 'SIGN', 'PAY', 'CONFIRMATION'] as const
type Step = (typeof STEPS)[number]

type Props = {
  step: Step
  showBackButton?: boolean
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

  const router = useRouter()

  return (
    <HeaderFrame>
      <LogoArea>
        {props.showBackButton && (
          <BackButton type="button" onClick={() => router.back()}>
            <ArrowBackIcon size="1.125rem" />
          </BackButton>
        )}
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
  position: 'relative',

  [mq.md]: {
    height: '4rem',
    alignItems: 'center',
  },
})

export const LogoArea = styled.div({
  position: 'relative',
  gridColumn: '1 / span 12',

  height: '4rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  [mq.md]: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'space-between',
  },
})

const BackButton = styled.button({
  position: 'absolute',
  left: 0,
  cursor: 'pointer',
  width: '2rem',
  height: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // visually align
  marginLeft: `-${theme.space.xs}`,

  ':hover': {
    color: theme.colors.buttonPrimaryHover,
  },

  ':active': {
    color: theme.colors.gray500,
  },

  ':focus-visible': {
    outline: `2px solid ${theme.colors.buttonPrimaryHover}`,
    borderRadius: theme.radius.xxs,
  },

  [mq.md]: {
    position: 'unset',
  },
})

const ArrowBackIcon = styled(ChevronIcon)({
  transform: 'rotate(90deg)',
})

const ProgressArea = styled.div(GRID_LAYOUT_STYLES['1/3'].center, {
  gridColumn: '1 / span 12',
})
