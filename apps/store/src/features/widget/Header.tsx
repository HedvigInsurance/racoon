import styled from '@emotion/styled'
import { HedvigLogo, mq } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { STYLES } from '@/components/GridLayout/GridLayout.helper'
import * as ProgressIndicator from '@/components/ProgressIndicator/ProgressIndicator'

type Props = {
  step: 'YOUR_INFO' | 'SIGN' | 'PAY'
}

export const Header = (props: Props) => {
  return (
    <Wrapper as="header">
      <LogoArea>
        <HedvigLogo />
      </LogoArea>

      <ProgressArea>
        <ProgressIndicator.Root>
          <ProgressIndicator.Step active={props.step === 'YOUR_INFO'}>
            Your info
          </ProgressIndicator.Step>
          <ProgressIndicator.Step active={props.step === 'SIGN'}>Sign</ProgressIndicator.Step>
          <ProgressIndicator.Step active={props.step === 'PAY'}>Pay</ProgressIndicator.Step>
        </ProgressIndicator.Root>
      </ProgressArea>
    </Wrapper>
  )
}

const Wrapper = styled(GridLayout.Root)({
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
