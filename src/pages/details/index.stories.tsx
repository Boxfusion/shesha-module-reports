import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoryApp } from 'components/app';
import { ReportDetailsPage } from './';

// // More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Pages/Details',
  component: ReportDetailsPage,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ReportDetailsPage>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const ReportDetailsTemplate: ComponentStory<typeof ReportDetailsPage> = (args) => (
  <StoryApp>
    <ReportDetailsPage {...args} />;
  </StoryApp>
);

export const Primary = ReportDetailsTemplate.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = { id: 'da6cdd49-ab32-4eb8-9719-c853f89af79c' };
