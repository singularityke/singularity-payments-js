import { MpesaConfig } from "../types/config";

const ENDPOINTS = {
  sandbox: "https://sandbox.safaricom.co.ke",
  production: "https://api.safaricom.co.ke",
};

interface TokenResponse {
  access_token: string;
  expires_in: string;
}

export class MpesaAuth {
  private config: MpesaConfig;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: MpesaConfig) {
    this.config = config;
  }

  async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    const baseUrl = ENDPOINTS[this.config.environment];
    const auth = Buffer.from(
      `${this.config.consumerKey}:${this.config.consumerSecret}`,
    ).toString("base64");

    const response = await fetch(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = (await response.json()) as TokenResponse;

    if (!data.access_token) {
      throw new Error("No access token in response");
    }

    this.token = data.access_token;
    // Token expires in 1 hour, cache for 50 minutes to be safe
    this.tokenExpiry = Date.now() + 50 * 60 * 1000;

    return this.token;
  }

  getBaseUrl(): string {
    return ENDPOINTS[this.config.environment];
  }

  getPassword(): string {
    const timestamp = this.getTimestamp();
    const password = Buffer.from(
      `${this.config.shortcode}${this.config.passkey}${timestamp}`,
    ).toString("base64");
    return password;
  }

  getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}
