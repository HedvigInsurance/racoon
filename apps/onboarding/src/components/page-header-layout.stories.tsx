import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PageHeaderLayout } from './page-header-layout';

export default {
  title: 'Onboarding / PageHeaderLayout',
  component: PageHeaderLayout,
} as ComponentMeta<typeof PageHeaderLayout>;

const Template: ComponentStory<typeof PageHeaderLayout> = (args) => <PageHeaderLayout {...args} />;

export const Default = Template.bind({})
