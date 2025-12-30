export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    mpesaConsumerKey: process.env.MPESA_CONSUMER_KEY,
    mpesaConsumerSecret: process.env.MPESA_CONSUMER_SECRET,
    mpesaPasskey: process.env.MPESA_PASSKEY,
    mpesaShortcode: process.env.MPESA_SHORTCODE,
    mpesaEnvironment: process.env.MPESA_ENVIRONMENT,
    mpesaCallbackUrl: process.env.MPESA_CALLBACK_URL,
    mpesaInitiatorName: process.env.MPESA_INITIATOR_NAME,
    mpesaSecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
    mpesaResultUrl: process.env.MPESA_RESULT_URL,
    mpesaTimeoutUrl: process.env.MPESA_TIMEOUT_URL,
  },
  routeRules: {
    "/api/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin":
          "https://sliverlike-unpredaceously-ariana.ngrok-free.dev",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  },
  vite: {
    server: {
      allowedHosts: [".ngrok-free.dev", ".ngrok.io"],
    },
  },
});
