/**
 * PRODUCT_SPEC.md defines channel_type as: discord | reddit | facebook_group |
 * company | individual. The reused static catalog (backend/communities.json)
 * covers more platforms than that (Slack, LinkedIn, Twitter/X, Newsletter,
 * Meetup, Forum), so the enum is extended to a superset rather than forcing
 * a lossy mapping onto 5 values. `company`/`individual` are kept for results
 * OpenAI surfaces outside the static catalog (no company/individual data
 * exists in communities.json).
 */
export enum ChannelType {
  DISCORD = 'discord',
  REDDIT = 'reddit',
  FACEBOOK_GROUP = 'facebook_group',
  SLACK = 'slack',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  NEWSLETTER = 'newsletter',
  MEETUP = 'meetup',
  FORUM = 'forum',
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
}

const PLATFORM_TO_CHANNEL_TYPE: Record<string, ChannelType> = {
  discord: ChannelType.DISCORD,
  reddit: ChannelType.REDDIT,
  facebook: ChannelType.FACEBOOK_GROUP,
  slack: ChannelType.SLACK,
  linkedin: ChannelType.LINKEDIN,
  'twitter/x': ChannelType.TWITTER,
  twitter: ChannelType.TWITTER,
  newsletter: ChannelType.NEWSLETTER,
  meetup: ChannelType.MEETUP,
  forum: ChannelType.FORUM,
};

export function channelTypeFromPlatform(platform: string): ChannelType {
  return PLATFORM_TO_CHANNEL_TYPE[platform.toLowerCase()] ?? ChannelType.FORUM;
}
