import { createMpesa } from "@singularity-payments/nextjs";

export const mpesa = createMpesa(
  {
    consumerKey: process.env.MPESA_CONSUMER_KEY!,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
    passkey: process.env.MPESA_PASSKEY!,
    shortcode: process.env.MPESA_SHORTCODE!,
    environment:
      (process.env.MPESA_ENVIRONMENT as "sandbox" | "production") || "sandbox",
    callbackUrl: `https://sliverlike-unpredaceously-ariana.ngrok-free.dev/api/mpesa/callback`,
  },
  {
    callbackOptions: {
      onSuccess: async (data) => {
        console.log("✅ Payment successful:", {
          amount: data.amount,
          phone: data.phoneNumber,
          receipt: data.mpesaReceiptNumber,
          transactionDate: data.transactionDate,
        });

        // TODO: Save to database
        // await db.transaction.update({
        //   where: { CheckoutRequestID: data.CheckoutRequestID },
        //   data: { status: 'completed', mpesaReceiptNumber: data.mpesaReceiptNumber }
        // });
      },
      onFailure: async (data) => {
        console.log("❌ Payment failed:", {
          resultCode: data.resultCode,
          resultDesc: data.resultDescription,
        });

        // TODO: Update database
      },
    },
  },
);
