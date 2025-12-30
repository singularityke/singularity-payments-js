import { createMpesa } from "@singularity-payments/nuxt";

const config = useRuntimeConfig();

export const mpesa = createMpesa(
  {
    consumerKey: config.mpesaConsumerKey,
    consumerSecret: config.mpesaConsumerSecret,
    passkey: config.mpesaPasskey,
    shortcode: config.mpesaShortcode,
    environment:
      (config.mpesaEnvironment as "sandbox" | "production") || "sandbox",
    callbackUrl: config.mpesaCallbackUrl,
    initiatorName: "testapi",
    securityCredential: config.mpesaSecurityCredential,
    resultUrl: config.mpesaResultUrl,
    timeoutUrl: config.mpesaTimeoutUrl,
  },
  {
    callbackOptions: {
      onSuccess: async (data) => {
        console.log("Payment successful:", {
          amount: data.amount,
          phone: data.phoneNumber,
          receipt: data.mpesaReceiptNumber,
          transactionDate: data.transactionDate,
        });
        // TODO: Save to database
      },
      onFailure: async (data) => {
        console.log("Payment failed:", {
          resultCode: data.resultCode,
          resultDesc: data.resultDescription,
        });
        // TODO: Update database
      },
    },
  },
);
