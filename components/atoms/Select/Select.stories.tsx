import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Select, SelectItem, SelectGroup, SelectSeparator } from './Select';

const meta = {
  title: 'Components/Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    children: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px', paddingBottom: '200px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args} placeholder="Choose class...">
      <SelectItem value="rustacean">Rustacean</SelectItem>
      <SelectItem value="typewitch">TypeWitch</SelectItem>
      <SelectItem value="gopher">Gopher</SelectItem>
      <SelectItem value="shell-sorcerer">Shell Sorcerer</SelectItem>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <Select {...args} label="CHARACTER CLASS" placeholder="Choose class...">
      <SelectItem value="rustacean">Rustacean</SelectItem>
      <SelectItem value="typewitch">TypeWitch</SelectItem>
      <SelectItem value="gopher">Gopher</SelectItem>
      <SelectItem value="shell-sorcerer">Shell Sorcerer</SelectItem>
    </Select>
  ),
};

export const WithSelection: Story = {
  render: (args) => (
    <Select {...args} label="CHARACTER CLASS" defaultValue="typewitch">
      <SelectItem value="rustacean">Rustacean</SelectItem>
      <SelectItem value="typewitch">TypeWitch</SelectItem>
      <SelectItem value="gopher">Gopher</SelectItem>
      <SelectItem value="shell-sorcerer">Shell Sorcerer</SelectItem>
    </Select>
  ),
};

export const Error: Story = {
  render: (args) => (
    <Select {...args} label="CHARACTER CLASS" variant="error" placeholder="Choose class...">
      <SelectItem value="rustacean">Rustacean</SelectItem>
      <SelectItem value="typewitch">TypeWitch</SelectItem>
      <SelectItem value="gopher">Gopher</SelectItem>
      <SelectItem value="shell-sorcerer">Shell Sorcerer</SelectItem>
    </Select>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Select {...args} label="CHARACTER CLASS" defaultValue="rustacean" disabled>
      <SelectItem value="rustacean">Rustacean</SelectItem>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: (args) => (
    <Select {...args} label="CHARACTER CLASS" placeholder="Choose class...">
      <SelectGroup label="Melee">
        <SelectItem value="barbarian">Barbarian</SelectItem>
        <SelectItem value="paladin">Paladin</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup label="Ranged">
        <SelectItem value="ranger">Ranger</SelectItem>
        <SelectItem value="rogue">Rogue</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup label="Magic">
        <SelectItem value="typewitch">TypeWitch</SelectItem>
        <SelectItem value="shell-sorcerer">Shell Sorcerer</SelectItem>
      </SelectGroup>
    </Select>
  ),
};

export const WithDisabledItem: Story = {
  render: (args) => (
    <Select {...args} label="CHARACTER CLASS" placeholder="Choose class...">
      <SelectItem value="rustacean">Rustacean</SelectItem>
      <SelectItem value="typewitch">TypeWitch</SelectItem>
      <SelectItem value="gopher" disabled>
        Gopher (locked)
      </SelectItem>
      <SelectItem value="shell-sorcerer">Shell Sorcerer</SelectItem>
    </Select>
  ),
};
