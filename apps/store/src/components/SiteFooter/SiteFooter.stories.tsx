import { ComponentMeta, Story } from '@storybook/react'
import { Locale } from '@/lib/l10n/types'
import { PageLink } from '@/lib/PageLink'
import { SiteFooter, SiteFooterProps } from './SiteFooter'

export default {
  title: 'Site Footer',
  component: SiteFooter,
  argTypes: {
    onChangeLocale: { action: 'onChangeLocale' },
  },
} as ComponentMeta<typeof SiteFooter>

const Template: Story<SiteFooterProps> = (props) => {
  return <SiteFooter {...props} />
}

export const Default = Template.bind({})
Default.parameters = {
  layout: 'fullscreen',
  nextRouter: {
    path: '/products/[product]',
    asPath: PageLink.product({ locale: Locale.SvSe, slug: 'home' }),
    locale: Locale.SvSe,
  },
}
Default.args = {}
