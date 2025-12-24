import { STKPushRequest } from "@singularity-payments/core";

export interface MpesaConfig {
  /**
   * Base URL for your API endpoints
   * @default "/api/mpesa"
   */
  baseUrl?: string;

  /**
   * Custom fetch function for making requests
   */
  fetcher?: typeof fetch;

  /**
   * Polling interval for payment status checks (ms)
   * @default 3000
   */
  pollInterval?: number;

  /**
   * Maximum polling duration (ms)
   * @default 120000 (2 minutes)
   */
  pollTimeout?: number;
}

export interface PaymentRequest extends Omit<STKPushRequest, "callbackUrl"> {
  // Additional client-side fields if needed
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  merchantRequestId: string;
  checkoutRequestId: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
}

export interface PaymentStatus {
  checkoutRequestId: string;
  merchantRequestId: string;
  resultCode: string;
  resultDescription: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
}

export type PaymentState =
  | "idle"
  | "initiating"
  | "pending"
  | "polling"
  | "success"
  | "failed"
  | "cancelled";
