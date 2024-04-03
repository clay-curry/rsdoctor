import type { Meta, StoryObj } from '@storybook/react';
import { UncoupledHeader as Header } from './Header';
import { Children } from 'react';

const meta = {
  title: 'Components/Header',
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

export const English: Story = {
  args: {
    preferredLanguage: 'en',
    navigationRoutes: {
      name: '/',
      children: [
        {
          name: 'Overall',
        },
        {
          name: 'Compile Analysis',
          children: [
            {
              name: 'Loaders Analysis',
              children: [
                {
                  name: 'Loaders Timeline',
                },
                {
                  name: 'Loaders Analysis',
                },
              ],
            },
            {
              name: 'Module Resolve',
            },
            {
              name: 'Plugins Analysis',
            },
          ],
        },
        {
          name: 'Bundle Size',
          children: [
            {
              name: 'Bundle Size',
            },
          ],
        },
      ],
    },
  },
};

export const Chinese: Story = {
  args: {
    preferredLanguage: 'zh',
    navigationRoutes: {
      name: '/',

      // TODO: translate to zh
      children: [
        {
          name: 'Overall',
        },
        {
          name: 'Compile Analysis',
          children: [
            {
              name: 'Loaders Analysis',
              children: [
                {
                  name: 'Loaders Timeline',
                },
                {
                  name: 'Loaders Analysis',
                },
              ],
            },
            {
              name: 'Module Resolve',
            },
            {
              name: 'Plugins Analysis',
            },
          ],
        },
        {
          name: 'Bundle Size',
          children: [
            {
              name: 'Bundle Size',
            },
          ],
        },
      ],
    },
  },
};
