"use client";

import { useState } from "react";
import { useMpesaPayment, usePaymentStatus } from "@singularity-payments/react";

export function PaymentForm() {
  const [amount, setAmount] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("2547123456789");

  const {
    initiatePayment,
    state,
    CheckoutRequestID,
    error: paymentError,
    reset,
  } = useMpesaPayment({
    onInitiated: (data) => {
      console.log("Payment initiated:", data);
    },
  });

  const { status, isPolling, isSuccess, isFailed } = usePaymentStatus({
    CheckoutRequestID,
    onSuccess: (status) => {
      console.log("Payment confirmed!", status);
    },
    onFailure: (status) => {
      console.log("Payment failed:", status);
    },
    onTimeout: () => {
      console.log("Payment timed out");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await initiatePayment({
        amount: Number(amount),
        phoneNumber,
        accountReference: "TEST123",
        transactionDesc: "Test Payment",
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  const handleReset = () => {
    reset();
    setAmount("1");
    setPhoneNumber("2547123456789");
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">M-Pesa Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Amount (KES)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
            disabled={state !== "idle"}
            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="254712345678"
            required
            disabled={state !== "idle"}
            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={state !== "idle"}
          className="w-full rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {state === "initiating" && "Initiating Payment..."}
          {state === "pending" && "Check Your Phone..."}
          {isPolling && "Processing Payment..."}
          {state === "idle" && "Pay with M-Pesa"}
        </button>
      </form>

      {/* Status Display */}
      <div className="mt-6 space-y-2">
        {CheckoutRequestID && (
          <div className="text-xs text-gray-600">
            Request ID: {CheckoutRequestID}
          </div>
        )}

        {paymentError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-800">{paymentError.message}</p>
          </div>
        )}

        {isSuccess && status && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4">
            <h3 className="mb-2 font-semibold text-green-800">
              ✅ Payment Successful!
            </h3>
            <div className="space-y-1 text-sm text-green-700">
              <p> {status.ResultDesc}</p>
            </div>
          </div>
        )}

        {isFailed && status && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <h3 className="mb-2 font-semibold text-red-800">
              ❌ Payment Failed
            </h3>
            <p className="text-sm text-red-700">{status.ResultDesc}</p>
          </div>
        )}

        {(isSuccess || isFailed) && (
          <button
            onClick={handleReset}
            className="mt-4 w-full rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
          >
            Make Another Payment
          </button>
        )}
      </div>
    </div>
  );
}
