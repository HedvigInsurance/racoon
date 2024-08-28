import { useState } from 'react'
import * as React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { TriagingSearchPage } from 'demo/views/TriagingSearchPage'
import { TriagingStartPage } from 'demo/views/TriagingStartPage'
import { TriagingFormPage } from 'demo/views/TriagingFormPage'
import styled from '@emotion/styled'
import { ArrowLeft, InfoCircle } from 'react-bootstrap-icons'
import { Flex } from '@hedvig-ui'
import chroma from 'chroma-js'

const Wrapper = styled.div`
  @media (min-width: 680px) {
    max-width: 480px;
    margin: 1rem auto 0;
  }
`

export const Container = styled.div`
  display: flex;

  flex-direction: column;
  flex: 1;

  padding: 1rem 0;
`

const TopMenuContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0.5rem 2rem 0.75rem 2rem;
`

const BackButton = styled(ArrowLeft)`
  width: 1.75rem;
  height: 1.75rem;

  padding-bottom: 0.25rem;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const InfoButton = styled(InfoCircle)`
  width: 1.5rem;
  height: 1.5rem;

  padding-bottom: 0.25rem;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const StepLine = styled.div<{ active: boolean }>`
  width: 1.25rem;
  height: 0.2rem;

  background-color: ${({ theme, active }) =>
    active
      ? theme.foreground
      : chroma(theme.semiStrongForeground).brighten(2.5).hex()};

  margin: -0.5rem 0.25rem 0 0.25rem;
`

interface ViewSetting {
  back: boolean
  info: boolean
  step: boolean
}

export const TriagingPage: React.FC = () => {
  const [slide, setSlide] = useState(0)
  const [selected, setSelected] = useState<null | string>(null)

  const goBack = () => {
    setSlide((prevSlide) => Math.max(0, prevSlide - 1))
  }

  const settings = [
    { back: false, info: false, step: false },
    { back: true, info: true, step: true },
    { back: true, info: true, step: true },
  ] as ViewSetting[]

  return (
    <Wrapper>
      <Container>
        <TopMenuContainer>
          <div
            style={{ visibility: settings[slide].back ? 'visible' : 'hidden' }}
          >
            <BackButton onClick={goBack} />
          </div>
          <div
            style={{ visibility: settings[slide].step ? 'visible' : 'hidden' }}
          >
            <Flex align="center" justify="center">
              <StepLine active={slide > 0} />
              <StepLine active={slide > 1} />
              <StepLine active={false} />
            </Flex>
          </div>
          <div
            style={{ visibility: settings[slide].info ? 'visible' : 'hidden' }}
          >
            <InfoButton
              onClick={() => window.alert('Not much going on here')}
            />
          </div>
        </TopMenuContainer>
        {/* TODO: Find or build swipeable views component with react 18 support */}
        {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
        {/*@ts-ignore*/}
        <SwipeableViews
          disabled={!selected}
          index={slide}
          onChangeIndex={(nextIndex) => setSlide(nextIndex)}
          onTransitionEnd={() => {
            if (slide !== 2) setSelected(null)
          }}
        >
          <TriagingStartPage onStartClaim={() => setSlide(1)} />
          <TriagingSearchPage
            onSelect={(newOption) => {
              setSelected(newOption)
              setSlide(2)
            }}
          />
          <TriagingFormPage entrypoint={selected ?? ''} />
        </SwipeableViews>
      </Container>
    </Wrapper>
  )
}
