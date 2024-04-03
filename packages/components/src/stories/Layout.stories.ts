import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Layout';

const meta = {
  title: 'Components/Layout',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CollapsingTabs: Story = {
  args: {
    routes: {
      name: 'Home',
      children: [
        {
          name: 'About',
          children: [
            {
              name: 'Team',
            },
            {
              name: 'Contact',
            },
          ],
        },
        {
          name: 'Services',
          children: [
            {
              name: 'For entrepreneurs',
            },
            {
              name: 'For students',
            },
          ],
        },
        {
          name: 'Case studies',
        },
      ],
    },
  },
};
