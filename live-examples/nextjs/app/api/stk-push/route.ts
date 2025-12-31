import { NextRequest, NextResponse } from "next/server";

import { mpesa } from "@lib/mpesa";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, phone } = body;

    console.log("STK Push request:", { amount, phone });

    // Validate inputs
    if (!amount || !phone) {
      return NextResponse.json(
        { success: false, error: "Amount and phone are required" },
        { status: 400 },
      );
    }

    // Initialize M-Pesa (adjust based on your library)

    // Make STK Push request
    const response = await mpesa.client.stkPush({
      amount,
      phoneNumber: phone,
      accountReference: "TEST-001",
      transactionDesc: "Test payment",
    });

    console.log("M-Pesa response:", response);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("STK Push error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
