import { MpesaConfig, MpesaPlugin } from "../types/config";
import { MpesaAuth } from "../utils/auth";
import {
  MpesaCallbackHandler,
  CallbackHandlerOptions,
  ParsedCallbackData,
  ParsedC2BCallback,
} from "../utils/callback";
import {
  STKPushRequest,
  STKPushResponse,
  TransactionStatusRequest,
  TransactionStatusResponse,
  C2BRegisterRequest,
  C2BRegisterResponse,
  STKCallback,
  C2BCallback,
} from "../types/mpesa";

export class MpesaClient {
  private config: MpesaConfig;
  private auth: MpesaAuth;
  private plugins: MpesaPlugin[] = [];
  private callbackHandler: MpesaCallbackHandler;

  constructor(config: MpesaConfig, callbackOptions?: CallbackHandlerOptions) {
    this.config = config;
    this.auth = new MpesaAuth(config);
    this.callbackHandler = new MpesaCallbackHandler(callbackOptions);
  }

  /**
   * Add a plugin to extend functionality
   */
  use(plugin: MpesaPlugin): this {
    this.plugins.push(plugin);
    plugin.init(this);
    return this;
  }

  /**
   * Initiate STK Push (Lipa Na M-Pesa Online)
   */
  async stkPush(request: STKPushRequest): Promise<STKPushResponse> {
    const token = await this.auth.getAccessToken();
    const baseUrl = this.auth.getBaseUrl();

    // Format phone number
    let phone = request.phoneNumber.replace(/[\s\-\+]/g, "");
    if (phone.startsWith("0")) {
      phone = "254" + phone.substring(1);
    } else if (!phone.startsWith("254")) {
      phone = "254" + phone;
    }

    // Validate amount
    if (request.amount < 1) {
      throw new Error("Amount must be at least 1 KES");
    }

    const payload = {
      BusinessShortCode: this.config.shortcode,
      Password: this.auth.getPassword(),
      Timestamp: this.auth.getTimestamp(),
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.floor(request.amount),
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

  /**
   * Query STK Push transaction status
   */
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

  /**
   * Register C2B URLs for validation and confirmation
   */
  async registerC2BUrl(
    request: C2BRegisterRequest,
  ): Promise<C2BRegisterResponse> {
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

    return (await response.json()) as C2BRegisterResponse;
  }

  /**
   * Get the callback handler instance
   */
  getCallbackHandler(): MpesaCallbackHandler {
    return this.callbackHandler;
  }

  /**
   * Handle an incoming STK Push callback
   * Returns M-Pesa compliant response
   */
  async handleSTKCallback(
    callback: STKCallback,
    ipAddress?: string,
  ): Promise<object> {
    try {
      await this.callbackHandler.handleCallback(callback, ipAddress);
      return this.callbackHandler.createCallbackResponse(true);
    } catch (error) {
      console.error("STK Callback handling error:", error);
      return this.callbackHandler.createCallbackResponse(
        false,
        "Internal error",
      );
    }
  }

  /**
   * Handle C2B validation request
   */
  async handleC2BValidation(callback: C2BCallback): Promise<object> {
    try {
      const isValid = await this.callbackHandler.handleC2BValidation(callback);
      return this.callbackHandler.createCallbackResponse(
        isValid,
        isValid ? "Accepted" : "Rejected",
      );
    } catch (error) {
      console.error("C2B Validation error:", error);
      return this.callbackHandler.createCallbackResponse(
        false,
        "Validation failed",
      );
    }
  }

  /**
   * Handle C2B confirmation
   */
  async handleC2BConfirmation(callback: C2BCallback): Promise<object> {
    try {
      await this.callbackHandler.handleC2BConfirmation(callback);
      return this.callbackHandler.createCallbackResponse(true);
    } catch (error) {
      console.error("C2B Confirmation error:", error);
      return this.callbackHandler.createCallbackResponse(
        false,
        "Processing failed",
      );
    }
  }

  /**
   * Parse STK callback without handling (for testing)
   */
  parseSTKCallback(callback: STKCallback): ParsedCallbackData {
    return this.callbackHandler.parseCallback(callback);
  }

  /**
   * Parse C2B callback without handling ( for testing)
   */
  parseC2BCallback(callback: C2BCallback): ParsedC2BCallback {
    return this.callbackHandler.parseC2BCallback(callback);
  }

  /**
   * Get configuration (I want this for plugins)
   */
  getConfig(): MpesaConfig {
    return this.config;
  }
}
