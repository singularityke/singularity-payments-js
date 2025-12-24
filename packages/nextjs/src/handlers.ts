import { MpesaClient } from "@singularity-payments/core";
import { NextRequest, NextResponse } from "next/server";
import { MpesaRouteHandlers } from "./types";

/**
 * Create Next.js route handlers for M-Pesa callbacks
 */
export function createMpesaHandlers(client: MpesaClient): MpesaRouteHandlers {
  const handlers = {
    stkCallback: {
      POST: async (request: NextRequest) => {
        try {
          const body = await request.json();
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

    c2bValidation: {
      POST: async (request: NextRequest) => {
        try {
          const body = await request.json();
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

    c2bConfirmation: {
      POST: async (request: NextRequest) => {
        try {
          const body = await request.json();
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
     * Catch-all handler for all M-Pesa webhooks
     * Routes based on URL path segment
     *
     * Usage: app/api/mpesa/[...mpesa]/route.ts
     * export const { POST } = mpesa.handlers.catchAll;
     */
    catchAll: {
      POST: async (request: NextRequest) => {
        const pathname = request.nextUrl.pathname;
        const segments = pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1];

        // Route to appropriate handler
        switch (lastSegment) {
          case "callback":
          case "stk-callback":
            return handlers.stkCallback.POST(request);

          case "validation":
          case "c2b-validation":
            return handlers.c2bValidation.POST(request);

          case "confirmation":
          case "c2b-confirmation":
            return handlers.c2bConfirmation.POST(request);

          default:
            return NextResponse.json(
              {
                ResultCode: 1,
                ResultDesc: `Unknown endpoint: ${lastSegment}`,
              },
              { status: 404 },
            );
        }
      },
    },
  };

  return handlers;
}
