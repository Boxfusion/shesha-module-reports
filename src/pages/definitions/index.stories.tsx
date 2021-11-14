import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoryApp } from 'components/app';
import { ReportsDefinitionsPage } from './';

// // More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Pages/Definitions',
  component: ReportsDefinitionsPage,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ReportsDefinitionsPage>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ReportsDefinitionsPage> = (args) => (
  <StoryApp>
    <ReportsDefinitionsPage {...args} />;
  </StoryApp>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  reportViewerPageUrl: '/?path=/story/pages-viewer--primary',
};
