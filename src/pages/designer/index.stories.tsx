import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoryApp } from 'components/app';
import { ReportDesignerPage } from './';

// // More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Pages/DesignerPage',
  component: ReportDesignerPage,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ReportDesignerPage>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ReportDesignerPage> = (args) => (
  <StoryApp>
    <ReportDesignerPage {...args} />;
  </StoryApp>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  id: 'a2d7c930-7a62-4b06-9fb4-28a28a9adc4b',
};
