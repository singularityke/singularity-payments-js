export type Environment = "sandbox" | "production";

export interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  environment: Environment;
  callbackUrl?: string;
  timeoutUrl?: string;
  resultUrl?: string;
}

export interface MpesaPlugin {
  name: string;
  init: (client: any) => void;
}
