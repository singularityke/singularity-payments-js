
# Singularity Payments

A modern, type-safe TypeScript SDK for integrating M-Pesa payments into your applications. Built with developer experience in mind, featuring automatic retries, rate limiting, and comprehensive error handling.

[![npm version](https://img.shields.io/npm/v/@singularity-payments/core.svg)](https://www.npmjs.com/package/@singularity-payments/core)
[![License](https://img.shields.io/npm/l/@singularity-payments/core.svg)](https://github.com/yourusername/singularity-payments/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## Features

-  **Easy to Use** - Simple, intuitive API that gets you up and running in minutes
-  **Type Safe** - Full TypeScript support with comprehensive type definitions
-  **Auto Retry** - Built-in retry logic with exponential backoff for failed requests
-  **Rate Limiting** - Protect your application with configurable rate limits
-  **Multiple Frameworks** - Support for Next.js, Sveltekit, Nuxt, Express, Elysia, Hono, Fastify
-  **Secure** - IP validation, duplicate prevention, and secure credential handling
-  **Lightweight** - Minimal dependencies, optimized bundle size
-  **Great Documentation** - Detailed docs with real-world examples

## Supported M-Pesa APIs

-  STK Push (Lipa Na M-Pesa Online)
- STK Query ( STK Transaction Status)
-  C2B (Customer to Business)
-  B2C (Business to Customer)
- B2B (Business to Business)
-  Account Balance
-  Transaction Status
-  Reversal
-  Dynamic QR Code Generation

## Installation


```bash
# Next.js
npm install @singularity-payments/nextjs   @singularity-payments/react


# Sveltekit
npm install @singularity-payments/sveltekit  @singularity-payments/svelte

# Nuxt
npm install @singularity-payments/nuxt @singularity-payments/vue

# Express
npm install @singularity-payments/express

# Hono
npm install @singularity-payments/hono

# Fastify
npm install @singularity-payments/fastify

# Elysia
npm install @singularity-payments/elysia


```

## Quick Start

### 1. Get M-Pesa Credentials

Sign up at [Safaricom Daraja Portal](https://developer.safaricom.co.ke/) and get the Sandbox:
- Consumer Key
- Consumer Secret


### 2. Set Up Environment Variables

```bash
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_ENVIRONMENT=sandbox
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

### 3. Initialize Client

```typescript
import { MpesaClient } from "@singularity-payments/core";

const mpesa = new MpesaClient({
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  shortcode: process.env.MPESA_SHORTCODE!,
  passkey: process.env.MPESA_PASSKEY!,
  environment: "sandbox",
  callbackUrl: process.env.MPESA_CALLBACK_URL!,
});
```

### 4. Initiate Payment

```typescript
const response = await mpesa.stkPush({
  amount: 100,
  phoneNumber: "254712345678",
  accountReference: "INV-001",
  transactionDesc: "Payment for Order #001",
});

console.log(response.CheckoutRequestID);
```

### 5. Handle Callbacks

```typescript
const mpesa = new MpesaClient(config, {
  callbackOptions: {
    onSuccess: async (data) => {
      console.log("Payment successful:", data.mpesaReceiptNumber);
      // Update your database
      await db.orders.update({
        where: { checkoutRequestId: data.CheckoutRequestID },
        data: { status: "paid" },
      });
    },
    onFailure: async (data) => {
      console.log("Payment failed:", data.errorMessage);
      // Handle failure
    },
    validateIp: true,
  },
});
```



## Advanced Features

### Rate Limiting

Protect your application from excessive API calls:

```typescript
const mpesa = new MpesaClient(config, {
  rateLimitOptions: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60000,
  },
});
```

### Redis-Based Rate Limiting

For distributed systems:

```typescript
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

const mpesa = new MpesaClient(config, {
  rateLimitOptions: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60000,
    redis: redis,
  },
});
```

### Automatic Retries

Built-in retry logic with exponential backoff:

```typescript
const mpesa = new MpesaClient(config, {
  retryOptions: {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
  },
});
```

### Custom Timeout

Configure request timeout:

```typescript
const mpesa = new MpesaClient(config, {
  requestTimeout: 45000, // 45 seconds
});
```

### Duplicate Prevention

Prevent processing duplicate callbacks:

```typescript
const mpesa = new MpesaClient(config, {
  callbackOptions: {
    isDuplicate: async (checkoutRequestId) => {
      const existing = await db.transactions.findUnique({
        where: { checkoutRequestId },
      });
      return !!existing;
    },
  },
});
```

## Complete Payment Flow Example

```typescript
import { MpesaClient } from "@singularity-payments/core";
import { db } from "./db";

// Initialize client
const mpesa = new MpesaClient(
  {
    consumerKey: process.env.MPESA_CONSUMER_KEY!,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
    shortcode: process.env.MPESA_SHORTCODE!,
    passkey: process.env.MPESA_PASSKEY!,
    environment: "sandbox",
    callbackUrl: process.env.MPESA_CALLBACK_URL!,
  },
  {
    callbackOptions: {
      onSuccess: async (data) => {
        await db.payments.update({
          where: { checkoutRequestId: data.CheckoutRequestID },
          data: {
            status: "completed",
            mpesaReceiptNumber: data.mpesaReceiptNumber,
            transactionDate: new Date(data.transactionDate!),
          },
        });
      },
      onFailure: async (data) => {
        await db.payments.update({
          where: { checkoutRequestId: data.CheckoutRequestID },
          data: {
            status: "failed",
            errorMessage: data.errorMessage,
          },
        });
      },
      validateIp: true,
      isDuplicate: async (checkoutRequestId) => {
        const payment = await db.payments.findUnique({
          where: { checkoutRequestId },
        });
        return payment?.status === "completed";
      },
    },
    rateLimitOptions: {
      enabled: true,
      maxRequests: 100,
      windowMs: 60000,
    },
  },
);

// Initiate payment
async function initiatePayment(productId: string, phoneNumber: string) {
  // Get product details
  const product = await db.products.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Initiate STK Push
  const response = await mpesa.stkPush({
    amount: product.price,
    phoneNumber,
    accountReference: `ORDER-${productId}`,
    transactionDesc: `Payment for ${product.name}`,
  });

  // Save payment record
  await db.payments.create({
    data: {
      checkoutRequestId: response.CheckoutRequestID,
      merchantRequestId: response.MerchantRequestID,
      productId,
      phoneNumber,
      amount: product.price,
      status: "pending",
    },
  });

  return response;
}

// Query payment status
async function checkPaymentStatus(checkoutRequestId: string) {
  const status = await mpesa.stkQuery({ CheckoutRequestID: checkoutRequestId });

  if (status.ResultCode === "0") {
    console.log("Payment successful!");
  } else {
    console.log("Payment status:", status.ResultDesc);
  }

  return status;
}
```

## Error Handling

The SDK provides specific error types for better error handling:

```typescript
import {
  MpesaValidationError,
  MpesaTimeoutError,
  MpesaNetworkError,
} from "@singularity-payments/core";

try {
  const response = await mpesa.stkPush({
    amount: 100,
    phoneNumber: "254712345678",
    accountReference: "INV-001",
    transactionDesc: "Payment",
  });
} catch (error) {
  if (error instanceof MpesaValidationError) {
    console.error("Validation error:", error.message);
  } else if (error instanceof MpesaTimeoutError) {
    console.error("Request timed out:", error.message);
  } else if (error instanceof MpesaNetworkError) {
    console.error("Network error:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
```

## Testing

### Sandbox Environment

Use sandbox credentials for testing:

```typescript
const mpesa = new MpesaClient({
  consumerKey: "sandbox_consumer_key",
  consumerSecret: "sandbox_consumer_secret",
  shortcode: "174379",
  passkey: "sandbox_passkey",
  environment: "sandbox",
  callbackUrl: "https://yourdomain.com/api/mpesa/callback",
});
```



### C2B Simulation

Simulate C2B transactions in sandbox:

```typescript
const response = await mpesa.simulateC2B({
  amount: 100,
  phoneNumber: "254712345678",
  billRefNumber: "INV-001",
});
```

## API Reference

### STK Push

```typescript
interface STKPushRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
  callbackUrl?: string;
}
```

### B2C Payment

```typescript
interface B2CRequest {
  amount: number;
  phoneNumber: string;
  commandID: "BusinessPayment" | "SalaryPayment" | "PromotionPayment";
  remarks: string;
  occasion?: string;
  resultUrl?: string;
  timeoutUrl?: string;
}
```

### B2B Payment

```typescript
interface B2BRequest {
  amount: number;
  partyB: string;
  commandID: "BusinessPayBill" | "BusinessBuyGoods" | "DisburseFundsToBusiness";
  senderIdentifierType: "1" | "2" | "4";
  receiverIdentifierType: "1" | "2" | "4";
  remarks: string;
  accountReference: string;
  resultUrl?: string;
  timeoutUrl?: string;
}
```

## Documentation

Full documentation is available at [this link](https://payments-js.singularity.co.ke)

- [Getting Started](https://docs.singularity-payments.com/getting-started)
- [STK Push Guide](https://docs.singularity-payments.com/stk-push)
- [Rate Limiting](https://docs.singularity-payments.com/rate-limiting)
- [Error Handling](https://docs.singularity-payments.com/error-handling)
- [API Reference](https://docs.singularity-payments.com/api-reference)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

-  Email:  wambua_kelvin@outlook.com
-  Issues: [GitHub Issues](https://github.com/singularity.co.ke/singularity-payments-js/issues)
-  Docs: [Documentation](https://payments-js.singularity.co.ke)

## License

Apache 2.0 © [Singularity Payments](LICENSE)

## Acknowledgments

- Built on Top of [Safaricom M-Pesa](https://developer.safaricom.co.ke/)
- Inspired by the need for better payment integrations in Africa.

## Roadmap
- [ ] Comprehensive Testing for all packages(currently working on tests)
- [ ]  Demo Example
- [ ] Support for more payment providers (Airtel Money, Card Payments.)
- [ ] React Native SDK
- [ ] Prebuilt Checkout Components
- [ ] Additional Frameworks( Remix, Astro, Solid, Qwik, Angular)


