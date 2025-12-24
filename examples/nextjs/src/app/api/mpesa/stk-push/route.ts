import { NextRequest, NextResponse } from "next/server";
import { mpesa } from "~/lib/mpesa";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, phoneNumber, accountReference, transactionDesc } = body;

    // Validate input
    if (!amount || !phoneNumber) {
      return NextResponse.json(
        { error: "Amount and phone number are required" },
        { status: 400 },
      );
    }

    // Initiate STK Push
    const response = await mpesa.client.stkPush({
      amount: Number(amount),
      phoneNumber: String(phoneNumber),
      accountReference: accountReference || "Payment",
      transactionDesc: transactionDesc || "Payment",
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("STK Push error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate payment" },
      { status: 500 },
    );
  }
}
