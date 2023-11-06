import styled from '@emotion/styled'
import { HedvigLogo, mq } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { STYLES } from '@/components/GridLayout/GridLayout.helper'
import * as ProgressIndicator from '@/components/ProgressIndicator/ProgressIndicator'

const Page = () => {
  return (
    <div>
      <Header as="header">
        <LogoArea>
          <HedvigLogo />
        </LogoArea>

        <ProgressArea>
          <ProgressIndicator.Root>
            <ProgressIndicator.Step active={true}>Your info</ProgressIndicator.Step>
            <ProgressIndicator.Step>Sign</ProgressIndicator.Step>
            <ProgressIndicator.Step>Pay</ProgressIndicator.Step>
          </ProgressIndicator.Root>
        </ProgressArea>
      </Header>
    </div>
  )
}

const Header = styled(GridLayout.Root)({
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

export default Page
