import { STKCallback, CallbackMetadata } from "../types/mpesa";

export interface ParsedCallbackData {
  merchantRequestId: string;
  checkoutRequestId: string;
  resultCode: number;
  resultDescription: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
}

export interface CallbackHandlerOptions {
  onSuccess?: (data: ParsedCallbackData) => void | Promise<void>;
  onFailure?: (data: ParsedCallbackData) => void | Promise<void>;
  onCallback?: (data: ParsedCallbackData) => void | Promise<void>;
  validateIp?: boolean;
  allowedIps?: string[];
}

export class MpesaCallbackHandler {
  private options: CallbackHandlerOptions;

  // Safaricom IPs from Daraja website, we should verify these periodically - https://developer.safaricom.co.ke/dashboard/apis?api=GettingStarted
  private readonly SAFARICOM_IPS = [
    "196.201.214.200",
    "196.201.214.206",
    "196.201.213.114",
    "196.201.214.207",
    "196.201.214.208",
    "196.201.213.44",
    "196.201.212.127",
    "196.201.212.138",
    "196.201.212.129",
    "196.201.212.136",
    "196.201.212.74",
    "196.201.212.69",
  ];

  constructor(options: CallbackHandlerOptions = {}) {
    this.options = {
      validateIp: true,
      allowedIps: this.SAFARICOM_IPS,
      ...options,
    };
  }

  /**
   * Validate that the callback is from a Safaricom IP
   */
  validateCallbackIp(ipAddress: string): boolean {
    if (!this.options.validateIp) {
      return true;
    }

    const allowedIps = this.options.allowedIps || this.SAFARICOM_IPS;
    return allowedIps.includes(ipAddress);
  }

  /**
   * Parse the callback data from M-Pesa
   */
  parseCallback(callback: STKCallback): ParsedCallbackData {
    const stkCallback = callback.Body.stkCallback;

    const parsed: ParsedCallbackData = {
      merchantRequestId: stkCallback.MerchantRequestID,
      checkoutRequestId: stkCallback.CheckoutRequestID,
      resultCode: stkCallback.ResultCode,
      resultDescription: stkCallback.ResultDesc,
    };

    // If transaction was successful, parse metadata
    if (stkCallback.ResultCode === 0 && stkCallback.CallbackMetadata) {
      const metadata = this.extractMetadata(stkCallback.CallbackMetadata);
      Object.assign(parsed, metadata);
    }

    return parsed;
  }

  /**
   * Extract metadata from callback
   */
  private extractMetadata(
    metadata: CallbackMetadata,
  ): Partial<ParsedCallbackData> {
    const result: Partial<ParsedCallbackData> = {};

    metadata.Item.forEach((item) => {
      switch (item.Name) {
        case "Amount":
          result.amount = Number(item.Value);
          break;
        case "MpesaReceiptNumber":
          result.mpesaReceiptNumber = String(item.Value);
          break;
        case "TransactionDate":
          result.transactionDate = String(item.Value);
          break;
        case "PhoneNumber":
          result.phoneNumber = String(item.Value);
          break;
      }
    });

    return result;
  }

  /**
   * Check if callback indicates success
   */
  isSuccess(data: ParsedCallbackData): boolean {
    return data.resultCode === 0;
  }

  /**
   * Check if callback indicates failure
   */
  isFailure(data: ParsedCallbackData): boolean {
    return data.resultCode !== 0;
  }

  /**
   * Get more readable error message based on result code
   */
  getErrorMessage(resultCode: number): string {
    const errorMessages: Record<number, string> = {
      0: "Success",
      1: "Insufficient funds",
      17: "User cancelled transaction",
      26: "System internal error",
      1001: "Unable to lock subscriber, a transaction is already in process",
      1019: "Transaction expired. No response from user",
      1032: "Request cancelled by user",
      1037: "Timeout in sending PIN",
      2001: "Wrong PIN entered",
      9999: "Request cancelled",
    };

    return (
      errorMessages[resultCode] || `Transaction failed with code: ${resultCode}`
    );
  }

  /**
   * Handle the callback and invoke appropriate handlers
   */
  async handleCallback(
    callback: STKCallback,
    ipAddress?: string,
  ): Promise<void> {
    // Validate IP if provided
    if (ipAddress && !this.validateCallbackIp(ipAddress)) {
      throw new Error(`Invalid callback IP: ${ipAddress}`);
    }

    // Parse the callback
    const parsed = this.parseCallback(callback);

    // Call the general callback handler if provided
    if (this.options.onCallback) {
      await this.options.onCallback(parsed);
    }

    // Call specific handlers based on success or failure
    if (this.isSuccess(parsed) && this.options.onSuccess) {
      await this.options.onSuccess(parsed);
    } else if (this.isFailure(parsed) && this.options.onFailure) {
      await this.options.onFailure(parsed);
    }
  }

  /**
   * Create a standard callback response for m-pesa
   */
  createCallbackResponse(success: boolean = true): object {
    return {
      ResultCode: success ? 0 : 1,
      ResultDesc: success ? "Accepted" : "Rejected",
    };
  }
}
