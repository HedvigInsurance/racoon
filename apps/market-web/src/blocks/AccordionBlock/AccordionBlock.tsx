import styled from '@emotion/styled'
import { Container } from 'constate'
import Head from 'next/head'
import React from 'react'
import AnimateHeight from 'react-animate-height'
import { mq } from 'ui'
import { Plus } from '@/components/icons/Plus'
import { structuredFAQPage } from '@/helpers/structuredData'
import { MarkdownHtmlComponent, StoryblokBaseBlock } from '@/lib/types'
import { SectionWrapper, ContentWrapper } from '../blockHelpers'

export type AccordionProps = {
  _uid: string
  title: string
  paragraph: MarkdownHtmlComponent
}

type Openable = {
  isOpen: boolean
}

const AccordionsWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
})

const AccordionsList = styled.ul({
  maxWidth: '40rem',
  width: '100%',
  padding: 0,
  margin: 0,
  listStyle: 'none',
})

const AccordionsTitle = styled.h3({
  marginBottom: '5rem',
  fontSize: '2rem',
  textAlign: 'center',
  lineHeight: 1.2,

  [mq.md]: {
    marginBottom: '6.25rem',
    fontSize: '3rem',
  },
})

const AccordionItem = styled.li({
  width: '100%',
  margin: 0,
  pading: 0,
})

const AccordionTitle = styled.h4({
  margin: 0,
  paddingTop: '1rem',
  paddingBottom: '1rem',
  fontSize: '1.125rem',
  lineHeight: 1.4,
  borderBottom: '1px solid currentColor',

  [mq.md]: {
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
    fontSize: '1.5rem',
  },
})

const ExpandToggler = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: 0,
  textAlign: 'inherit',
  lineHeight: 'inherit',
  fontSize: 'inherit',
  background: 'transparent',
  border: 'none',
  fontWeight: 'inherit',
  fontFamily: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
  appearance: 'none',

  '&:focus': {
    outline: 'none',
  },
})

const AccordionTitleContent = styled.span({
  paddingRight: '1rem',
  textAlign: 'left',
})

const AccordionContent = styled.div({
  overflowY: 'hidden',

  [mq.md]: {
    padding: '3rem 3rem 1.5rem 3rem',
    '& p': {
      marginTop: 0,
      marginBottom: '1rem',
    },
    '& p:last-child': {
      margin: 0,
    },
  },
})

const ExpanderWrapper = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '1.625rem',
  height: '1.625rem',

  [mq.md]: {
    width: '3rem',
    height: '3rem',
    borderRadius: '0.375rem',
  },
})

const ExpanderIcon = styled(Plus)<Openable>(({ isOpen }) => ({
  transform: isOpen ? 'rotate(45deg)' : undefined,
  transition: 'transform 150ms',
  width: '1rem',
  height: '1rem',

  [mq.md]: {
    width: '1.5rem',
    height: '1.5rem',
  },
}))

export const Accordion = ({ title, paragraph }: AccordionProps) => {
          <AccordionContent
            dangerouslySetInnerHTML={{ __html: paragraph?.html }}
          />
        </AnimateHeight>
      </AccordionItem>
    )}
  </Container>
)

export type AccordionBlockProps = StoryblokBaseBlock & {
  title: string
  accordions: ReadonlyArray<AccordionProps>
  is_faq?: boolean
}

export const AccordionBlock = ({
  accordions,
  color,
  extra_styling,
  index,
  size,
  title,
  is_faq = false,
}: AccordionBlockProps) => (
  <SectionWrapper colorComponent={color} size={size} extraStyling={extra_styling}>
    <ContentWrapper contentWidth index={index}>
      <AccordionsTitle>{title}</AccordionsTitle>
      <AccordionsWrapper>
        {accordions && accordions.length > 0 && (
          <AccordionsList>
            {accordions.map((accordion) => (
              <Accordion key={accordion._uid} {...accordion} />
            ))}
          </AccordionsList>
        )}
      </AccordionsWrapper>
    </ContentWrapper>

    {is_faq && (
      <Head>
        <script type="application/ld+json">{JSON.stringify(structuredFAQPage(accordions))}</script>
      </Head>
    )}
  </SectionWrapper>
)
