export type Environment = "sandbox" | "production";
export interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortCode: string;
  environment: Environment;
  callbackUrl?: string;
  timeoutUrl?: string;
  resultUrl?: string;
}
export interface MpesaPlugin {
  name: string;
  init: (config: MpesaConfig) => void;
}
