export interface BlockConfig {
  theme?: string;
  blockStyle?: object;
  blockClassName?: string;
}

export interface AvatarConfig {
  avatar?: string;
  avatarShape?: "circle" | "rect";
  avatarStyle?: string;
  avatarClassName?: string;
}

export interface GlobalConfig extends BlockConfig, AvatarConfig {}

export interface ResumeOptions {
  highlight?: () => string;
}
