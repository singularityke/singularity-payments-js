import Link from "next/link";
import {
  ReactLight,
  Vue,
  Svelte,
  ExpressjsLight,
  Nuxt,
  Nextjs,
} from "@ridemountainpig/svgl-react";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      <section className="relative overflow-hidden border-b border-fd-border bg-gradient-to-br from-fd-background via-fd-muted to-fd-accent/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative mx-auto max-w-6xl px-6 py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-primary/20 bg-fd-primary/10 px-4 py-1.5 text-sm font-medium text-fd-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fd-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-fd-primary"></span>
              </span>
              Payments SDK
            </div>
            <h1 className="text-6xl font-bold tracking-tight text-fd-foreground lg:text-7xl">
              M-Pesa Payments
              <span className="block mt-2 bg-gradient-to-r from-fd-primary to-fd-accent-foreground bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-fd-muted-foreground">
              The modern SDK for integrating M-Pesa payments. Type-safe, fully
              documented.
            </p>
            <div className="mt-12 flex items-center justify-center gap-4">
              <Link
                href="/docs/getting-started"
                className="rounded-lg bg-fd-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-fd-primary/30 transition-all hover:bg-fd-primary/90 hover:shadow-xl hover:shadow-fd-primary/40"
              >
                Get Started
              </Link>
              <a
                href="https://github.com/singularityke/singularity-payments-js"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-fd-border bg-fd-card px-8 py-4 text-base font-semibold text-fd-foreground transition-all hover:border-fd-primary/50 hover:bg-fd-muted"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-fd-border bg-gradient-to-b from-fd-card to-fd-background py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-fd-muted-foreground">
              Works with your favorite frameworks
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-16">
            <div className="group flex flex-col items-center gap-3 cursor-pointer">
              <div className="rounded-2xl border border-fd-border bg-fd-card p-5 transition-all group-hover:border-fd-primary/50 group-hover:shadow-lg group-hover:shadow-fd-primary/20 group-hover:-translate-y-1">
                <ReactLight className="h-14 w-14" />
              </div>
              <span className="text-sm font-medium text-fd-muted-foreground group-hover:text-fd-primary transition-colors">
                React
              </span>
            </div>
            <div className="group flex flex-col items-center gap-3 cursor-pointer">
              <div className="rounded-2xl border border-fd-border bg-fd-card p-5 transition-all group-hover:border-fd-primary/50 group-hover:shadow-lg group-hover:shadow-fd-primary/20 group-hover:-translate-y-1">
                <Nextjs className="h-14 w-14" />
              </div>
              <span className="text-sm font-medium text-fd-muted-foreground group-hover:text-fd-primary transition-colors">
                Next.js
              </span>
            </div>
            <div className="group flex flex-col items-center gap-3 cursor-pointer">
              <div className="rounded-2xl border border-fd-border bg-fd-card p-5 transition-all group-hover:border-fd-primary/50 group-hover:shadow-lg group-hover:shadow-fd-primary/20 group-hover:-translate-y-1">
                <Vue className="h-14 w-14" />
              </div>
              <span className="text-sm font-medium text-fd-muted-foreground group-hover:text-fd-primary transition-colors">
                Vue
              </span>
            </div>
            <div className="group flex flex-col items-center gap-3 cursor-pointer">
              <div className="rounded-2xl border border-fd-border bg-fd-card p-5 transition-all group-hover:border-fd-primary/50 group-hover:shadow-lg group-hover:shadow-fd-primary/20 group-hover:-translate-y-1">
                <Svelte className="h-14 w-14" />
              </div>
              <span className="text-sm font-medium text-fd-muted-foreground group-hover:text-fd-primary transition-colors">
                Svelte
              </span>
            </div>
            <div className="group flex flex-col items-center gap-3 cursor-pointer">
              <div className="rounded-2xl border border-fd-border bg-fd-card p-5 transition-all group-hover:border-fd-primary/50 group-hover:shadow-lg group-hover:shadow-fd-primary/20 group-hover:-translate-y-1">
                <ExpressjsLight className="h-14 w-14" />
              </div>
              <span className="text-sm font-medium text-fd-muted-foreground group-hover:text-fd-primary transition-colors">
                Express
              </span>
            </div>
            <div className="group flex flex-col items-center gap-3 cursor-pointer">
              <div className="rounded-2xl border border-fd-border bg-fd-card p-5 transition-all group-hover:border-fd-primary/50 group-hover:shadow-lg group-hover:shadow-fd-primary/20 group-hover:-translate-y-1">
                <Nuxt className="h-14 w-14" />
              </div>
              <span className="text-sm font-medium text-fd-muted-foreground group-hover:text-fd-primary transition-colors">
                Nuxt
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.05),transparent_50%)]"></div>
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="group relative rounded-2xl border border-fd-border bg-gradient-to-br from-fd-card to-fd-muted/30 p-8 transition-all hover:border-fd-primary/50 hover:shadow-2xl hover:shadow-fd-primary/10 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fd-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-fd-primary to-fd-primary/80 text-white shadow-lg shadow-fd-primary/30">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-fd-foreground">
                  Lightning Fast
                </h3>
                <p className="text-fd-muted-foreground leading-relaxed">
                  Optimized for performance with automatic retries, caching, and
                  intelligent polling. Get payment confirmations in seconds.
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl border border-fd-border bg-gradient-to-br from-fd-card to-fd-muted/30 p-8 transition-all hover:border-fd-primary/50 hover:shadow-2xl hover:shadow-fd-primary/10 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fd-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-fd-primary to-fd-primary/80 text-white shadow-lg shadow-fd-primary/30">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-fd-foreground">
                  Type Safe
                </h3>
                <p className="text-fd-muted-foreground leading-relaxed">
                  Built with TypeScript from the ground up. Full IntelliSense
                  support and compile-time safety for all M-Pesa operations.
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl border border-fd-border bg-gradient-to-br from-fd-card to-fd-muted/30 p-8 transition-all hover:border-fd-primary/50 hover:shadow-2xl hover:shadow-fd-primary/10 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fd-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-fd-primary to-fd-primary/80 text-white shadow-lg shadow-fd-primary/30">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-fd-foreground">
                  Well Documented
                </h3>
                <p className="text-fd-muted-foreground leading-relaxed">
                  Comprehensive guides, API references, and code examples. Get
                  started in minutes with our interactive documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-fd-border bg-gradient-to-b from-fd-muted/30 to-fd-background py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.08),transparent_60%)]"></div>
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-fd-primary/20 bg-fd-primary/10 px-4 py-1.5 text-sm font-medium text-fd-primary mb-4">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Three Steps to Success
            </div>
            <h2 className="text-5xl font-bold tracking-tight text-fd-foreground">
              Quick Start
            </h2>
            <p className="mt-6 text-xl text-fd-muted-foreground">
              Get up and running in minutes, not hours
            </p>
          </div>

          <div className="space-y-8">
            <div className="group relative">
              <div className="absolute -left-16 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-fd-primary to-fd-primary/80 text-lg font-bold text-white shadow-lg shadow-fd-primary/30 transition-transform group-hover:scale-110">
                1
              </div>
              <div className="rounded-2xl border border-fd-border bg-gradient-to-br from-fd-card to-fd-muted/30 p-8 transition-all group-hover:border-fd-primary/50 group-hover:shadow-xl group-hover:shadow-fd-primary/10">
                <h3 className="mb-5 text-2xl font-bold text-fd-foreground">
                  Install the package
                </h3>
                <div className="relative overflow-hidden rounded-xl border border-fd-border bg-fd-background/50 backdrop-blur-sm p-5 font-mono text-sm shadow-inner">
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
                  </div>
                  <code className="text-fd-primary">npm install</code>
                  <code className="text-fd-foreground">
                    {" "}
                    @singularity-payments/nextjs
                  </code>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -left-16 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-fd-primary to-fd-primary/80 text-lg font-bold text-white shadow-lg shadow-fd-primary/30 transition-transform group-hover:scale-110">
                2
              </div>
              <div className="rounded-2xl border border-fd-border bg-gradient-to-br from-fd-card to-fd-muted/30 p-8 transition-all group-hover:border-fd-primary/50 group-hover:shadow-xl group-hover:shadow-fd-primary/10">
                <h3 className="mb-5 text-2xl font-bold text-fd-foreground">
                  Configure M-Pesa client
                </h3>
                <div className="relative overflow-hidden rounded-xl border border-fd-border bg-fd-background/50 backdrop-blur-sm p-6 font-mono text-sm shadow-inner">
                  <div className="absolute top-4 right-4 flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
                  </div>
                  <pre className="text-fd-foreground leading-loose">
                    {`export const mpesa = createMpesa({
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  passkey: process.env.MPESA_PASSKEY!,
  shortcode: process.env.MPESA_SHORTCODE!,
  environment: "sandbox",
  callbackUrl: \`\${process.env.NEXT_PUBLIC_URL}/api/callback\`,
});`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -left-16 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-fd-primary to-fd-primary/80 text-lg font-bold text-white shadow-lg shadow-fd-primary/30 transition-transform group-hover:scale-110">
                3
              </div>
              <div className="rounded-2xl border border-fd-border bg-gradient-to-br from-fd-card to-fd-muted/30 p-8 transition-all group-hover:border-fd-primary/50 group-hover:shadow-xl group-hover:shadow-fd-primary/10">
                <h3 className="mb-5 text-2xl font-bold text-fd-foreground">
                  Initiate payments
                </h3>
                <div className="relative overflow-hidden rounded-xl border border-fd-border bg-fd-background/50 backdrop-blur-sm p-6 font-mono text-sm shadow-inner">
                  <div className="absolute top-4 right-4 flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
                  </div>
                  <pre className="text-fd-foreground leading-loose">
                    {`const response = await mpesa.client.stkPush({
  amount: 100,
  phoneNumber: "254712345678",
  accountReference: "ORDER-123",
  transactionDesc: "Payment for order",
});`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/docs/getting-started"
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-fd-primary to-fd-primary/90 px-10 py-5 text-lg font-semibold text-white shadow-xl shadow-fd-primary/40 transition-all hover:shadow-2xl hover:shadow-fd-primary/50 hover:-translate-y-0.5"
            >
              Read Full Documentation
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]"></div>
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-fd-primary/20 bg-fd-primary/10 px-4 py-1.5 text-sm font-medium text-fd-primary mb-4">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              React Integration
            </div>
            <h2 className="text-5xl font-bold tracking-tight text-fd-foreground">
              React Hooks Example
            </h2>
            <p className="mt-6 text-xl text-fd-muted-foreground">
              Simple payment integration with automatic status tracking
            </p>
          </div>

          <div className="group rounded-2xl border border-fd-border bg-gradient-to-br from-fd-card to-fd-muted/30 p-10 transition-all hover:border-fd-primary/50 hover:shadow-2xl hover:shadow-fd-primary/10">
            <div className="relative overflow-hidden rounded-xl border border-fd-border bg-fd-background/50 backdrop-blur-sm p-8 font-mono text-sm shadow-inner">
              <div className="absolute top-5 right-5 flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
              </div>
              <pre className="text-fd-foreground leading-loose">
                {`const { initiatePayment, CheckoutRequestID } = useMpesaPayment();
const { isSuccess, isFailed, status } = usePaymentStatus({
  CheckoutRequestID
});

await initiatePayment({
  amount: 100,
  phoneNumber: "254712345678",
  accountReference: "ORDER-123",
});`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-fd-border bg-gradient-to-b from-fd-card to-fd-background py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-fd-primary/20 bg-fd-primary/10 px-4 py-1.5 text-sm font-medium text-fd-primary mb-6">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Apache 2.0 Licensed
          </div>
          <h2 className="text-5xl font-bold tracking-tight text-fd-foreground">
            Ready to get started?
          </h2>
          <p className="mt-6 text-xl text-fd-muted-foreground">
            Join developers building the future of payments in Africa
          </p>
          <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/docs/getting-started"
              className="group rounded-xl bg-gradient-to-r from-fd-primary to-fd-primary/90 px-10 py-5 text-lg font-semibold text-white shadow-xl shadow-fd-primary/40 transition-all hover:shadow-2xl hover:shadow-fd-primary/50 hover:-translate-y-0.5"
            >
              View Documentation
            </Link>
            <a
              href="https://github.com/singularityke/singularity-payments-js"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border-2 border-fd-border bg-fd-background px-10 py-5 text-lg font-semibold text-fd-foreground transition-all hover:border-fd-primary/50 hover:bg-fd-muted hover:shadow-xl hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                Star on GitHub
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
