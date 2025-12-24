"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PaymentStatus, PaymentState } from "../types";
import { useMpesaConfig } from "../provider";

export interface UsePaymentStatusOptions {
  CheckoutRequestID: string | null;
  enabled?: boolean;
  onSuccess?: (status: PaymentStatus) => void;
  onFailure?: (status: PaymentStatus) => void;
  onTimeout?: () => void;
  endpoint?: string;
}

export function usePaymentStatus(options: UsePaymentStatusOptions) {
  const config = useMpesaConfig();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [state, setState] = useState<PaymentState>("idle");
  const [error, setError] = useState<Error | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef<number>(0);
  const maxPollsRef = useRef<number>(40);

  const enabled = options.enabled !== false;

  const onSuccessRef = useRef(options.onSuccess);
  const onFailureRef = useRef(options.onFailure);
  const onTimeoutRef = useRef(options.onTimeout);

  useEffect(() => {
    onSuccessRef.current = options.onSuccess;
    onFailureRef.current = options.onFailure;
    onTimeoutRef.current = options.onTimeout;
  }, [options.onSuccess, options.onFailure, options.onTimeout]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    pollCountRef.current = 0;
  }, []);

  const checkStatus = useCallback(async () => {
    if (!options.CheckoutRequestID) return;

    pollCountRef.current += 1;
    if (pollCountRef.current > maxPollsRef.current) {
      console.warn("Max polling attempts reached, stopping polls");
      stopPolling();
      setState("cancelled");
      onTimeoutRef.current?.();
      return;
    }

    const endpoint = options.endpoint || `${config.baseUrl}/stk-query`;
    const fetcher = config.fetcher || fetch;

    try {
      const response = await fetcher(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CheckoutRequestID: options.CheckoutRequestID,
        }),
      });

      if (!response.ok) {
        console.error("Status check failed:", response.status);
        return;
      }

      const data: PaymentStatus = await response.json();

      setStatus(data);

      const ResultCode = data.ResultCode?.toString();

      if (ResultCode === "0") {
        setState("success");
        stopPolling();
        onSuccessRef.current?.(data);
      } else if (ResultCode && ResultCode !== "4999") {
        setState("failed");
        stopPolling();
        onFailureRef.current?.(data);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      console.error("Error checking status:", error);
    }
  }, [
    options.CheckoutRequestID,
    options.endpoint,
    config.baseUrl,
    config.fetcher,
    stopPolling,
  ]);

  useEffect(() => {
    if (!options.CheckoutRequestID || !enabled) {
      return;
    }

    setState("polling");
    pollCountRef.current = 0;

    checkStatus();

    pollIntervalRef.current = setInterval(() => {
      checkStatus();
    }, config.pollInterval || 3000);

    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setState("cancelled");
      onTimeoutRef.current?.();
    }, config.pollTimeout || 120000);

    return () => {
      stopPolling();
    };
  }, [
    options.CheckoutRequestID,
    enabled,
    checkStatus,
    stopPolling,
    config.pollInterval,
    config.pollTimeout,
  ]);

  return {
    status,
    state,
    isPolling: state === "polling",
    isSuccess: state === "success",
    isFailed: state === "failed",
    error,
    stopPolling,
    checkStatus,
  };
}
