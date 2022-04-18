export interface BlockConfig {
  blockStyle?: object;
  blockClassName?: string;
}

export interface PersonConfig {
  name?: string;
  summary?: string;
  avatarUrl?: string;
  avatarShape?: "circle" | "rect";
}

export interface MainBlockConfig extends BlockConfig, PersonConfig {}

export interface ResumeOptions {
  highlight?: () => string;
}

export type Fetch = (url: string) => any;
