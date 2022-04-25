import styled from '@emotion/styled'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'
import React from 'react'
import { StoryData } from 'storyblok-js-client'
import { globalStoryMock, link, minimalColorMap } from '@/helpers/mockedData'
import { HeroBlock } from '../HeroBlock/HeroBlock'
import { PageHeaderBlock, PageHeaderBlockProps } from './PageHeaderBlock'

const ScrollContainer = styled.div({
  height: '140vh',
})

export default {
  title: 'Market Web / Blocks / PageHeaderBlock',
  component: PageHeaderBlock,
  argTypes: {
    cta_color: {
      options: Object.keys(minimalColorMap),
      mapping: minimalColorMap,
    },
  },
  args: {
    story: globalStoryMock,
  },
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'Dark',
    },
  },
} as ComponentMeta<typeof PageHeaderBlock>

const Template: ComponentStory<typeof PageHeaderBlock> = (
  args: PageHeaderBlockProps & { story: StoryData },
) => (
  <>
    <MemoryRouterProvider url="/initial-url">
      <PageHeaderBlock {...args} />
    </MemoryRouterProvider>
    <ScrollContainer />
  </>
)

export const Default = Template.bind({})
Default.args = {
  is_transparent: true,
  inverse_colors: true,
}

const TemplateWithHero: ComponentStory<typeof PageHeaderBlock> = (
  args: PageHeaderBlockProps & { story: StoryData },
) => (
  <>
    <MemoryRouterProvider url="/initial-url">
      <PageHeaderBlock {...args} />
      <HeroBlock
        _uid="1234"
        component="hero"
        color={minimalColorMap['standard-inverse']}
        headline="Hjälp så som du aldrig kunnat <br/>föreställa dig den"
        headline_font_size="md"
        image="https://res.cloudinary.com/gustaveen-com/image/upload/q_40/v1589550685/hus_villa_z07bvi.jpg"
        image_mobile="https://res.cloudinary.com/gustaveen-com/image/upload/q_40/v1589552944/hus_villa_mobile_vu7rx6.jpg"
        hide_bg_tint={false}
        show_cta={true}
        cta_label="Läs mer"
        cta_style="outlined"
        cta_color={minimalColorMap['standard-inverse']}
        cta_link={link}
      />
    </MemoryRouterProvider>
    <ScrollContainer />
  </>
)

export const WithHero = TemplateWithHero.bind({})
WithHero.args = {
  is_transparent: true,
  inverse_colors: true,
}
