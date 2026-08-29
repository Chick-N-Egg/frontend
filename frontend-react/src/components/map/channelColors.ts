import type { ChannelType } from '../../api/types';

// Ported from map.html's PLATFORM_COLORS, extended with `company`/`individual`
// (new enum values that didn't exist in the old Startup/community model).
export const CHANNEL_COLORS: Record<ChannelType, string> = {
  reddit: '#8f5fd1',
  discord: '#5b7fd1',
  slack: '#b06fc9',
  facebook_group: '#6a6fc4',
  linkedin: '#5f8fc9',
  forum: '#9b7fd6',
  newsletter: '#7a5fb0',
  meetup: '#c470a8',
  twitter: '#4a4a68',
  company: '#3d3358',
  individual: '#c4401a',
};

export const CHANNEL_LABELS: Record<ChannelType, string> = {
  reddit: 'Reddit',
  discord: 'Discord',
  slack: 'Slack',
  facebook_group: 'Facebook Group',
  linkedin: 'LinkedIn',
  forum: 'Forum',
  newsletter: 'Newsletter',
  meetup: 'Meetup',
  twitter: 'Twitter/X',
  company: 'Company',
  individual: 'Individual',
};
