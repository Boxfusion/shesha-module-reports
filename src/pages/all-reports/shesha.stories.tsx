import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CollapsiblePanel } from 'shesha-reactjs';
// import AllReportsPage from './';

// // More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Pages/CollapsiblePanel',
  component: CollapsiblePanel,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CollapsiblePanel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CollapsiblePanel> = (args) => (
  <CollapsiblePanel {...args}>
    <div>This is a CollapsiblePanel from Shesha</div>
  </CollapsiblePanel>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {};
// // More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// export default {
//   title: 'Pages/AllReports',
//   component: AllReportsPage,
//   // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
// } as ComponentMeta<typeof AllReportsPage>;

// // More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// const Template: ComponentStory<typeof AllReportsPage> = (args) => <AllReportsPage {...args} />;

// export const Primary = Template.bind({});
// // More on args: https://storybook.js.org/docs/react/writing-stories/args
// Primary.args = {};
