import { NextRequest, NextResponse } from "next/server";
import { mpesa } from "~/lib/mpesa";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { CheckoutRequestID } = body;

    if (!CheckoutRequestID) {
      return NextResponse.json(
        { error: "CheckoutRequestID is required" },
        { status: 400 },
      );
    }

    const response = await mpesa.client.stkQuery({ CheckoutRequestID });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("STK Query error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to query payment status" },
      { status: 500 },
    );
  }
}
