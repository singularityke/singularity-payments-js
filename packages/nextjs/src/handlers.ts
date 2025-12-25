import {
  MpesaClient,
  type STKCallback,
  type C2BCallback,
} from "@singularity-payments/core";
import { NextRequest, NextResponse } from "next/server";
import type { MpesaRouteHandlers } from "./types";

/**
 * Create Next.js route handlers for M-Pesa callbacks
 */
export function createMpesaHandlers(client: MpesaClient): MpesaRouteHandlers {
  const handlers = {
    /**
     * STK Push callback handler
     * Handles callbacks from M-Pesa after STK Push requests
     */
    stkCallback: {
      POST: async (request: NextRequest) => {
        try {
          const body = (await request.json()) as STKCallback;
          const ipAddress =
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            undefined;
          const response = await client.handleSTKCallback(body, ipAddress);
          return NextResponse.json(response, { status: 200 });
        } catch (error: any) {
          console.error("STK Callback error:", error);
          return NextResponse.json(
            {
              ResultCode: 1,
              ResultDesc: "Internal error processing callback",
            },
            { status: 200 },
          );
        }
      },
    },
    /**
     * C2B validation handler
     * Validates C2B transactions before they are processed
     */
    c2bValidation: {
      POST: async (request: NextRequest) => {
        try {
          const body = (await request.json()) as C2BCallback;
          const response = await client.handleC2BValidation(body);
          return NextResponse.json(response, { status: 200 });
        } catch (error: any) {
          console.error("C2B Validation error:", error);
          return NextResponse.json(
            {
              ResultCode: 1,
              ResultDesc: "Validation failed",
            },
            { status: 200 },
          );
        }
      },
    },
    /**
     * C2B confirmation handler
     * Confirms C2B transactions after they are processed
     */
    c2bConfirmation: {
      POST: async (request: NextRequest) => {
        try {
          const body = (await request.json()) as C2BCallback;
          const response = await client.handleC2BConfirmation(body);
          return NextResponse.json(response, { status: 200 });
        } catch (error: any) {
          console.error("C2B Confirmation error:", error);
          return NextResponse.json(
            {
              ResultCode: 1,
              ResultDesc: "Processing failed",
            },
            { status: 200 },
          );
        }
      },
    },
    /**
     * Catch-all handler for all M-Pesa webhooks and API requests
     * Routes based on URL path segment
     *
     * Usage: app/api/mpesa/[...mpesa]/route.ts
     * export const { POST } = mpesa.handlers.catchAll;
     *
     * Supported endpoints:
     * - /api/mpesa/callback or /api/mpesa/stk-callback - STK Push callbacks
     * - /api/mpesa/validation or /api/mpesa/c2b-validation - C2B validation
     * - /api/mpesa/confirmation or /api/mpesa/c2b-confirmation - C2B confirmation
     * - /api/mpesa/stk-push - Initiate STK Push request
     * - /api/mpesa/stk-query - Query STK Push status
     */
    catchAll: {
      POST: async (request: NextRequest) => {
        const pathname = request.nextUrl.pathname;
        const segments = pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1];

        try {
          // Route to appropriate handler based on URL segment
          switch (lastSegment) {
            // STK Push callback from M-Pesa
            case "callback":
            case "stk-callback":
              return handlers.stkCallback.POST(request);

            // C2B validation callback from M-Pesa
            case "validation":
            case "c2b-validation":
              return handlers.c2bValidation.POST(request);

            // C2B confirmation callback from M-Pesa
            case "confirmation":
            case "c2b-confirmation":
              return handlers.c2bConfirmation.POST(request);

            // Initiate STK Push request to M-Pesa
            case "stk-push": {
              const body = (await request.json()) as {
                amount?: number;
                phoneNumber?: string;
                accountReference?: string;
                transactionDesc?: string;
              };
              const { amount, phoneNumber, accountReference, transactionDesc } =
                body;

              // Validate required fields
              if (!amount || !phoneNumber) {
                return NextResponse.json(
                  { error: "Amount and phone number are required" },
                  { status: 400 },
                );
              }

              // Call M-Pesa STK Push API
              const response = await client.stkPush({
                amount: Number(amount),
                phoneNumber: String(phoneNumber),
                accountReference: accountReference || "Payment",
                transactionDesc: transactionDesc || "Payment",
              });

              return NextResponse.json(response);
            }

            // Query STK Push transaction status
            case "stk-query": {
              const body = (await request.json()) as {
                CheckoutRequestID?: string;
              };
              const { CheckoutRequestID } = body;

              // Validate required field
              if (!CheckoutRequestID) {
                return NextResponse.json(
                  { error: "CheckoutRequestID is required" },
                  { status: 400 },
                );
              }

              // Call M-Pesa STK Query API
              const response = await client.stkQuery({ CheckoutRequestID });
              return NextResponse.json(response);
            }

            // Unknown endpoint
            default:
              return NextResponse.json(
                {
                  ResultCode: 1,
                  ResultDesc: `Unknown endpoint: ${lastSegment}`,
                },
                { status: 404 },
              );
          }
        } catch (error: any) {
          console.error(`M-Pesa ${lastSegment} error:`, error);
          return NextResponse.json(
            { error: error.message || "Request failed" },
            { status: 500 },
          );
        }
      },
    },
  };

  return handlers;
}
