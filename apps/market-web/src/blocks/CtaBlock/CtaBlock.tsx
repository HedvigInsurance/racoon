import styled from '@emotion/styled'
import { ButtonColors, ButtonSize, LinkButton } from 'ui'
import { getStoryblokLinkUrl } from '@/services/storyblok/storyblok'
import {
  StoryblokBaseBlock,
  MinimalColorComponent,
  LinkComponent,
} from '@/services/storyblok/types'
import { SectionWrapper, ContentWrapper } from '../blockHelpers'

type CtaBlockProps = StoryblokBaseBlock & {
  cta_label: string
  cta_link: LinkComponent
  cta_color?: MinimalColorComponent
  cta_style?: 'filled' | 'outlined'
  cta_size?: ButtonSize
}

const ButtonWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
})

export const CtaBlock = ({
  color,
  index,
  size,
  cta_label,
  cta_link,
  cta_color,
  cta_style,
  cta_size,
}: CtaBlockProps) => (
  <SectionWrapper colorComponent={color} size={size}>
    <ContentWrapper contentWidth index={index}>
      <ButtonWrapper>
        <LinkButton
          href={getStoryblokLinkUrl(cta_link)}
          size={cta_size}
          color={cta_color?.color as ButtonColors}
          fullWidth={false}
          variant={cta_style}
        >
          {cta_label}
        </LinkButton>
      </ButtonWrapper>
    </ContentWrapper>
  </SectionWrapper>
)
