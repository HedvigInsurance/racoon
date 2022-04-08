import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import { minimalColorMap } from '@/helpers/storybook'
import { LinkComponent, MarkdownHtmlComponent } from '@/services/storyblok/types'
import { MenuItem as StoryblokMenuItem } from '@/services/storyblok/types'
import { MenuBlock } from './MenuBlock'

export const link: LinkComponent = {
  id: '2',
  url: '/',
  linktype: 'url',
  cached_url: '/',
}

const menuData: StoryblokMenuItem[] = [
  {
    _uid: '1',
    label: 'Vår service',
    link,
    component: 'menu_item',
  },
  {
    _uid: '2',
    label: 'Vårt skydd',
    link,
    component: 'menu_item',
  },
  {
    _uid: '3',
    label: 'Hemförsäkring',
    link,
    component: 'menu_item',
    menu_items: [
      {
        _uid: '11',
        label: 'Hyresrätt & Andrahand',
        link,
        component: 'menu_item',
      },
      {
        _uid: '12',
        label: 'Bostadsrätt',
        link,
        component: 'menu_item',
      },
      {
        _uid: '13',
        label: 'Student',
        link,
        component: 'menu_item',
      },
      {
        _uid: '14',
        label: 'Villa',
        link,
        component: 'menu_item',
      },
    ],
  },
  {
    _uid: '4',
    label: 'Våra Försäkringar',
    link,
    component: 'menu_item',
    menu_item_groups: [
      {
        _uid: '1',
        label: 'Hemförsäkringar',
        menu_items: [
          {
            _uid: '11',
            label: 'Hyresrätt & Andrahand',
            link,
            component: 'menu_item',
          },
          {
            _uid: '12',
            label: 'Bostadsrätt',
            link,
            component: 'menu_item',
          },
          {
            _uid: '13',
            label: 'Student',
            link,
            component: 'menu_item',
          },
          {
            _uid: '14',
            label: 'Villa',
            link,
            component: 'menu_item',
          },
        ],
      },

      {
        _uid: '2',
        label: 'Tillval',
        menu_items: [
          {
            _uid: '15',
            label: 'Olycksfallsförsäkring',
            link,
            component: 'menu_item',
          },
        ],
      },
    ],
  },
  {
    _uid: '5',
    label: 'Om Hedvig',
    link,
    component: 'menu_item',
  },
]

export default {
  title: 'Market Web / Blocks / MenuBlock',
  component: MenuBlock,
  args: {
    _uid: '1234',
    component: 'banner_block',
    items: menuData,
  },
} as ComponentMeta<typeof MenuBlock>

const Template: ComponentStory<typeof MenuBlock> = (args) => <MenuBlock {...args} />

export const Default = Template.bind({})
