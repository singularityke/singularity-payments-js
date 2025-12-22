import { MpesaConfig, MpesaPlugin } from "../types/config";
import { MpesaAuth } from "../utils/auth";
import {
  STKPushRequest,
  STKPushResponse,
  TransactionStatusRequest,
  TransactionStatusResponse,
  C2BRegisterRequest,
} from "../types/mpesa";

export class MpesaClient {
  private config: MpesaConfig;
  private auth: MpesaAuth;
  private plugins: MpesaPlugin[] = [];

  constructor(config: MpesaConfig) {
    this.config = config;
    this.auth = new MpesaAuth(config);
  }

  use(plugin: MpesaPlugin): this {
    this.plugins.push(plugin);
    plugin.init(this);
    return this;
  }

  async stkPush(request: STKPushRequest): Promise<STKPushResponse> {
    const token = await this.auth.getAccessToken();
    const baseUrl = this.auth.getBaseUrl();

    // Format phone number (remove + or leading 254, ensure it starts with 254)
    let phone = request.phoneNumber.replace(/[\s\-\+]/g, "");
    if (phone.startsWith("0")) {
      phone = "254" + phone.substring(1);
    } else if (!phone.startsWith("254")) {
      phone = "254" + phone;
    }

    const payload = {
      BusinessShortCode: this.config.shortcode,
      Password: this.auth.getPassword(),
      Timestamp: this.auth.getTimestamp(),
      TransactionType: "CustomerPayBillOnline",
      Amount: request.amount,
      PartyA: phone,
      PartyB: this.config.shortcode,
      PhoneNumber: phone,
      CallBackURL: request.callbackUrl || this.config.callbackUrl,
      AccountReference: request.accountReference,
      TransactionDesc: request.transactionDesc,
    };

    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`STK Push failed: ${error}`);
    }

    return (await response.json()) as STKPushResponse;
  }

  async stkQuery(
    request: TransactionStatusRequest,
  ): Promise<TransactionStatusResponse> {
    const token = await this.auth.getAccessToken();
    const baseUrl = this.auth.getBaseUrl();

    const payload = {
      BusinessShortCode: this.config.shortcode,
      Password: this.auth.getPassword(),
      Timestamp: this.auth.getTimestamp(),
      CheckoutRequestID: request.checkoutRequestID,
    };

    const response = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`STK Query failed: ${error}`);
    }

    return (await response.json()) as TransactionStatusResponse;
  }

  async registerC2BUrl(request: C2BRegisterRequest): Promise<any> {
    const token = await this.auth.getAccessToken();
    const baseUrl = this.auth.getBaseUrl();

    const payload = {
      ShortCode: request.shortCode,
      ResponseType: request.responseType,
      ConfirmationURL: request.confirmationURL,
      ValidationURL: request.validationURL,
    };

    const response = await fetch(`${baseUrl}/mpesa/c2b/v1/registerurl`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`C2B registration failed: ${error}`);
    }

    return await response.json();
  }

  getConfig(): MpesaConfig {
    return this.config;
  }
}
