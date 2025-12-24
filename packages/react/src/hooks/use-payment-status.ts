"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PaymentStatus, PaymentState } from "../types";
import { useMpesaConfig } from "../provider";

export interface UsePaymentStatusOptions {
  /**
   * Checkout request ID to poll
   */
  checkoutRequestId: string | null;

  /**
   * Start polling automatically
   * @default true
   */
  enabled?: boolean;

  /**
   * Called when payment succeeds
   */
  onSuccess?: (status: PaymentStatus) => void;

  /**
   * Called when payment fails
   */
  onFailure?: (status: PaymentStatus) => void;

  /**
   * Called when polling times out
   */
  onTimeout?: () => void;

  /**
   * Custom polling endpoint
   * @default "{baseUrl}/stk-query"
   */
  endpoint?: string;
}

/**
 * Hook for polling M-Pesa payment status
 *
 * @example
 * ```tsx
 * import { useMpesaPayment, usePaymentStatus } from "@singularity-payments/react";
 *
 * function Payment() {
 *   const { initiatePayment, checkoutRequestId } = useMpesaPayment();
 *
 *   const { status, isPolling } = usePaymentStatus({
 *     checkoutRequestId,
 *     onSuccess: (status) => {
 *       console.log("Payment confirmed!", status.mpesaReceiptNumber);
 *     }
 *   });
 *
 *   return (
 *     <div>
 *       {isPolling && <p>Waiting for payment...</p>}
 *       {status && <p>Status: {status.resultDescription}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePaymentStatus(options: UsePaymentStatusOptions) {
  const config = useMpesaConfig();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [state, setState] = useState<PaymentState>("idle");
  const [error, setError] = useState<Error | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const enabled = options.enabled !== false;

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const checkStatus = useCallback(async () => {
    if (!options.checkoutRequestId) return;

    const endpoint = options.endpoint || `${config.baseUrl}/stk-query`;
    const fetcher = config.fetcher || fetch;

    try {
      const response = await fetcher(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkoutRequestID: options.checkoutRequestId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const data: PaymentStatus = await response.json();
      setStatus(data);

      // Check if payment is complete
      if (data.resultCode === "0") {
        setState("success");
        stopPolling();
        options.onSuccess?.(data);
      } else if (data.resultCode && data.resultCode !== "0") {
        setState("failed");
        stopPolling();
        options.onFailure?.(data);
      }
      // If no resultCode yet, keep polling
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
    }
  }, [options, config, stopPolling]);

  useEffect(() => {
    if (!options.checkoutRequestId || !enabled) {
      return;
    }

    setState("polling");
    startTimeRef.current = Date.now();

    // Start polling
    pollIntervalRef.current = setInterval(() => {
      checkStatus();
    }, config.pollInterval || 3000);

    // Set timeout
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setState("cancelled");
      options.onTimeout?.();
    }, config.pollTimeout || 120000);

    // Initial check
    checkStatus();

    return () => {
      stopPolling();
    };
  }, [options.checkoutRequestId, enabled, checkStatus, stopPolling, config]);

  return {
    /**
     * Current payment status
     */
    status,

    /**
     * Current state
     */
    state,

    /**
     * Whether currently polling for status
     */
    isPolling: state === "polling",

    /**
     * Whether payment succeeded
     */
    isSuccess: state === "success",

    /**
     * Whether payment failed
     */
    isFailed: state === "failed",

    /**
     * Error if status check failed
     */
    error,

    /**
     * Manually stop polling
     */
    stopPolling,

    /**
     * Manually check status
     */
    checkStatus,
  };
}
