"use client";

import { useState, useCallback } from "react";
import { PaymentRequest, PaymentResponse, PaymentState } from "../types";
import { useMpesaConfig } from "../provider";

export interface UseMpesaPaymentOptions {
  /**
   * Called when payment is successfully initiated
   */
  onInitiated?: (response: PaymentResponse) => void;

  /**
   * Called when payment is completed successfully
   */
  onSuccess?: (data: any) => void;

  /**
   * Called when payment fails or is cancelled
   */
  onError?: (error: Error) => void;

  /**
   * Custom API endpoint for initiating payment
   * @default "{baseUrl}/stk-push"
   */
  endpoint?: string;

  /**
   * Automatically poll for payment status after initiation
   * @default true
   */
  autoPoll?: boolean;
}

/**
 * Hook for initiating M-Pesa STK Push payments
 *
 * @example
 * ```tsx
 * import { useMpesaPayment } from "@singularity-payments/react";
 *
 * function PaymentButton() {
 *   const { initiatePayment, state, error, data } = useMpesaPayment({
 *     onSuccess: (data) => console.log("Payment successful!", data),
 *     onError: (error) => console.error("Payment failed:", error)
 *   });
 *
 *   const handlePay = () => {
 *     initiatePayment({
 *       amount: 100,
 *       phoneNumber: "254712345678",
 *       accountReference: "ORDER123",
 *       transactionDesc: "Payment for order"
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handlePay} disabled={state !== "idle"}>
 *       {state === "initiating" ? "Initiating..." :
 *        state === "pending" ? "Check your phone..." :
 *        "Pay with M-Pesa"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useMpesaPayment(options: UseMpesaPaymentOptions = {}) {
  const config = useMpesaConfig();
  const [state, setState] = useState<PaymentState>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<PaymentResponse | null>(null);
  const [CheckoutRequestID, setCheckoutRequestID] = useState<string | null>(
    null,
  );

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
    setData(null);
    setCheckoutRequestID(null);
  }, []);

  const initiatePayment = useCallback(
    async (request: PaymentRequest) => {
      setState("initiating");
      setError(null);

      const endpoint = options.endpoint || `${config.baseUrl}/stk-push`;
      const fetcher = config.fetcher || fetch;

      try {
        const response = await fetcher(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || errorData.message || "Payment initiation failed",
          );
        }

        const responseData: PaymentResponse = await response.json();
        setData(responseData);
        setCheckoutRequestID(responseData.CheckoutRequestID);
        setState("pending");

        options.onInitiated?.(responseData);

        return responseData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        setState("failed");
        options.onError?.(error);
        throw error;
      }
    },
    [config, options],
  );

  return {
    /**
     * Initiate an M-Pesa payment
     */
    initiatePayment,

    /**
     * Current payment state
     */
    state,

    /**
     * Whether payment is being initiated
     */
    isInitiating: state === "initiating",

    /**
     * Whether payment is pending user action
     */
    isPending: state === "pending",

    /**
     * Whether any async operation is in progress
     */
    isLoading: state === "initiating" || state === "polling",

    /**
     * Error if payment failed
     */
    error,

    /**
     * Payment response data
     */
    data,

    /**
     * Checkout request ID for status polling
     */
    CheckoutRequestID,

    /**
     * Reset the payment state
     */
    reset,
  };
}
